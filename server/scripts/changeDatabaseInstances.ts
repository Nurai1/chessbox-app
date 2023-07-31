import fetch from 'node-fetch';
import { IUser } from 'types';

const ENDPOINT_PATH = '/user';

const updateInstance = async (user: IUser) => {
  // @ts-ignore
  const { birthDate } = user;
  const res = await fetch(`http://localhost:3001/api${ENDPOINT_PATH}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: user._id,
      birthDate: new Date(birthDate),
    }),
  });
  const updated = await res.json();

  console.log('res: ', updated);
};

export const changeDatabaseInstances = async () => {
  const res = await fetch(`http://localhost:3001/api${ENDPOINT_PATH}s`);
  const instances = await res.json();

  console.log('instances: ', instances);

  try {
    const promises = instances.items.map((instance: IUser) =>
      updateInstance(instance)
    );

    await Promise.all(promises);

    console.info('Update Successful');
  } catch (err) {
    console.error('Error due to update: ', err);
  }
};

changeDatabaseInstances();
