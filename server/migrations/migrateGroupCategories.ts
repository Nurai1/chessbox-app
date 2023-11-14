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
  migrateGroupCategories();
});

export const migrateGroupCategories = async () => {
  try {
    const promises: any[] = [];
    const competitions = await Competition.find({});

    competitions.forEach((competition) => {
      const groups = competition.groups.map((group, idx) => {
        const ageCat = group.ageCategory;

        // @ts-ignore
        group.ageCategory = ageCat
          ? {
              from: Number(ageCat.toString().split('-')[0]),
              to: Number(ageCat.toString().split('-')[1]),
            }
          : { from: 0, to: 0 };
        // @ts-ignore
        group.weightCategory = {
          from: 0,
          to: isNaN(parseInt(group.weightCategory))
            ? 0
            : parseInt(group.weightCategory),
        };

        return group;
      });

      promises.push(
        Competition.findOneAndUpdate(
          { _id: competition._id },
          {
            groups,
          }
        )
      );
    });

    const res = await Promise.allSettled(promises);

    console.info('success', res);
  } catch (e) {
    console.error(e);
  }
};
