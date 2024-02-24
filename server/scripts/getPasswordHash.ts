/* eslint-disable no-console */
import bcrypt from 'bcryptjs';

const Readline = require('node:readline');

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getPasswordHash(password: string) {
  return bcrypt.hash(password, 10);
}

readline.question(`What's the password?\n`, (password: string) => {
  console.log(`Password: ${password}`);
  readline.close();

  getPasswordHash(password).then((hash) => {
    console.log(`Password hash: ${hash}`);
  });
});
