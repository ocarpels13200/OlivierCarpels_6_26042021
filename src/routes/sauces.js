//On commence par importer le framework express
const express = require('express');

//Création d'un router
const router = express.Router();

//Importation des controleurs
const saucesCtrl = require('../controllers/sauces'); //contrôleur sauces

//Importation du middleware d'authentification
const auth = require('../middleware/auth');

//Importation du middleware multer
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getSauces); //Affichage des sauces
router.get('/:id', auth,  saucesCtrl.getOneSauce); //Affichage d'une sauce
router.post('/', auth, multer, saucesCtrl.addSauce); //Ajouter une sauce
router.put('/:id', auth, multer, saucesCtrl.updateSauce); //Mise à jour d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); //Supprimer une sauce
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce); //Vote pour une sauce


module.exports = router;