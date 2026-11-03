const request = require('supertest');
const app = require('../../src/app');
const { products, remove } = require('../../src/models/product');

beforeEach(() => {
  products.length = 0;
});

describe('POST /api/products', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop', category: 'Electronics', price: 999, availability: true });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Laptop');
    expect(res.body.category).toBe('Electronics');
    expect(res.body.price).toBe(999);
    expect(res.body.availability).toBe(true);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop' });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/products', () => {
  it('should list all products', async () => {
    await request(app).post('/api/products').send({
      name: 'Laptop',
      category: 'Electronics',
      price: 999,
      availability: true,
    });
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter by name', async () => {
    await request(app).post('/api/products').send({
      name: 'Laptop',
      category: 'Electronics',
      price: 999,
      availability: true,
    });
    const res = await request(app).get('/api/products?name=laptop');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter by category', async () => {
    await request(app).post('/api/products').send({
      name: 'Laptop',
      category: 'Electronics',
      price: 999,
      availability: true,
    });
    const res = await request(app).get('/api/products?category=electronics');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should filter by availability', async () => {
    await request(app).post('/api/products').send({
      name: 'Laptop',
      category: 'Electronics',
      price: 999,
      availability: true,
    });
    const res = await request(app).get('/api/products?availability=true');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe('GET /api/products/:id', () => {
  it('should get a product by id', async () => {
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop', category: 'Electronics', price: 999, availability: true });
    const id = created.body.id;
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Laptop');
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/products/:id', () => {
  it('should update a product', async () => {
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop', category: 'Electronics', price: 999, availability: true });
    const id = created.body.id;
    const res = await request(app)
      .put(`/api/products/${id}`)
      .send({ name: 'Updated Laptop' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Laptop');
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).put('/api/products/999999').send({ name: 'Nope' });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  it('should delete a product', async () => {
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop', category: 'Electronics', price: 999, availability: true });
    const id = created.body.id;
    const res = await request(app).delete(`/api/products/${id}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).delete('/api/products/999999');
    expect(res.statusCode).toBe(404);
  });
});
