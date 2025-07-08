import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const characters = pgTable('characters', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  alignment: varchar('alignment', { length: 256 }).notNull(),
  intelligence: integer('intelligence').notNull(),
  strength: integer('strength').notNull(),
  speed: integer('speed').notNull(),
  durability: integer('durability').notNull(),
  power: integer('power').notNull(),
  combat: integer('combat').notNull(),
  total: integer('total').notNull(),
});

export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;