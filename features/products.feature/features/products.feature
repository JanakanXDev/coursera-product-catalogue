Feature: Product Catalogue API
  As a developer, I want to manage products through a REST API
  So that I can perform CRUD operations and search

  Scenario: Read a product by ID
    Given there is a product named "Laptop" in the "Electronics" category
    When I request the product by its ID
    Then the response contains the product name "Laptop"
    And the response status code is 200

  Scenario: Update a product
    Given there is a product named "Laptop" in the "Electronics" category
    When I update the product name to "Gaming Laptop"
    Then the response contains the product name "Gaming Laptop"
    And the response status code is 200

  Scenario: Delete a product
    Given there is a product named "Laptop" in the "Electronics" category
    When I delete the product
    Then the response status code is 204

  Scenario: List all products
    Given there is a product named "Laptop" in the "Electronics" category
    And there is a product named "Shirt" in the "Clothing" category
    When I request all products
    Then the response contains a list of all products

  Scenario: Search by category
    Given there is a product named "Laptop" in the "Electronics" category
    And there is a product named "Shirt" in the "Clothing" category
    When I search for products in category "Electronics"
    Then the response contains only products in the "Electronics" category
    And the response status code is 200

  Scenario: Search by availability
    Given there is a product named "Laptop" with availability true
    And there is a product named "Outdated Item" with availability false
    When I search for available products
    Then the response contains only products with availability true
    And the response status code is 200

  Scenario: Search by name
    Given there is a product named "Laptop" in the "Electronics" category
    And there is a product named "Mouse" in the "Electronics" category
    When I search for products by name "Laptop"
    Then the response contains only the product with name "Laptop"
    And the response status code is 200
