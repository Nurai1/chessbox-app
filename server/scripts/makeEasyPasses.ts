import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models';

dotenv.config({ path: '../.env' });

mongoose.set('strictQuery', 'throw');

const remoteMongoUri = process.env.MONGO_URI;
console.log(remoteMongoUri);

mongoose.connect(remoteMongoUri ?? '', (err) => {
  if (err) {
    console.log(err);
  }
});

export const makeEasyPasses = async () => {
  try {
    const res = await User.updateMany(
      {},
      {
        hashedPassword:
          '$2a$10$PsotBciquCScd1twoXRfZ.XSoDf5aZUaUiiber1VpuCUEHAeD3.hq',
      }
    );

    console.info('success', res);
  } catch (e) {
    console.error(e);
  }
};

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  makeEasyPasses();
});
