// setup.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// PRODUCTS TABLE
db.exec(`DROP TABLE IF EXISTS products`);
db.exec(`
  CREATE TABLE products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT,
    price       REAL    NOT NULL
  )
`);

//users table 
db.exec(`DROP TABLE IF EXISTS users`);
db.exec(`
  CREATE TABLE users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role     TEXT DEFAULT 'attendant'
  )
`);

//Inserting products
const insertProduct = db.prepare(
  'INSERT OR IGNORE INTO products (name, description, price) VALUES (?, ?, ?)'
);

const insertAllProducts = db.transaction((rows) => {
  for (const r of rows) insertProduct.run(...r);
});

insertAllProducts([
  ['Cement (bag)', 'Portland cement 50kg bag',        35000],
  ['Iron Sheet 3m', 'Gauge 30 roofing sheet 3m long', 110000],
  ['Paint 5L',      'Exterior wall paint white 5L',   60000],
  ['Nails 1kg',     'Common wire nails 1kg pack',     12000],
  ['Timber 2x4',    'Pine timber plank 2x4 per metre',25000],
]);

//Inserting users
db.exec(`
  INSERT OR IGNORE INTO users (username, password, role) VALUES
    ('admin',  'admin123', 'admin'),
    ('fatuma', 'pass456',  'attendant'),
    ('wasswa', 'pass789',  'manager')
`);

// Display inserted data
console.log('=== Products in database ===');
const products = db.prepare('SELECT * FROM products').all();
console.log(products);

console.log('\n=== Users in database ===');
const users = db.prepare('SELECT * FROM users').all();
console.log(users);
