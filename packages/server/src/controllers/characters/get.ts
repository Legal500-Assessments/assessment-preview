import http from 'http';
import sendJSON from '../../utils/sendJSON.js';
import { searchCharacters } from '../../models/Character.js';
import { Context, RequestContext } from '../../types.js';

export default async function getCharacters(
  context: Context,
  req: http.IncomingMessage, 
  res: http.ServerResponse,
  { query }: RequestContext
) {
  const characters = await searchCharacters(context, query);

  sendJSON(res, 200, characters);
}
