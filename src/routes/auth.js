//On commence par importer le framework express
const express = require('express');

//Création d'un router
const router = express.Router();

router.post('/signup', (req, res, next) => {
    res.send('Requête POST sur port 3000')
    res.status(201)
});

router.post('/login', (req, res, next) => {
    console.log('Requête POST sur port 3000');
    res.status(201);
}); //Middleware

module.exports = router;