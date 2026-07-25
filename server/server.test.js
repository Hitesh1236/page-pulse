const request = require('supertest');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');


describe('GET /api/audit Tests', () => {
  
  test('Happy Path: Returns correct JSON audit for valid URL', async () => {
    const response = await request('http://localhost:5000')
      .post('/api/audit')
      .send({ url: 'https://example.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('responseTimeMs');
    expect(response.body).toHaveProperty('h1Count');
    expect(response.body).toHaveProperty('imagesMissingAlt');
    expect(response.body).toHaveProperty('wordCount');
  });

  test('Failure Case 1: Rejects invalid URL with 400 status', async () => {
    const response = await request('http://localhost:5000')
      .post('/api/audit')
      .send({ url: 'invalid-url-format' });

    // Handles format gracefully without crashing
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('Failure Case 2: Handles non-existent domain gracefully', async () => {
    const response = await request('http://localhost:5000')
      .post('/api/audit')
      .send({ url: 'https://thisdomaindefinitelydoesnotexist12345.com' });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty('error');
  });
});