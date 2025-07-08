import { eq, and, sql } from 'drizzle-orm';
import { Context } from '../types.js';
import { characters, Character as DbCharacter } from '../db/schema.js';

interface SearchQuery {
  name?: string;
  alignment?: string;
  intelligence?: string | number;
  strength?: string | number;
  speed?: string | number;
  durability?: string | number;
  power?: string | number;
  combat?: string | number;
  total?: string | number;
  [key: string]: any;
}

export async function searchCharacters(context: Context, query?: SearchQuery): Promise<DbCharacter[]> {
  if (!context.db) throw new Error('Database not initialized');
  
  if (!query || Object.keys(query).length === 0) {
    return await (context.db as any).select().from(characters);
  }

  const conditions = [];
  
  if (query.name) {
    conditions.push(sql`LOWER(${characters.name}) = LOWER(${query.name})`);
  }
  if (query.alignment) {
    conditions.push(sql`LOWER(${characters.alignment}) = LOWER(${query.alignment})`);
  }
  
  // Handle numeric fields
  const numericFields = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat', 'total'];
  for (const field of numericFields) {
    if (query[field] !== undefined) {
      const value = typeof query[field] === 'string' ? parseInt(query[field], 10) : query[field];
      conditions.push(eq((characters as any)[field], value));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await (context.db as any)
    .select()
    .from(characters)
    .where(whereClause);
}

export async function getCharacterById(context: Context, id: string): Promise<DbCharacter | null> {
  if (!context.db) throw new Error('Database not initialized');
  
  const result = await (context.db as any)
    .select()
    .from(characters)
    .where(eq(characters.id, id))
    .limit(1);
    
  return result[0] || null;
}

export async function createCharacter(context: Context, characterData: Partial<DbCharacter>): Promise<DbCharacter> {
  if (!context.db) throw new Error('Database not initialized');
  
  const newCharacter = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
    name: '',
    alignment: '',
    intelligence: 0,
    strength: 0,
    speed: 0,
    durability: 0,
    power: 0,
    combat: 0,
    total: 0,
    ...characterData
  } as DbCharacter;
  
  try {
    const result = await (context.db as any)
      .insert(characters)
      .values(newCharacter)
      .returning();
    return result[0];
  } catch (error) {
    // SQLite might not support .returning(), so insert and then select
    await (context.db as any)
      .insert(characters)
      .values(newCharacter);
    return newCharacter;
  }
}

export async function updateCharacter(context: Context, id: string, updates: Partial<DbCharacter>): Promise<DbCharacter | null> {
  if (!context.db) throw new Error('Database not initialized');
  
  try {
    const result = await (context.db as any)
      .update(characters)
      .set(updates)
      .where(eq(characters.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    // SQLite might not support .returning(), so update and then select
    await (context.db as any)
      .update(characters)
      .set(updates)
      .where(eq(characters.id, id));
    
    return await getCharacterById(context, id);
  }
}

export async function deleteCharacter(context: Context, id: string): Promise<boolean> {
  if (!context.db) throw new Error('Database not initialized');
  
  try {
    const result = await (context.db as any)
      .delete(characters)
      .where(eq(characters.id, id))
      .returning();
    return result.length > 0;
  } catch (error) {
    // SQLite might not support .returning(), so check if exists first, then delete
    const existing = await getCharacterById(context, id);
    if (!existing) return false;
    
    await (context.db as any)
      .delete(characters)
      .where(eq(characters.id, id));
    
    return true;
  }
}