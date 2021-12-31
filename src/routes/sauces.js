//On commence par importer le framework express
const express = require('express');

//Création d'un router
const router = express.Router();

//Importation des controleurs
const saucesCtrl = require('../controllers/sauces'); //contrôleur sauces

router.get('/', saucesCtrl.getSauces); //Affichage des sauces
router.get('/:id', saucesCtrl.getOneSauce); //Affichage d'une sauce
router.post('/', saucesCtrl.addSauce); //Ajouter une sauce
router.put('/:id', saucesCtrl.updateSauce); //Mise à jour d'une sauce
router.delete('/:id', saucesCtrl.deleteSauce); //Supprimer une sauce
router.post('/:id/like', saucesCtrl.likesauce); //Vote pour une sauce


module.exports = router;