//On commence par importer le framework express
const express = require('express');

//Création d'un router
const router = express.Router();

router.post('/signup', (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
});

router.post('/login', (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
});

module.exports = router;