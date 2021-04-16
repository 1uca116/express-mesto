const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalError = require('../errors/internal-error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError ('Такой карточки нет');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new InternalError('Произошла ошибка');
      }
    });
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner:req.user._id})
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new InternalError('Произошла ошибка');
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findById( req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(card => {
      if (card.owner.equals(req.user._id)) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(new Error('NotValidId'))
          .then(card => res.send({data: card}))
          .catch((err) => {
            if (err.message === 'NotValidId') {
              throw new NotFoundError ('Такой карточки нет');
            } else if (err.name === 'CastError') {
              throw new BadRequestError('Переданы некорректные данные');
            } else {
              throw new InternalError('Произошла ошибка');
            }
          });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    }).catch((err) => {
        if (err.message === 'NotValidId') {
          throw new NotFoundError ('Такой карточки нет');
        } else if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные');
        } else {
          throw new InternalError('Произошла ошибка');
        }
    })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotValidId'))
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError ('Такой карточки нет');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new InternalError('Произошла ошибка');
      }
    });
}

module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .orFail(new Error('NotValidId'))
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFoundError ('Такой карточки нет');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new InternalError('Произошла ошибка');
      }
    });
}
