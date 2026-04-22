// queries.js
// Run: node queries.js

const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// ── Query A: Every column of every product ─────────────────────────────────
console.log('=== Query A: All products, all columns ===');
const queryA = 'SELECT * FROM products';
console.log('SQL:', queryA);
console.log(db.prepare(queryA).all());

// ── Query B: Only name and price ───────────────────────────────────────────
console.log('\n=== Query B: Name and price only ===');
const queryB = 'SELECT name, price FROM products';
console.log('SQL:', queryB);
console.log(db.prepare(queryB).all());

// ── Query C: Full details of product with id = 3 ───────────────────────────
console.log('\n=== Query C: Product where id = 3 ===');
const queryC = 'SELECT * FROM products WHERE id = 3';
console.log('SQL:', queryC);
console.log(db.prepare(queryC).get());

// ── Query D: Products whose name contains 'sheet' (partial match) ──────────
console.log('\n=== Query D: Products with "sheet" in the name ===');
const queryD = "SELECT * FROM products WHERE name LIKE '%sheet%'";
console.log('SQL:', queryD);
console.log(db.prepare(queryD).all());

// ── Query E: All products sorted by price, highest first ───────────────────
console.log('\n=== Query E: All products sorted by price DESC ===');
const queryE = 'SELECT * FROM products ORDER BY price DESC';
console.log('SQL:', queryE);
console.log(db.prepare(queryE).all());

// ── Query F: Only the 2 most expensive products ────────────────────────────
console.log('\n=== Query F: Top 2 most expensive products ===');
const queryF = 'SELECT * FROM products ORDER BY price DESC LIMIT 2';
console.log('SQL:', queryF);
console.log(db.prepare(queryF).all());

// ── Query G: Update Cement price to 38,000 then confirm ───────────────────
console.log('\n=== Query G: Update Cement (id=1) price to 38000 ===');
const queryG_update = 'UPDATE products SET price = 38000 WHERE id = 1';
console.log('SQL:', queryG_update);
db.prepare(queryG_update).run();

const queryG_confirm = 'SELECT * FROM products';
console.log('Confirm with SELECT *:');
console.log(db.prepare(queryG_confirm).all());
