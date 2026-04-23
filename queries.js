const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

//Query A: Every column of every product 
console.log('Query A - Every column of every product');
const queryA = 'SELECT * FROM products';
console.log(db.prepare(queryA).all());

//Query B: Only name and price of every product
console.log('\n Query B: Name and price of every product');
const queryB = 'SELECT name, price FROM products';
console.log(db.prepare(queryB).all());

//Query C: Full details of product with id = 3 
console.log('\n Query C - Full details of product with id = 3');
const queryC = 'SELECT * FROM products WHERE id = 3';
console.log(db.prepare(queryC).get());

// Query D: Products whose name contains 'sheet' (partial match) 
console.log('\nQuery D: Products with name containing "sheet"');
const queryD = "SELECT * FROM products WHERE name LIKE '%sheet%'";
console.log(db.prepare(queryD).all());

//Query E: All products sorted by price, highest first
console.log('\nQuery E: All products sorted by price, highest first');
const queryE = 'SELECT * FROM products ORDER BY price DESC';
console.log(db.prepare(queryE).all());

//Query F: Only the 2 most expensive products 
console.log('\n Query F: Top 2 most expensive products');
const queryF = 'SELECT * FROM products ORDER BY price DESC LIMIT 2';
console.log(db.prepare(queryF).all());

//Query G: Update Cement price to 38,000 then confirm 
console.log('\n Query G: Update Cement (id=1) price to 38000');
const queryG_update = 'UPDATE products SET price = 38000 WHERE id = 1';
db.prepare(queryG_update).run();

const queryG_confirm = 'SELECT * FROM products';
console.log('Confirm with SELECT *:');
console.log(db.prepare(queryG_confirm).all());