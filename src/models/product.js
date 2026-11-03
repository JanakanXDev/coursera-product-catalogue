class Product {
  constructor(id, name, category, price, availability) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.availability = availability;
  }
}

const products = [];

function getAll() {
  return products;
}

function getById(id) {
  return products.find((p) => p.id === id);
}

function create(product) {
  products.push(product);
  return product;
}

function update(id, updatedProduct) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updatedProduct };
  return products[index];
}

function remove(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = { Product, products, getAll, getById, create, update, remove };
