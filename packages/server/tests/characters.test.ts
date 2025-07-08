import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, makeRequest } from './helpers/createTestServer.js';

test('GET /characters - returns empty array initially', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const response = await makeRequest(`${baseUrl}/characters`);
    
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
    assert.equal(response.headers['content-type'], 'application/json');
  } finally {
    await cleanup();
  }
});

test('POST /characters - creates a new character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const newCharacter = {
      name: 'Spider-Man',
      alignment: 'good',
      intelligence: 90,
      strength: 55,
      speed: 67,
      durability: 75,
      power: 74,
      combat: 85,
      total: 446
    };
    
    const response = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCharacter)
    });
    
    assert.equal(response.status, 201);
    assert.equal(response.body.name, 'Spider-Man');
    assert.equal(response.body.alignment, 'good');
    assert.ok(response.body.id);
    
    // Verify it was saved
    const getResponse = await makeRequest(`${baseUrl}/characters`);
    assert.equal(getResponse.body.length, 1);
    assert.equal(getResponse.body[0].name, 'Spider-Man');
  } finally {
    await cleanup();
  }
});

test('GET /characters/:id - retrieves a specific character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create a character first
    const character = {
      name: 'Batman',
      alignment: 'good',
      intelligence: 100,
      strength: 26,
      speed: 27,
      durability: 50,
      power: 47,
      combat: 100,
      total: 350
    };
    
    const createResponse = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    
    const characterId = createResponse.body.id;
    
    // Get the character by ID
    const getResponse = await makeRequest(`${baseUrl}/characters/${characterId}`);
    
    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.body.name, 'Batman');
    assert.equal(getResponse.body.id, characterId);
  } finally {
    await cleanup();
  }
});

test('GET /characters/:id - returns 404 for non-existent character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const response = await makeRequest(`${baseUrl}/characters/non-existent-id`);
    
    assert.equal(response.status, 404);
    assert.equal(response.body.error, 'Character not found');
  } finally {
    await cleanup();
  }
});

test('PUT /characters/:id - updates an existing character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create a character
    const character = {
      name: 'Superman',
      alignment: 'good',
      intelligence: 94,
      strength: 100,
      speed: 100,
      durability: 100,
      power: 100,
      combat: 85,
      total: 579
    };
    
    const createResponse = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    
    const characterId = createResponse.body.id;
    
    // Update the character
    const updates = {
      combat: 90,
      total: 584
    };
    
    const updateResponse = await makeRequest(`${baseUrl}/characters/${characterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    assert.equal(updateResponse.status, 200);
    assert.equal(updateResponse.body.combat, 90);
    assert.equal(updateResponse.body.total, 584);
    assert.equal(updateResponse.body.name, 'Superman'); // Original fields preserved
  } finally {
    await cleanup();
  }
});

test('PUT /characters/:id - returns 404 for non-existent character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const response = await makeRequest(`${baseUrl}/characters/non-existent-id`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    });
    
    assert.equal(response.status, 404);
    assert.equal(response.body.error, 'Character not found');
  } finally {
    await cleanup();
  }
});

test('DELETE /characters/:id - deletes an existing character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create a character
    const character = {
      name: 'Joker',
      alignment: 'bad',
      intelligence: 100,
      strength: 10,
      speed: 12,
      durability: 60,
      power: 43,
      combat: 70,
      total: 295
    };
    
    const createResponse = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    
    const characterId = createResponse.body.id;
    
    // Delete the character
    const deleteResponse = await makeRequest(`${baseUrl}/characters/${characterId}`, {
      method: 'DELETE'
    });
    
    assert.equal(deleteResponse.status, 204);
    assert.equal(deleteResponse.text, ''); // No content
    
    // Verify it was deleted
    const getResponse = await makeRequest(`${baseUrl}/characters/${characterId}`);
    assert.equal(getResponse.status, 404);
  } finally {
    await cleanup();
  }
});

test('DELETE /characters/:id - returns 404 for non-existent character', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const response = await makeRequest(`${baseUrl}/characters/non-existent-id`, {
      method: 'DELETE'
    });
    
    assert.equal(response.status, 404);
    assert.equal(response.body.error, 'Character not found');
  } finally {
    await cleanup();
  }
});

test('Multiple servers can run in parallel with isolated databases', async () => {
  const server1 = await createTestServer();
  const server2 = await createTestServer();
  
  try {
    // Create character in server1
    const character1 = { name: 'Server1 Character', alignment: 'good' };
    await makeRequest(`${server1.baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character1)
    });
    
    // Create character in server2
    const character2 = { name: 'Server2 Character', alignment: 'bad' };
    await makeRequest(`${server2.baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character2)
    });
    
    // Verify isolation
    const response1 = await makeRequest(`${server1.baseUrl}/characters`);
    const response2 = await makeRequest(`${server2.baseUrl}/characters`);
    
    assert.equal(response1.body.length, 1);
    assert.equal(response1.body[0].name, 'Server1 Character');
    
    assert.equal(response2.body.length, 1);
    assert.equal(response2.body[0].name, 'Server2 Character');
  } finally {
    await server1.cleanup();
    await server2.cleanup();
  }
});