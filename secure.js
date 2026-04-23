const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

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

function searchProductSafe(name) {
  if (!validateName(name)) return [];
  const query = 'SELECT * FROM products WHERE name LIKE ?';
  const rows = db.prepare(query).all(`%${name}%`);
  return rows;
}

function loginSafe(username, password) {
  if (!validateUsername(username)) return undefined;
  if (!validatePassword(password)) return undefined;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const row = db.prepare(query).get(username, password);
  return row;
}

console.log('TASK 4 - Attack tests');

console.log('\nTest 1:', searchProductSafe("' OR 1=1--"));
console.log('Test 2:', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"));
console.log('Test 3:', loginSafe("admin'--", 'anything'));
console.log('Test 4:', loginSafe("' OR '1'='1", "' OR '1'='1"));

// TASK 5 


console.log('TASK 5 - Validation tests');

console.log('\nTest A: searchProductSafe("cement") -> should WORK');
console.log('Result:', searchProductSafe('cement'));

console.log('\nTest B: searchProductSafe("") -> should be REJECTED');
console.log('Result:', searchProductSafe(''));

console.log('\nTest C: searchProductSafe("<script>") -> should be REJECTED');
console.log('Result:', searchProductSafe('<script>'));

console.log('\nTest D: loginSafe("admin", "admin123") -> should WORK');
console.log('Result:', loginSafe('admin', 'admin123'));

console.log('\nTest E: loginSafe("admin", "ab") -> should be REJECTED');
console.log('Result:', loginSafe('admin', 'ab'));

console.log('\nTest F: loginSafe("ad min", "pass123") -> should be REJECTED');
console.log('Result:', loginSafe('ad min', 'pass123'));