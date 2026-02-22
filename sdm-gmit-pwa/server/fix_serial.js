const fs = require('fs');
let code = fs.readFileSync('schema.ts', 'utf8');

code = code.replace(/import \{ (.*)serial(.*) \}/, "import { $1serial, bigint$2 }");
code = code.replace(/serial\("id"\)\.primaryKey\(\)/g, "bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey()");

fs.writeFileSync('schema.ts', code);
console.log('fixed serial issue');
