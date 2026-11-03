const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../src/app');
const { products, create, remove, getById } = require('../../src/models/product');

let productId = null;
let lastResponse = null;

Given(/^there is a product named "(.*?)" in the "(.*?)" category$/, function (name, category) {
  const product = {
    id: Date.now(),
    name: name,
    category: category,
    price: 100,
    availability: true,
  };
  create(product);
  productId = product.id;
});

Given(/^there is a product named "(.*?)" with availability (true|false)$/, function (name, availability) {
  const product = {
    id: Date.now(),
    name: name,
    category: 'General',
    price: 50,
    availability: availability === 'true',
  };
  create(product);
  productId = product.id;
});

Given(/^there is a product named "(.*?)" in the "(.*?)" category and there is a product named "(.*?)" in the "(.*?)" category$/, function (name1, cat1, name2, cat2) {
  const product1 = {
    id: Date.now(),
    name: name1,
    category: cat1,
    price: 100,
    availability: true,
  };
  const product2 = {
    id: Date.now() + 1,
    name: name2,
    category: cat2,
    price: 50,
    availability: true,
  };
  create(product1);
  create(product2);
  productId = product1.id;
});

When(/^I request the product by its ID$/, function (callback) {
  request(app)
    .get(`/api/products/${productId}`)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I update the product name to "(.*?)"$/, function (name, callback) {
  request(app)
    .put(`/api/products/${productId}`)
    .send({ name: name })
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I delete the product$/, function (callback) {
  request(app)
    .delete(`/api/products/${productId}`)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I request all products$/, function (callback) {
  request(app)
    .get('/api/products')
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I search for products in category "(.*?)"$/, function (category, callback) {
  request(app)
    .get(`/api/products?category=${category}`)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I search for available products$/, function (callback) {
  request(app)
    .get('/api/products?availability=true')
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I search for products by name "(.*?)"$/, function (name, callback) {
  request(app)
    .get(`/api/products?name=${name}`)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

Then(/^the response contains the product name "(.*?)"$/, function (name) {
  expect(lastResponse.body.name).toBe(name);
});

Then(/^the response status code is (.*?)$/, function (statusCode) {
  expect(lastResponse.status).toBe(parseInt(statusCode));
});

Then(/^the response contains a list of all products$/, function () {
  expect(Array.isArray(lastResponse.body)).toBe(true);
  expect(lastResponse.body.length).toBeGreaterThanOrEqual(2);
});

Then(/^the response contains only products in the "(.*?)" category$/, function (category) {
  lastResponse.body.forEach((product) => {
    expect(product.category).toBe(category);
  });
});

Then(/^the response contains only products with availability (true|false)$/, function (availability) {
  const boolValue = availability === 'true';
  lastResponse.body.forEach((product) => {
    expect(product.availability).toBe(boolValue);
  });
});

Then(/^the response contains only the product with name "(.*?)"$/, function (name) {
  expect(lastResponse.body.length).toBe(1);
  expect(lastResponse.body[0].name).toBe(name);
});

Then(/^the response does not contain "(.*?)"$/, function (text) {
  const bodyStr = JSON.stringify(lastResponse.body);
  expect(bodyStr).not.toContain(text);
});

Then(/^the response contains "(.*?)"$/, function (text) {
  const bodyStr = JSON.stringify(lastResponse.body);
  expect(bodyStr).toContain(text);
});

Then(/^an assertion for the message "(.*?)" passes$/, function (message) {
  const bodyStr = JSON.stringify(lastResponse.body);
  expect(bodyStr).toContain(message);
});
