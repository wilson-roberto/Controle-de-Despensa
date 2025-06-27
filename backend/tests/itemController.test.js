const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Item = require('../models/Item');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  // A conexão já é feita pelo server.js usando a URI do ambiente de teste
  process.env.MONGODB_URI = mongoServer.getUri();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Item.deleteMany({});
});

describe('Item Controller', () => {
  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const item1 = await Item.create({
        nome: 'Arroz',
        unidade: 'kg',
        quantidadeEntrada: 10,
        quantidadeSaida: 2,
        totalEstoque: 8
      });

      const item2 = await Item.create({
        nome: 'Feijão',
        unidade: 'kg',
        quantidadeEntrada: 5,
        quantidadeSaida: 1,
        totalEstoque: 4
      });

      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBe('Arroz');
      expect(response.body[1].nome).toBe('Feijão');
    });

    it('should return empty array when no items exist', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const itemData = {
        nome: 'Arroz Branco',
        unidade: 'kg',
        quantidadeEntrada: 10,
        quantidadeSaida: 2,
        dataValidade: '2024-12-31',
        limiteEstoque: 5
      };

      const response = await request(app)
        .post('/api/items')
        .send(itemData)
        .expect(201);

      expect(response.body.nome).toBe('Arroz Branco');
      expect(response.body.unidade).toBe('kg');
      expect(response.body.quantidadeEntrada).toBe(10);
      expect(response.body.quantidadeSaida).toBe(2);
      expect(response.body.totalEstoque).toBe(8);
      expect(response.body.limiteEstoque).toBe(5);
      expect(response.body.notificado).toBe(false);
    });

    it('should return 400 when nome is missing', async () => {
      const itemData = {
        unidade: 'kg',
        quantidadeEntrada: 10
      };

      const response = await request(app)
        .post('/api/items')
        .send(itemData)
        .expect(400);

      expect(response.body.message).toBe('Item é obrigatório');
    });

    it('should return 400 when unidade is missing', async () => {
      const itemData = {
        nome: 'Arroz',
        quantidadeEntrada: 10
      };

      const response = await request(app)
        .post('/api/items')
        .send(itemData)
        .expect(400);

      expect(response.body.message).toBe('Unidade é obrigatória');
    });

    it('should return 400 when item with same name already exists', async () => {
      await Item.create({
        nome: 'Arroz',
        unidade: 'kg'
      });

      const itemData = {
        nome: 'Arroz',
        unidade: 'kg'
      };

      const response = await request(app)
        .post('/api/items')
        .send(itemData)
        .expect(400);

      expect(response.body.message).toBe('Já existe um item com este nome');
    });

    it('should trim whitespace from nome and unidade', async () => {
      const itemData = {
        nome: '  Arroz Branco  ',
        unidade: '  kg  '
      };

      const response = await request(app)
        .post('/api/items')
        .send(itemData)
        .expect(201);

      expect(response.body.nome).toBe('Arroz Branco');
      expect(response.body.unidade).toBe('kg');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return item by id', async () => {
      const item = await Item.create({
        nome: 'Arroz',
        unidade: 'kg',
        quantidadeEntrada: 10,
        quantidadeSaida: 2,
        totalEstoque: 8
      });

      const response = await request(app)
        .get(`/api/items/${item._id}`)
        .expect(200);

      expect(response.body.nome).toBe('Arroz');
      expect(response.body.unidade).toBe('kg');
    });

    it('should return 404 when item not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/items/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Item não encontrado');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update item with valid data', async () => {
      const item = await Item.create({
        nome: 'Arroz',
        unidade: 'kg',
        quantidadeEntrada: 10,
        quantidadeSaida: 2,
        totalEstoque: 8
      });

      const updateData = {
        nome: 'Arroz Branco',
        quantidadeEntrada: 15,
        quantidadeSaida: 3
      };

      const response = await request(app)
        .put(`/api/items/${item._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nome).toBe('Arroz Branco');
      expect(response.body.quantidadeEntrada).toBe(15);
      expect(response.body.quantidadeSaida).toBe(3);
      expect(response.body.totalEstoque).toBe(12);
    });

    it('should return 404 when item not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/items/${fakeId}`)
        .send({ nome: 'Teste' })
        .expect(404);

      expect(response.body.message).toBe('Item não encontrado');
    });

    it('should reset notificadoEstoque when totalEstoque > limiteEstoque', async () => {
      const item = await Item.create({
        nome: 'Arroz',
        unidade: 'kg',
        quantidadeEntrada: 5,
        quantidadeSaida: 2,
        totalEstoque: 3,
        limiteEstoque: 5,
        notificadoEstoque: true
      });

      const updateData = {
        quantidadeEntrada: 10,
        quantidadeSaida: 2
      };

      const response = await request(app)
        .put(`/api/items/${item._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.totalEstoque).toBe(8);
      expect(response.body.notificadoEstoque).toBe(false);
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete item by id', async () => {
      const item = await Item.create({
        nome: 'Arroz',
        unidade: 'kg'
      });

      const response = await request(app)
        .delete(`/api/items/${item._id}`)
        .expect(200);

      expect(response.body.message).toBe('Item removido com sucesso');

      // Verify item was deleted
      const deletedItem = await Item.findById(item._id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 when item not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/items/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Item não encontrado');
    });
  });
}); 