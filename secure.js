// secure.js
// Run: node secure.js
// All 4 attack payloads must return undefined or []

const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// ══════════════════════════════════════════════════════════════════════════
// TASK 4 + TASK 5 COMBINED
// Parameterised queries  +  Input validation
// ══════════════════════════════════════════════════════════════════════════

// ── Input validation helpers ───────────────────────────────────────────────

function validateName(name) {
  if (typeof name !== 'string') {
    console.log('  [REJECTED] name must be a string');
    return false;
  }
  if (name.trim().length < 2) {
    console.log('  [REJECTED] name must be at least 2 characters');
    return false;
  }
  if (/[<>;]/.test(name)) {
    console.log('  [REJECTED] name contains forbidden characters (< > ;)');
    return false;
  }
  return true;
}

function validateUsername(username) {
  if (typeof username !== 'string') {
    console.log('  [REJECTED] username must be a string');
    return false;
  }
  if (username.trim().length === 0) {
    console.log('  [REJECTED] username cannot be empty');
    return false;
  }
  if (/\s/.test(username)) {
    console.log('  [REJECTED] username cannot contain spaces');
    return false;
  }
  return true;
}

function validatePassword(password) {
  if (typeof password !== 'string') {
    console.log('  [REJECTED] password must be a string');
    return false;
  }
  if (password.length < 6) {
    console.log('  [REJECTED] password must be at least 6 characters');
    return false;
  }
  return true;
}

// ── SECURE search function (parameterised query + validation) ──────────────
function searchProductSafe(name) {
  console.log(`  Input: "${name}"`);

  // Validate first - if bad input, stop here, never touch the database
  if (!validateName(name)) {
    return [];
  }

  // Safe: user input goes into ? placeholder, never into the query string
  const query = 'SELECT * FROM products WHERE name LIKE ?';
  const rows = db.prepare(query).all(`%${name}%`);
  console.log('  Result:', rows);
  return rows;
}

// ── SECURE login function (parameterised query + validation) ───────────────
function loginSafe(username, password) {
  console.log(`  Input: username="${username}"  password="${password}"`);

  // Validate both fields before touching the database
  if (!validateUsername(username)) return undefined;
  if (!validatePassword(password)) return undefined;

  // Safe: both values go into ? placeholders
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const row = db.prepare(query).get(username, password);
  console.log('  Result:', row);
  return row;
}

// ══════════════════════════════════════════════════════════════════════════
// TASK 4 TESTS - all 4 attack payloads must return [] or undefined
// ══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('TASK 4 - Attack payloads against SECURE functions');
console.log('='.repeat(60));

console.log('\nTest 1: searchProductSafe("OR 1=1--")');
console.log('Test 1:', searchProductSafe("' OR 1=1--"));

console.log('\nTest 2: UNION attack via search');
console.log('Test 2:', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"));

console.log('\nTest 3: Login bypass');
console.log('Test 3:', loginSafe("admin'--", 'anything'));

console.log('\nTest 4: Always-true login');
console.log('Test 4:', loginSafe("' OR '1'='1", "' OR '1'='1"));

// ══════════════════════════════════════════════════════════════════════════
// TASK 5 TESTS - valid and invalid inputs
// ══════════════════════════════════════════════════════════════════════════

console.log('\n' + '='.repeat(60));
console.log('TASK 5 - Input validation test cases');
console.log('='.repeat(60));

console.log('\nTest A: searchProductSafe("cement")  -> should WORK');
searchProductSafe('cement');

console.log('\nTest B: searchProductSafe("")  -> should be REJECTED (too short)');
searchProductSafe('');

console.log('\nTest C: searchProductSafe("<script>")  -> should be REJECTED (bad chars)');
searchProductSafe('<script>');

console.log('\nTest D: loginSafe("admin", "admin123")  -> should WORK');
loginSafe('admin', 'admin123');

console.log('\nTest E: loginSafe("admin", "ab")  -> should be REJECTED (password too short)');
loginSafe('admin', 'ab');

console.log('\nTest F: loginSafe("ad min", "pass123")  -> should be REJECTED (space in username)');
loginSafe('ad min', 'pass123');
