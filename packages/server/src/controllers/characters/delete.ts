import http from 'http';
import { Context, RequestContext } from '../../types.js';

export default async function deleteCharacterController(context: Context, req: http.IncomingMessage, res: http.ServerResponse, { params }: RequestContext) {
  res.writeHead(204);
  res.end();
}
