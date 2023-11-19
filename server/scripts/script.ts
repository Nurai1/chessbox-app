import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as fs from 'fs';
import { Competition, User } from '../models';

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
    const users = await User.find({ role: 'participant' });
    const competition = await Competition.findOneAndUpdate(
      { _id: '65583064e8c479708981b946' },
      { participants: users.map((user) => user._id) }
    );
    console.log(competition);
    console.log('done');
  } catch (e) {
    console.error(e);
  }
};

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  moveStaticDataToEnv();
});
