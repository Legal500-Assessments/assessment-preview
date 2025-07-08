import http from 'node:http';
import { URLPattern } from './utils/urlPattern.js';
import getCharacters from './controllers/characters/get.js';
import getCharacterById from './controllers/characters/getById.js';
import createCharacter from './controllers/characters/post.js';
import updateCharacter from './controllers/characters/put.js';
import deleteCharacter from './controllers/characters/delete.js';
import getCharacterImage from './controllers/characters/getImage.js';
import sendJSON from './utils/sendJSON.js';
import parseBody from './utils/parseBody.js';
import type { Context, RequestContext } from './types.js';

function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

interface Route {
  pattern: URLPattern;
  method: string;
  handler: (req: http.IncomingMessage, res: http.ServerResponse, params?: any) => Promise<void>;
}

function createRequestContext(url: URL, patternResult: any, body?: any): RequestContext {
  return {
    url,
    query: Object.fromEntries(url.searchParams),
    params: patternResult?.pathname?.groups || {},
    body
  };
}

function createRoutes(context: Context): Route[] {
  return [
    {
      pattern: new URLPattern({ pathname: '/characters' }),
      method: 'GET',
      handler: async (req, res, result) => {
        const requestContext = createRequestContext(new URL(req.url || '', `http://localhost:${context.config.port}`), result);
        return getCharacters(context, req, res, requestContext);
      }
    },
    {
      pattern: new URLPattern({ pathname: '/characters/:ID' }),
      method: 'GET',
      handler: async (req, res, result) => {
        const requestContext = createRequestContext(new URL(req.url || '', `http://localhost:${context.config.port}`), result);
        return getCharacterById(context, req, res, requestContext);
      }
    },
    {
      pattern: new URLPattern({ pathname: '/characters' }),
      method: 'POST',
      handler: async (req, res, result) => {
        try {
          const body = await parseBody(req);
          const requestContext = createRequestContext(new URL(req.url || '', `http://localhost:${context.config.port}`), result, body);
          return createCharacter(context, req, res, requestContext);
        } catch (error) {
          if (error instanceof SyntaxError) {
            return sendJSON(res, 400, { error: 'Invalid JSON' });
          }
          throw error;
        }
      }
    },
    {
      pattern: new URLPattern({ pathname: '/characters/:id' }),
      method: 'PUT',
      handler: async (req, res, result) => {
        try {
          const body = await parseBody(req);
          const requestContext = createRequestContext(new URL(req.url || '', `http://localhost:${context.config.port}`), result, body);
          return updateCharacter(context, req, res, requestContext);
        } catch (error) {
          if (error instanceof SyntaxError) {
            return sendJSON(res, 400, { error: 'Invalid JSON' });
          }
          throw error;
        }
      }
    },
    {
      pattern: new URLPattern({ pathname: '/characters/:id' }),
      method: 'DELETE',
      handler: async (req, res, result) => {
        const requestContext = createRequestContext(new URL(req.url || '', `http://localhost:${context.config.port}`), result);
        return deleteCharacter(context, req, res, requestContext);
      }
    },
    {
      pattern: new URLPattern({ pathname: '/characters/:id/image' }),
      method: 'GET',
      handler: async (req, res, result) => {
        const requestContext = createRequestContext(new URL(req.url || '', `http://localhost:${context.config.port}`), result);
        return getCharacterImage(context, req, res, requestContext);
      }
    }
  ];
}

export default function createServer(context: Context) {
  const routes = createRoutes(context);
  
  const server = http.createServer(async (req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '', `http://localhost:${context.config.port}`);

    try {
      let routeMatched = false;
      
      for (const route of routes) {
        const result = route.pattern.exec(url);
        if (result && req.method === route.method) {
          await route.handler(req, res, result);
          routeMatched = true;
          break;
        }
      }

      if (!routeMatched) {
        sendJSON(res, 404, { error: 'Not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      sendJSON(res, 500, { error: 'Internal server error' });
    }
  });

  server.listen(context.config.port, () => {
    console.log(`Server running at http://localhost:${context.config.port}`);
  });

  return server;
}
