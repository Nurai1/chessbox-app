import mongoose from 'mongoose';
import { User } from '../models';
import dotenv from 'dotenv';

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
  deleteSchemaOldProps();
});

export const deleteSchemaOldProps = async () => {
  try {
    const res = await User.updateMany(
      {},
      {
        $unset: { property1: '' },
      }
    );

    console.info('success', res);
  } catch (e) {
    console.error(e);
  }
};
