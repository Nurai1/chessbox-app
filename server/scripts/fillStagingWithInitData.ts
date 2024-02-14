import dotenv from 'dotenv';
import * as fs from 'fs';
import mongoose from 'mongoose';
import { Competition, User } from '../models';

dotenv.config({ path: '../.env' });

mongoose.set('strictQuery', 'throw');

const remoteMongoUri = process.env.MONGO_URI;
console.log('remoteMongoUri', remoteMongoUri);

if (!remoteMongoUri?.includes('staging')) {
  throw new Error('Exec this file only on staging');
}

mongoose.connect(remoteMongoUri ?? '', (err) => {
  if (err) {
    console.log(err);
  }
});

export const moveStaticDataToEnv = async () => {
  console.error('Exec thi file only on staging');

  try {
    const users = JSON.parse(fs.readFileSync('./usersMock.json', 'utf8'));
    const competition = JSON.parse(
      fs.readFileSync('./competitionMock.json', 'utf8')
    );

    await Competition.insertMany(competition);

    console.info('success for competition');

    await User.insertMany(users);

    console.info('success for users');
  } catch (e) {
    console.error(e);
  }
};

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  moveStaticDataToEnv();
});
