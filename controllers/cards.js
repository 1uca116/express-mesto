const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      res.send({data: card});
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next (new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

module.exports.createCard = (req, res, next) => {
  const {name, link} = req.body;
  Card.create({name, link, owner:req.user._id})
    .then(card => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      res.send({data: card});

    }).catch(next);
}

module.exports.deleteCard = (req, res, next) => {
  Card.findById( req.params.cardId)
    .then(card => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      if (card.owner.equals(req.user._id)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(card => {
            if (!card) {
              throw new NotFoundError ('Такой карточки нет');
            }
            res.send({data: card})
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError('Переданы некорректные данные'));
            } else {
              next(err);
            }
          });
      } else {
        throw new BadRequestError('Переданы некорректные данные');
      }
    }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  })
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then(card => {
      if (!card) {
        throw new NotFoundError ('Такой карточки нет');
      }
      res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

module.exports.unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then(card => {
      if (!card) {
        throw new NotFoundError ('Такой карточки нет');
      }
      res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}
