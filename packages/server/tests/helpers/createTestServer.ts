import { Server } from 'http';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../src/db/schema.js';
import createServer from '../../src/createServer.js';
import type { Context } from '../../src/types.js';

interface TestServerInstance {
  server: Server;
  port: number;
  baseUrl: string;
  cleanup: () => Promise<void>;
}

export async function createTestServer(): Promise<TestServerInstance> {
  // Use process.hrtime for better uniqueness
  const [seconds, nanoseconds] = process.hrtime();
  const testId = `${seconds}${nanoseconds}${Math.random().toString(36).substring(2)}`;
  
  // Create in-memory SQLite database for testing
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });
  
  // Create the characters table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      alignment TEXT NOT NULL,
      intelligence INTEGER NOT NULL,
      strength INTEGER NOT NULL,
      speed INTEGER NOT NULL,
      durability INTEGER NOT NULL,
      power INTEGER NOT NULL,
      combat INTEGER NOT NULL,
      total INTEGER NOT NULL
    )
  `);

  // Use a wider port range and retry on EADDRINUSE
  let port: number;
  let server: Server;
  let retries = 0;
  const maxRetries = 10;
  
  while (retries < maxRetries) {
    port = 10000 + Math.floor(Math.random() * 40000);
    
    const context: Context = {
      config: {
        port
      },
      db
    };

    server = createServer(context);
    
    try {
      await new Promise<void>((resolve, reject) => {
        server.on('listening', () => resolve());
        server.on('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            server.close();
            reject(err);
          } else {
            reject(err);
          }
        });
      });
      break; // Successfully started
    } catch (err: any) {
      if (err.code === 'EADDRINUSE' && retries < maxRetries - 1) {
        retries++;
        continue;
      }
      throw err;
    }
  }

  const cleanup = async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    
    try {
      sqlite.close();
    } catch (error) {
      // Ignore cleanup errors
    }
  };

  return {
    server: server!,
    port: port!,
    baseUrl: `http://localhost:${port!}`,
    cleanup
  };
}

export async function makeRequest(
  url: string,
  options: RequestInit = {}
): Promise<{
  status: number;
  headers: Record<string, string>;
  body: any;
  text: string;
}> {
  const response = await fetch(url, options);
  const text = await response.text();
  
  let body: any;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    status: response.status,
    headers,
    body,
    text
  };
}