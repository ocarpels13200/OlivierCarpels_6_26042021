//Dans les controllers nous retrouvons la logique métier

//Appel du model sauce pour obtenir le schema de la BDD
const Sauce = require('../models/sauce');

//Importation du module fs File System
const fs = require('fs');

/*
Middleware permettant de récupérer l'ensemble des sauces.
Sauce.find() -> Méthode pour récupérer les sauces dans la BDD
*/
exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch( error => res.status(400).json({ error }));
};

/*
Middleware permettant d'afficher une seule sauce en fonction de son id
Sauce.findOne({ _id: req.params.id }) -> Méthode pour récupérer une sauce, req.params.id permet de récupérer l'id de la sauce / comparaison
*/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then( sauce => res.status(200).json(sauce))
        .catch( error => res.status(404).json({ error }));
};

/*
Middleware permettant d'ajouter une nouvelle sauce :
delete sauceObject._id; -> Supprime l'ID éventuellement généré par le frontend
const sauce = new Sauces -> Création d'une nouvelle instance du model sauce
...sauceObject -> Opérateur de propagation spread, récupére le contenu du body
sauce.save() -> Sauvegarde d'une sauce à la base de donnée
*/
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée'}))
        .catch(error => res.status(400).json({ error }));
};

/*
Middleware permettant de mettre à jour une sauce
Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id }) -> Méthode pour mettre à jour une sauce, deux paramètres, le premier pour comparer l'id et le deuxième avec le nouvel objet en gardant le même id
*/
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

//Recherche de la sauce dans la BDD pour supprimer l'ancienne image
    Sauce.findOne( { _id: req.params.id } )
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink( `images/${filename}`, () => {

                //Mise à jour de la sauce
                Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié' }))
                    .catch(error => res.status(400).json({ error }));

            })
        })
        .catch( error => res.status(500).json({ error }));
};

/*
Middleware permettant de supprimer une sauce
*/
exports.deleteSauce = (req, res, next) => {

    //Recherche de la sauce dans la BDD pour supprimer l'image
    Sauce.findOne( { _id: req.params.id } )
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink( `images/${filename}`, () => {

                //Suppression de la sauce
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch( error => res.status(500).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
    //Recherche de la sauce dans la BDD pour supprimer l'image
    Sauce.findOne( { _id: req.params.id } )
        .then(sauce => {

            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
                Sauce.updateOne({_id : req.params.id} ,{
                    $inc: {likes: 1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $push: {usersLiked: req.body.userId} //Opérateur push permettant d'ajouter une valeur dans un tableau
                })
                    .then(() => res.status(200).json({ message: 'Like ajouté' }))
                    .catch( error => res.status(400).json({ error }));
            }

            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
                Sauce.updateOne({_id : req.params.id} ,{
                    $inc: {likes: -1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $pull: {usersLiked: req.body.userId} //Opérateur pull permettant de supprimer une valeur dans un tableau
                })
                    .then(() => res.status(200).json({ message: 'Like supprimé' }))
                    .catch( error => res.status(400).json({ error }));
            }

            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === -1){
                Sauce.updateOne({_id : req.params.id} ,{
                    $inc: {dislikes: 1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $push: {usersDisliked: req.body.userId} //Opérateur push permettant d'ajouter une valeur dans un tableau
                })
                    .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
                    .catch( error => res.status(400).json({ error }));
            }

            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
                Sauce.updateOne({_id : req.params.id} ,{
                    $inc: {dislikes: -1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $pull: {usersDisliked: req.body.userId} //Opérateur pull permettant de supprimer une valeur dans un tableau
                })
                    .then(() => res.status(200).json({ message: 'Dislike supprimé' }))
                    .catch( error => res.status(400).json({ error }));
            }

        })
        .catch( error => res.status(404).json({ error }));
};