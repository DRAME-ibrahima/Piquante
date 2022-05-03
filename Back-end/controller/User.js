const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/User') 

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) 
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur creé' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) 
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(   
              { userId: user._id },
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjYwMGI4MTI4YzY1OWQ0YmZiNGE1MzEiLCJpYXQiOjE2NTE1MDg4NDksImV4cCI6MTY1MTU5NTI0OX0.6R04l6uzY8I9p2y56-Mrm9Wrr4yKTt1b44grWmZ4bRQ',  
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
