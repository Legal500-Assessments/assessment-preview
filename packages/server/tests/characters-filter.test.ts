import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, makeRequest } from './helpers/createTestServer.js';

test('GET /characters?name=... - filters by name', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create multiple characters
    const characters = [
      { name: 'Spider-Man', alignment: 'good' },
      { name: 'Spider-Woman', alignment: 'good' },
      { name: 'Iron Man', alignment: 'good' },
      { name: 'Doctor Doom', alignment: 'bad' }
    ];
    
    for (const character of characters) {
      await makeRequest(`${baseUrl}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      });
    }
    
    // Filter by exact name
    const response = await makeRequest(`${baseUrl}/characters?name=Spider-Man`);
    
    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].name, 'Spider-Man');
  } finally {
    await cleanup();
  }
});

test('GET /characters?alignment=... - filters by alignment', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create characters with different alignments
    const characters = [
      { name: 'Batman', alignment: 'good' },
      { name: 'Superman', alignment: 'good' },
      { name: 'Joker', alignment: 'bad' },
      { name: 'Lex Luthor', alignment: 'bad' },
      { name: 'Deadpool', alignment: 'neutral' }
    ];
    
    for (const character of characters) {
      await makeRequest(`${baseUrl}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      });
    }
    
    // Filter by alignment
    const goodResponse = await makeRequest(`${baseUrl}/characters?alignment=good`);
    assert.equal(goodResponse.status, 200);
    assert.equal(goodResponse.body.length, 2);
    assert.ok(goodResponse.body.every((c: any) => c.alignment === 'good'));
    
    const badResponse = await makeRequest(`${baseUrl}/characters?alignment=bad`);
    assert.equal(badResponse.status, 200);
    assert.equal(badResponse.body.length, 2);
    assert.ok(badResponse.body.every((c: any) => c.alignment === 'bad'));
    
    const neutralResponse = await makeRequest(`${baseUrl}/characters?alignment=neutral`);
    assert.equal(neutralResponse.status, 200);
    assert.equal(neutralResponse.body.length, 1);
    assert.equal(neutralResponse.body[0].name, 'Deadpool');
  } finally {
    await cleanup();
  }
});

test('GET /characters - case insensitive filtering', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create character
    await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Spider-Man', alignment: 'Good' })
    });
    
    // Test case variations
    const testCases = [
      'spider-man',
      'SPIDER-MAN',
      'Spider-Man',
      'SpIdEr-MaN'
    ];
    
    for (const testName of testCases) {
      const response = await makeRequest(`${baseUrl}/characters?name=${testName}`);
      assert.equal(response.status, 200);
      assert.equal(response.body.length, 1);
      assert.equal(response.body[0].name, 'Spider-Man');
    }
    
    // Test alignment case insensitivity
    const alignmentTests = ['good', 'GOOD', 'Good', 'GoOd'];
    for (const alignment of alignmentTests) {
      const response = await makeRequest(`${baseUrl}/characters?alignment=${alignment}`);
      assert.equal(response.status, 200);
      assert.equal(response.body.length, 1);
    }
  } finally {
    await cleanup();
  }
});

test('GET /characters - multiple query parameters', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create characters
    const characters = [
      { name: 'Spider-Man', alignment: 'good', intelligence: 90 },
      { name: 'Spider-Man 2099', alignment: 'good', intelligence: 95 },
      { name: 'Spider-Man', alignment: 'bad', intelligence: 90 }, // Evil version
      { name: 'Iron Man', alignment: 'good', intelligence: 100 }
    ];
    
    for (const character of characters) {
      await makeRequest(`${baseUrl}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      });
    }
    
    // Filter by name AND alignment
    const response = await makeRequest(`${baseUrl}/characters?name=Spider-Man&alignment=good`);
    
    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].name, 'Spider-Man');
    assert.equal(response.body[0].alignment, 'good');
  } finally {
    await cleanup();
  }
});

test('GET /characters - returns empty array when no matches', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create some characters
    await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Batman', alignment: 'good' })
    });
    
    // Search for non-existent character
    const response = await makeRequest(`${baseUrl}/characters?name=Superman`);
    
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  } finally {
    await cleanup();
  }
});

test('GET /characters - ignores unknown query parameters', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create a character
    await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Thor', alignment: 'good' })
    });
    
    // Query with unknown parameter
    const response = await makeRequest(`${baseUrl}/characters?unknownParam=value&name=Thor`);
    
    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1); // Should return the character matching name=Thor, ignoring unknownParam
  } finally {
    await cleanup();
  }
});

test('GET /characters - filters by numeric fields', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create characters with stats
    const characters = [
      { name: 'Hulk', alignment: 'good', strength: 100 },
      { name: 'Thor', alignment: 'good', strength: 100 },
      { name: 'Captain America', alignment: 'good', strength: 19 }
    ];
    
    for (const character of characters) {
      await makeRequest(`${baseUrl}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      });
    }
    
    // Filter by strength
    const response = await makeRequest(`${baseUrl}/characters?strength=100`);
    
    assert.equal(response.status, 200);
    assert.equal(response.body.length, 2);
    assert.ok(response.body.every((c: any) => c.strength === 100));
  } finally {
    await cleanup();
  }
});