//Dans les controllers nous retrouvons la logique métier

//Appel du model auth pour obtenir le schema de la BDD
const Sauces = require('../models/sauces');

const fs = require('fs');

exports.getSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch( error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then( sauce => res.status(200).json(sauce))
        .catch( error => res.status(404).json({ error }));
};

exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
        ...sauceObject, //Opérateur de propagation spread, récupére le contenu du body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() //Ajout d'une sauce à la base de donnée
        .then(() => res.status(201).json({ message: 'Sauce ajoutée'}))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauces.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne( { _id: req.params.id } )
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink( `images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch( error => res.status(500).json({ error }));
};

exports.likesauce = (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
};