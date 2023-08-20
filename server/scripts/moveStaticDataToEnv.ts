import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { User } from '../models';

dotenv.config({ path: '../.env' });

mongoose.set('strictQuery', 'throw');

const remoteMongoUri = process.env.MONGO_URI;
console.log('remoteMongoUri', remoteMongoUri);

mongoose.connect(remoteMongoUri ?? '', (err) => {
  if (err) {
    console.log(err);
  }
});

export const moveStaticDataToEnv = async () => {
  try {
    const users = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

    const res = await User.insertMany(users);

    console.info('success', res);
  } catch (e) {
    console.error(e);
  }
};

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  moveStaticDataToEnv();
});
