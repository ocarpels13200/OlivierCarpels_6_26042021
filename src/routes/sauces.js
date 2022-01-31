//J'importe le framework express
const express = require('express');

//Création d'un router, permet de déplacer la logique métier dans des controllers
const router = express.Router();

//J'importe le fichiers des controleurs sauces
const saucesCtrl = require('../controllers/sauces');

//J'importe le middleware d'authentification
const auth = require('../middleware/auth');

//J'importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getSauces); //Affichage des sauces
router.get('/:id', auth,  saucesCtrl.getOneSauce); //Affichage d'une sauce
router.post('/', auth, multer, saucesCtrl.addSauce); //Ajouter une sauce
router.put('/:id', auth, multer, saucesCtrl.updateSauce); //Mise à jour d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce); //Supprimer une sauce
router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce); //Like ou dislike pour une sauce


module.exports = router;