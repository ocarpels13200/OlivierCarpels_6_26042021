//Dans les controllers nous retrouvons la logique métier

//Appel du model auth pour obtenir le schema de la BDD
const User = require('../models/auth');

//Importation du module de cryptage
const bcrypt = require('bcrypt');

//Importation du module token
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10,) //Fonction asynchrone de cryptage du mot de passe nous faisons 10 passes pour le cryptage
        .then(hash => {
            const user = new User({ //Création d'un nouvel utilisateur après récupération du mot de passe crypté
                email: req.body.email,
                password: hash
            });
            user.save() //Ajout de l'utilisateur à la base de données
                .then(() => res.status(201).json({message: 'Utilisateur Créé'}))
                .catch(error => res.status(400).json({error})); //erreur réponse MongoDB
        })
        .catch(error => res.status(500).json({error})); //Erreur serveur API ne répond pas, erreur dans le hash...
};

exports.login = (req, res, next) => {
    User.findOne({ //Fonction asynchrone de recherche d'utilisateur dans la base de donnéees
        email: req.body.email
    })
        .then( user => {
            if (!user) { //Condition si utilisateur est trouvé ou non
                return res.status(401).json({ error: "Utilisateur non trouvé"}); //Utilisateur non trouvé
            }
            bcrypt.compare(req.body.password, user.password) //Fonction asynchrone de comparaison de mot de passe hash
                .then(valid => { //La comparaison de hash envoie une valeur booléenne true ou false
                    if (!valid) { //Les valeurs ne correspondent pas
                        return res.status(401).json({ error: "Mot de passe incorrect"}); //hash ne correspond pas false
                    }
                    res.status(200).json({ //Mots de passe corespondent, retour d'un objet json avec l'ID et un Token
                        userId: user._id,
                        token: jwt.sign( //Fonction permettant d'encoder un token
                            {userId: user._id}, /*Indication des données qu'on souhaite encoder -> payload
                            On encode l'userId pour s'assurer qu'un utilisateur ne puisse pas modifier une sauce
                            ne lui appartenant pas.
                            */
                            'RANDOM_TOKEN_SECRET', //Clé secréte pour l'encodage, à remplacer par une chaine plus longue en production
                            { expiresIn: '24h'} //Argument de configuration gestion de l'expiration du token
                        )
                    });
                })
                .catch(error => res.status(500).json({error})); //Erreur serveur ex: MongoDB ne répond pas
        })
        .catch( error => res.status(500).json({error})); //Erreur serveur ex: MongoDB ne répond pas
};