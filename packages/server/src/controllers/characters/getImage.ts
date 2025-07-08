import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sendJSON from '../../utils/sendJSON.js';
import { RequestContext, Context } from '../../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageMap: Record<string, string> = {
  '1': 'professor-light.png',
  '2': 'dark-shadow.png',
  '3': 'thunder-woman.png',
  '4': 'earth-guardian.png',
  '5': 'wind-rider.png',
  '6': 'thunder-woman.png',
  '7': 'professor-light.png',
  '8': 'flame-knight.png',
  '9': 'earth-guardian.png',
  '10': 'mind-master.png',
  '11': 'chaos-king.png',
  '12': 'mind-master.png',
  '13': 'chaos-king.png',
  '14': 'dark-shadow.png',
  '15': 'time-lord.png',
  '16': 'flame-knight.png',
  '17': 'dark-shadow.png',
  '18': 'mind-master.png',
  '19': 'wind-rider.png',
  '20': 'thunder-woman.png',
  '21': 'wind-rider.png',
  '22': 'ice-queen.png'
};

export default async function getCharacterImage(context: Context, req: http.IncomingMessage, res: http.ServerResponse, { params }: RequestContext) {
  // First check if character exists
  const { getCharacterById } = await import('../../models/Character.js');
  const character = await getCharacterById(context, params.id);
  
  if (!character) {
    sendJSON(res, 404, { error: 'Character not found' });
    return;
  }

  const mediaPath = path.join(path.dirname(__dirname), 'media/characters');
  const imageName = imageMap[params.id];
  
  if (!imageName) {
    // Return a default image or placeholder
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.writeHead(200);
    res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')); // 1x1 transparent PNG
    return;
  }

  try {
    const imagePath = path.join(mediaPath, imageName);
    const imageBuffer = await fs.readFile(imagePath);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.writeHead(200);
    res.end(imageBuffer);
  } catch (error) {
    // If image file doesn't exist, return placeholder
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.writeHead(200);
    res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')); // 1x1 transparent PNG
  }
}
