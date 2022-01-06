//Dans les controllers nous retrouvons la logique métier

//Appel du model auth pour obtenir le schema de la BDD
const Sauces = require('../models/sauces');

exports.getSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch( error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then( sauce => res.status(200).json(sauce))
        .catch( error => res.status(404).json({ error }));
};

exports.addSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauces({
        ...req.body //Opérateur de propagation spread, récupére le contenu du body
    });
    sauce.save() //Ajout d'une sauce à la base de donnée
        .then(() => res.status(201).json({ message: 'Sauce ajoutée'}))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000')
};

exports.deleteSauce = (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
};

exports.likesauce = (req, res, next) => {
    res.status(201).send('Requête POST sur port 3000');
};