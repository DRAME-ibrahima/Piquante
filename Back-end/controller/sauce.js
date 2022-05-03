const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);// on parse les données envoyés pr pouvoir les utiliser
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on resout chaque segment de l'url
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce crée!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body };
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
          .catch(error => res.status(400).json({ error }));
      });
      if (sauce.userId !== req.auth.userId) {
        return response.status(403).json({
          error: new Error("Requête non autorisée !"),
        });
      }
    })

};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id
  })
    .then(sauce => {
      if (req.body.like == -1) {
        sauce.dislikes++; // 
        sauce.usersDisliked.push(req.body.userId);
        sauce.save();
      }
      if (req.body.like == 1) {
        sauce.likes++;
        sauce.usersLiked.push(req.body.userId)
        sauce.save();
      }

      if (req.body.like == 0) {
        if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
          sauce.likes--;
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
        } else {
          sauce.dislikes--;
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
        }
        sauce.save();

      }

      res.status(200).json({ message: 'like pris en compte' })
    })
    .catch(error => {
      res.status(500).json({ error })
    });

};
