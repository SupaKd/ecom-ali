import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const app = express();
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API E-commerce en ligne',
    timestamp: new Date().toISOString()
  });
});

describe('Health Check API', () => {
  it('devrait retourner le statut de l\'API', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message', 'API E-commerce en ligne');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('devrait retourner un timestamp valide', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });
});
