import express from 'express';
import { fileURLToPath } from 'url';
import mongoose, { Schema } from 'mongoose';

const currentPath = fileURLToPath(import.meta.url);
const dirname = currentPath.slice(0, currentPath.lastIndexOf('/'));

const app = express();
const jsonParser = express.json();
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

interface IUser {
  name: string;
  age?: number;
}

const userScheme = new Schema<IUser>(
  { name: { type: String, required: true }, age: Number },
  { versionKey: false }
);
const User = mongoose.model('User', userScheme);

app.use(express.static(`${dirname}/public`));

mongoose.connect('mongodb://localhost:27017/test', (err) => {
  if (err) {
    console.log(err);
    return;
  }

  app.listen(3001, () => {
    console.log('Server is started.');
  });
});

app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) return console.log(err);
    res.send(users);
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.findOne({ _id: id }, (err: any, user: IUser | null) => {
    if (err) return console.log(err);
    res.send(user);
  });
});

app.post('/api/users', jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const userName = req.body.name;
  const userAge = req.body.age;
  const user = new User({ name: userName, age: userAge });

  user.save((err: any) => {
    if (err) return console.log(err);
    res.send(user);
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id, (err: any, user: IUser | null) => {
    if (err) return console.log(err);
    res.send(user);
  });
});

app.put('/api/users', jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  const userName = req.body.name;
  const userAge = req.body.age;
  const newUser = { age: userAge, name: userName };

  User.findOneAndUpdate({ _id: id }, newUser, { new: true }, (err, user) => {
    if (err) return console.log(err);
    res.send(user);
  });
});
