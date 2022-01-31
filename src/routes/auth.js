//J'importe le framework express
const express = require('express');

//Création d'un router, permet de déplacer la logique métier dans des controllers
const router = express.Router();

//J'importe le fichiers des controleurs auth
const authCtrl = require('../controllers/auth');

router.post('/signup', authCtrl.signup); //Route pour la création de comptes
router.post('/login', authCtrl.login); //Route pour la connexion de comptes

module.exports = router;