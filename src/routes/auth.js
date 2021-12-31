//On commence par importer le framework express
const express = require('express');

//Création d'un router express
const router = express.Router();

//Importation des controleurs
const authCtrl = require('../controllers/auth'); //contrôleur utilisateurs

router.post('/signup', authCtrl.createUser); //Création de comptes
router.post('/login', authCtrl.connectUser); //Connexion comptes

module.exports = router;