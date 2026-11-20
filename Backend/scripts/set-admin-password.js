require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/db.postgres');
const User = require('../src/models/postgres/user.model');
const { passwordProblem } = require('../src/validators/auth.validator');
const ask = (q, hidden = false) => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(s); };
  rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
});
(async () => {
  try {
    await sequelize.authenticate();
    const email = (await ask('Admin email (Enter = admin@minaysh.pk): ')) || 'admin@minaysh.pk';
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || user.role !== 'admin') { console.log('Admin account nahi mila.'); process.exit(1); }
    const pw = await ask('Naya password: ', true);
    const problem = passwordProblem(pw);
    if (problem) { console.log(problem); process.exit(1); }
    if (pw !== await ask('Dobara likhein: ', true)) { console.log('Match nahi hua. Dobara chalayein.'); process.exit(1); }
    user.password = await bcrypt.hash(pw, 10);
    user.resetTokenHash = null; user.resetTokenExpires = null;
    await user.save();
    console.log('Password badal gaya: ' + user.email);
    process.exit(0);
  } catch (e) { console.error('Password nahi badla:', e.message); process.exit(1); }
})();
