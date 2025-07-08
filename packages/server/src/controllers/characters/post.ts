import http from 'http';
import sendJSON from '../../utils/sendJSON.js';
import { createCharacter } from '../../models/Character.js';
import { RequestContext, Context } from '../../types.js';

export default async function createCharacterController(context: Context, req: http.IncomingMessage, res: http.ServerResponse, { url, query, params, body }: RequestContext) {
  if (!body || Object.keys(body).length === 0) {
    sendJSON(res, 400, { error: 'Request body cannot be empty' });
    return;
  }

  if (!body.Name) {
    sendJSON(res, 400, { error: 'Name is required' });
    return;
  }

  const newCharacter = await createCharacter(context, body);
  sendJSON(res, 201, newCharacter);
}
