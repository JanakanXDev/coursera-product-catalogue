const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../src/app');
const { products, create, remove, getAll } = require('../../src/models/product');

let lastResponse = null;

Given(/^a product exists with name "(.*?)"$/, function (name) {
  const product = {
    id: Date.now(),
    name: name,
    category: 'General',
    price: 25,
    availability: true,
  };
  create(product);
});

When(/^I send a GET request to "(.*?)"$/, function (url, callback) {
  request(app)
    .get(url)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I send a POST request to "(.*?)" with body/, function (url, body, callback) {
  const parsedBody = JSON.parse(body);
  request(app)
    .post(url)
    .send(parsedBody)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I send a PUT request to "(.*?)" with body/, function (url, body, callback) {
  const parsedBody = JSON.parse(body);
  request(app)
    .put(url)
    .send(parsedBody)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

When(/^I send a DELETE request to "(.*?)"$/, function (url, callback) {
  request(app)
    .delete(url)
    .end(function (err, res) {
      lastResponse = res;
      callback(err);
    });
});

Then(/^the response contains "(.*?)"$/, function (text) {
  const bodyStr = JSON.stringify(lastResponse.body);
  expect(bodyStr).toContain(text);
});

Then(/^the response does not contain "(.*?)"$/, function (text) {
  const bodyStr = JSON.stringify(lastResponse.body);
  expect(bodyStr).not.toContain(text);
});

Then(/^the response status code is (.*?)$/, function (code) {
  expect(lastResponse.status).toBe(parseInt(code));
});

Then(/^an assertion for the message "(.*?)" passes$/, function (message) {
  const bodyStr = JSON.stringify(lastResponse.body);
  expect(bodyStr).toContain(message);
});
