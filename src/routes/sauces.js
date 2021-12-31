//On commence par importer le framework express
const express = require('express');

//Création d'un router
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send('Requête POST sur port 3000');
});

router.get('/:id', (req, res, next) => {
    res.status(200).send('Requête POST sur port 3000');
});

router.post('/', (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
});

router.put('/:id', (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000')
});

router.delete('/:id', (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
});

router.post('/:id/like', (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
});

module.exports = router;