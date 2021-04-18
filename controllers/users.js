const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const JWT_SECRET = 'qwerty1234';

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Такого пользователя нет');
      }
      res.send({data: user});
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'))
      } else {
        next(err);
      }
    });
}

module.exports.createUser = (req, res, next) => {
  console.log(req)
  const {name, about, avatar, email, password} = req.body;
  User.findOne({email})
    .then(user => {
      if (user) {
        throw new ConflictError('Эти данные уже используются. Введите другой email');
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({name, about, avatar, email, password: hash})
            .then(user => {
              if (!user) {
                throw new BadRequestError('Переданы некорректные данные');
              }
              res.send({data: {
                  _id: user._id,
                  name: user.name,
                  about: user.about,
                  avatar: user.avatar,
                  email: user.email,
                }});
            })
            .catch(err => {
              if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные'));
              } else {
                next(err);
              }
            });
        })
        .catch(next);
    })
    .catch(next);
}

module.exports.updateUser = (req, res, next) => {
  const {name, about} = req.body;
  const _id = req.user._id;
  console.log(_id);
  User.findByIdAndUpdate(
    _id,
    {name, about},
    {new: true, runValidators: true}
  )
    .then(user => {
      if (!user) {
        throw new NotFoundError('Такого пользователя нет');
      }
      res.send({data: user});
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'))
      } else {
        next(err);
      }
    });
}


module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  const _id = req.user._id
  User.findByIdAndUpdate(
    _id,
    {avatar},
    {new: true, runValidators: true},
  )
    .then(user => {
      if (!user) {
        throw new NotFoundError('Такого пользователя нет');
      }
      res.send({data: user});
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'))
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res) => {
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((matched) => {
      const token = jwt.sign({_id: matched._id}, JWT_SECRET, {expiresIn: '7d'});
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true
      })
        .status(200).send({token})
    })
    .catch((err) => {
      console.log(err)
      res
        .status(401)
        .send({message: err.message});
    });
};
