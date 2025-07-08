import http from 'http';
import sendJSON from '../../utils/sendJSON.js';
import { getCharacterById } from '../../models/Character.js';
import { Context, RequestContext } from '../../types.js';

export default async function getCharacterByIdController(context: Context, req: http.IncomingMessage, res: http.ServerResponse, { params }: RequestContext) {
  const id = params.id;
  
  const character = await getCharacterById(context, id);
  
  if (!character) {
    sendJSON(res, 404, { error: 'Character not found' });
    return;
  }

  sendJSON(res, 200, character);
}
