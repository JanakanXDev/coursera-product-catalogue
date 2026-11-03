const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../models/product');

// POST /api/products - Create a new product
router.post('/', (req, res) => {
  const { name, category, price, availability } = req.body;
  if (!name || !category || price === undefined || availability === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newProduct = {
    id: Date.now(),
    name,
    category,
    price: parseFloat(price),
    availability: availability === true || availability === 'true' ? true : false,
  };
  create(newProduct);
  res.status(201).json(newProduct);
});

// GET /api/products - Get all products
router.get('/', (req, res) => {
  const { name, category, availability } = req.query;
  let result = getAll();

  if (name) {
    result = result.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (category) {
    result = result.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (availability !== undefined && availability !== '') {
    const isAvailable = availability === 'true';
    result = result.filter((p) => p.availability === isAvailable);
  }

  res.json(result);
});

// GET /api/products/:id - Get a product by ID
router.get('/:id', (req, res) => {
  const product = getById(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// PUT /api/products/:id - Update a product
router.put('/:id', (req, res) => {
  const product = update(Number(req.params.id), req.body);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', (req, res) => {
  const deleted = remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(204).send();
});

module.exports = router;
