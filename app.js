const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
//
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6068da265ed481541d93945a'
//   };
//
//   next();
// });

app.use('/users', usersRouter )
app.use('/cards', cardsRouter)


app.listen(PORT, () => {

  console.log(`App listening on port ${PORT}`)
})