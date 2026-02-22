const fs = require('fs');
let code = fs.readFileSync('schema.ts', 'utf8');

// replace timestamp with timestamp in better-auth tables by just giving them explicit defaults, 
// actually betterauth requires those to be set by the app.
// If I just change it to text("createdAt")? No, better use datetime.
code = code.replace(/createdAt: timestamp\("createdAt"\)\.notNull\(\)/g, "createdAt: timestamp('createdAt').defaultNow().notNull()");
code = code.replace(/updatedAt: timestamp\("updatedAt"\)\.notNull\(\)/g, "updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull()");
code = code.replace(/expiresAt: timestamp\("expiresAt"\)\.notNull\(\)/g, "expiresAt: timestamp('expiresAt').defaultNow().notNull()");
code = code.replace(/createdAt: timestamp\("createdAt"\),/g, "createdAt: timestamp('createdAt').defaultNow(),");
code = code.replace(/updatedAt: timestamp\("updatedAt"\)\n/g, "updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow()\n");

fs.writeFileSync('schema.ts', code);
console.log('schema updated');
