//On commence par importer le framework express
const express = require('express');

//Création d'une application express en appelant la méthode express
const app = express();

/*Fonctions de l'application prenant comme paramètres la requête et la réponse.
Chaque fonction dans une application express est un élément du Middleware
On passe à la fonction suivante grâce au paramètre next
*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
}); //élément 1 du Middleware donnant l'éccés à note API

app.post('/api/auth/signup', (req, res, next) => {
    console.log('Bravo');
    res.status(201);
}); //élément 2 du Middleware

app.post('/api/auth/login', (req, res, next) => {
    console.log('Bravo');
    res.status(201);
}); //élément 3 du Middleware

app.get('/api/sauces', (req, res, next) => {
    console.log('Bravo');
    res.status(200);
}); //élément 4 du Middleware

//Exportation de l'application
module.exports = app;