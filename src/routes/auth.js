//On commence par importer le framework express
const express = require('express');

//La méthode express.Router() permet de créer des routeurs séparés
const router = express.Router();

//Importation des controleurs
const authCtrl = require('../controllers/auth'); //contrôleur utilisateurs

router.post('/signup', authCtrl.signup); //Route pour la création de comptes
router.post('/login', authCtrl.login); //Route pour la connexion de comptes

module.exports = router;