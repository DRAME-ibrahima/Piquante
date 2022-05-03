const express = require('express')
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/User');
const app = express()
const path = require('path');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://ibou98:7tyvpJj7Ln69ryLn@cluster0.osf58.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//Insertion CORS
app.use((req, res, next) => {
  //qui peut accéder à l'API
  res.setHeader('Access-Control-Allow-Origin', '*');
  //Quels header sont authorisés
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //Quels méthodes sont possible
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



app.use(bodyParser.json())
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

