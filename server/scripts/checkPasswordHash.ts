/* eslint-disable no-console */
import bcrypt from 'bcryptjs';

const Readline = require('node:readline');

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function checkHashFunc() {
  const password: string = await new Promise((resolve) => {
    readline.question(`What's the password?\n`, resolve);
  });
  const hash: string = await new Promise((resolve) => {
    readline.question(`What's the password hash?\n`, resolve);
  });

  const isEqual = await bcrypt.compare(password, hash);

  console.log(`Password hash checked: ${isEqual}`);
}

checkHashFunc();
