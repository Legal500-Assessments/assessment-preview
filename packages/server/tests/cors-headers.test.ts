import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer, makeRequest } from './helpers/createTestServer.js';

test('CORS headers are set correctly for all endpoints', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Test GET request
    const getResponse = await makeRequest(`${baseUrl}/characters`);
    assert.equal(getResponse.headers['access-control-allow-origin'], '*');
    assert.equal(getResponse.headers['access-control-allow-methods'], 'GET, POST, PUT, DELETE, OPTIONS');
    assert.equal(getResponse.headers['access-control-allow-headers'], 'Content-Type');
    
    // Test POST request
    const postResponse = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', alignment: 'good' })
    });
    assert.equal(postResponse.headers['access-control-allow-origin'], '*');
    
    // Test PUT request (404 but should still have CORS headers)
    const putResponse = await makeRequest(`${baseUrl}/characters/123`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    });
    assert.equal(putResponse.headers['access-control-allow-origin'], '*');
    
    // Test DELETE request (404 but should still have CORS headers)
    const deleteResponse = await makeRequest(`${baseUrl}/characters/123`, {
      method: 'DELETE'
    });
    assert.equal(deleteResponse.headers['access-control-allow-origin'], '*');
  } finally {
    await cleanup();
  }
});

test('OPTIONS requests are handled correctly', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const response = await makeRequest(`${baseUrl}/characters`, {
      method: 'OPTIONS'
    });
    
    assert.equal(response.status, 204);
    assert.equal(response.text, ''); // No content
    assert.equal(response.headers['access-control-allow-origin'], '*');
    assert.equal(response.headers['access-control-allow-methods'], 'GET, POST, PUT, DELETE, OPTIONS');
    assert.equal(response.headers['access-control-allow-headers'], 'Content-Type');
  } finally {
    await cleanup();
  }
});

test('Content-Type header is set correctly for JSON responses', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Test successful response
    const successResponse = await makeRequest(`${baseUrl}/characters`);
    assert.equal(successResponse.headers['content-type'], 'application/json');
    
    // Test error response
    const errorResponse = await makeRequest(`${baseUrl}/not-found`);
    assert.equal(errorResponse.headers['content-type'], 'application/json');
    
    // Create a character and check response
    const createResponse = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', alignment: 'good' })
    });
    assert.equal(createResponse.headers['content-type'], 'application/json');
  } finally {
    await cleanup();
  }
});

test('Server responds to preflight requests correctly', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Simulate a preflight request
    const response = await makeRequest(`${baseUrl}/characters/123`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://example.com',
        'Access-Control-Request-Method': 'DELETE',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    assert.equal(response.status, 204);
    assert.equal(response.headers['access-control-allow-origin'], '*');
    assert.ok(response.headers['access-control-allow-methods'].includes('DELETE'));
    assert.ok(response.headers['access-control-allow-headers'].includes('Content-Type'));
  } finally {
    await cleanup();
  }
});

test('Custom headers in requests are handled correctly', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Send request with custom headers
    const response = await makeRequest(`${baseUrl}/characters`, {
      headers: {
        'X-Custom-Header': 'test-value',
        'User-Agent': 'TestAgent/1.0'
      }
    });
    
    // Server should respond normally
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  } finally {
    await cleanup();
  }
});

test('Image endpoint returns correct content type', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    // Create a character first
    const createResponse = await makeRequest(`${baseUrl}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Image Test', alignment: 'good' })
    });
    
    const characterId = createResponse.body.id;
    
    // Get the image
    const imageResponse = await makeRequest(`${baseUrl}/characters/${characterId}/image`);
    
    // Check status and headers
    assert.equal(imageResponse.status, 200);
    assert.ok(imageResponse.headers['content-type']?.includes('image/'));
    assert.equal(imageResponse.headers['access-control-allow-origin'], '*');
  } finally {
    await cleanup();
  }
});

test('Server handles different Origin headers correctly', async () => {
  const { baseUrl, cleanup } = await createTestServer();
  
  try {
    const origins = [
      'http://localhost:3000',
      'https://example.com',
      'http://evil-site.com',
      'null'
    ];
    
    for (const origin of origins) {
      const response = await makeRequest(`${baseUrl}/characters`, {
        headers: { 'Origin': origin }
      });
      
      // Should always return * for allow-origin
      assert.equal(response.headers['access-control-allow-origin'], '*');
      assert.equal(response.status, 200);
    }
  } finally {
    await cleanup();
  }
});