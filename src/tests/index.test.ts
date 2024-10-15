import request from 'supertest';
import { app } from '../index';

describe('POST /api/token', () =>
{
  it('devrait générer un token', async () =>
    {
    const response = await request(app)
      .post('/api/token')
      .send({ email: 'foo@bar.com' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('devrait retourner une erreur si l\'email est manquant', async () =>
    {
    const response = await request(app).post('/api/token').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Email required');
  });
});

describe('POST /api/justify', () =>
    {
      it('devrait retourner du texte justifié', async () => {
        const tokenResponse = await request(app)
          .post('/api/token')
          .send({ email: 'foo@bar.com' });
      
        const token = tokenResponse.body.token;
      
        const justifyResponse = await request(app)
          .post('/api/justify')
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'text/plain')
          .send('Ceci est un texte à justifier.');
      
        expect(justifyResponse.status).toBe(200);
        expect(justifyResponse.text).toBeDefined();
      });
  
    it('devrait retourner une erreur si le token est manquant', async () => {
      const response = await request(app).post('/api/justify').send('Texte à justifier.');
  
      expect(response.status).toBe(401);
      expect(response.text).toBe('Token required');
    });
  });
  
