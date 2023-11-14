import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Competition, User } from '../models';

dotenv.config({ path: '../.env' });

mongoose.set('strictQuery', 'throw');

const remoteMongoUri = process.env.MONGO_URI;
console.log(remoteMongoUri);

mongoose.connect(remoteMongoUri ?? '', (err) => {
  if (err) {
    console.log(err);
  }
});

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  migrateCompetitionRequirements();
});

export const migrateCompetitionRequirements = async () => {
  try {
    const res = await Competition.updateMany(
      {},
      { $unset: { requirements: '' } }
    );

    console.info('success', res);
  } catch (e) {
    console.error(e);
  }
};
