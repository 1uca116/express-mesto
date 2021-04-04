const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards');


const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  req.user = {
    _id: '6068da265ed481541d93945a'
  };

  next();
});

app.use('/users', usersRouter )
app.use('/cards', cardsRouter)


app.listen(PORT, () => {

  console.log(`App listening on port ${PORT}`)
})