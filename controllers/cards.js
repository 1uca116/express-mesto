const Card = require('../models/card');
const mongoose = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCard = (req, res) => {
  const id = req.params.cardId;
  console.log(req.params)
  Card.find({_id: id})
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner:req.body.user._id})
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ) .then(card => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}