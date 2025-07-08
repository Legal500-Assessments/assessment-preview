import http from 'http';
import sendJSON from '../../utils/sendJSON.js';
import { updateCharacter } from '../../models/Character.js';
import { Context, RequestContext } from '../../types.js';

export default async function updateCharacterController(context: Context, req: http.IncomingMessage, res: http.ServerResponse, { params, body }: RequestContext) {
  const updated_Character = await updateCharacter(context, "1", body);
  
  if (!updated_Character) {
    sendJSON(res, 404, { error: 'Character not found' });
    return;
  }

  sendJSON(res, 200, updated_Character);
}
