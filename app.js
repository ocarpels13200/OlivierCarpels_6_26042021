//On commence par importer le framework express
const express = require('express');

//On importe mongoose
const mongoose = require('mongoose');

//importation router
const authRoutes = require('./src/routes/auth');

//Création d'une application express
const app = express();

//Conexion à la base de données
mongoose.connect('mongodb+srv://ocarpels:q$O9Z&6aN28U@cluster0.ih2a2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/*Fonctions de l'application prenant comme paramètres la requête et la réponse.
Chaque fonction dans une application express est appelé Middleware
On passe au middleware suivant grâce au paramètre next
*/

app.use(express.json());//Middleware permettant d'extraire le corps JSON de la requête

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
}); //Middleware donnant l'éccés à note API corrige l'érreur CORS

app.use('/api/auth', authRoutes);

//Exportation de l'application
module.exports = app;