const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.getUsers = (req, res) => {

  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const id = req.params.userId;
  User.findOne({_id: id})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такого пользователя нет' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.createUser = (req, res) => {
  console.log(req)
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.status(200).send(user))
    .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const _id = req.user._id;
  console.log(_id);
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такого пользователя нет' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}


module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const _id = req.user._id
  User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};