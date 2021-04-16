const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, likeCard, unlikeCard } = require('../controllers/cards');

router.get('/', getCards)

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w\W.-]*)#?$/),
  }),
}) , createCard)

router.delete('/:cardId', celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().length(24).hex(),
      })
      .unknown(true),
  }), deleteCard)

router.put('/:cardId/likes', celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().length(24).hex(),
      })
      .unknown(true),
  }), likeCard)

router.delete('/:cardId/likes', celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().length(24).hex(),
      })
      .unknown(true),
  }), unlikeCard)


module.exports = router;
