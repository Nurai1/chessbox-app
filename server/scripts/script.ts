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
    const comp = await Competition.findById('6554487f16a0f2ba0a83a9e1');
    comp?.groups.forEach(async (group) => {
      await User.updateMany(
        { _id: { $in: group.allParticipants } },
        { currentGroupId: group._id?.toString() }
      );
      console.log('done');
    });
  } catch (e) {
    console.error(e);
  }
};

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
  moveStaticDataToEnv();
});
