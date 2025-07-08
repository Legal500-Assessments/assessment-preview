import createServer from './createServer';
import type { Context } from './types';
import { db } from './db/index.js';

const context : Context = {
  config: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001
  },
  db
};

createServer(context);
