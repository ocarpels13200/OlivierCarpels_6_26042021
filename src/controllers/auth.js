//Dans les controllers nous retrouvons la logique métier

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Appel du model auth afin d'obtenir le schema de la BDD */
const User = require('../models/auth');

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Importation du module de cryptage */
const bcrypt = require('bcrypt');

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Importation du module jsonwebtoken */
const jwt = require('jsonwebtoken');

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Création d'un nouveau compte :
    bcrypt.hash permet de hasher (crypter) le mot de passe. Le sels permet d'ajouter une chaîne aléatoire pour se protéger d'une attaque "rainbow tables"
    Dans la variable user je créé une nouvelle instance de User contenant une adresse mail et le mot de passe hashé
    Enfin user.save permet d'ajouter l'utilisateur à la base de données
*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10,)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur Créé'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Connexion à un compte :
    Recherche d'un utilisateur grâce à la méthode findOne(), une comparaison entre l'email dans la base de données et l'email contenu dans la requête est faite
    Si un utilisateur est trouvé, je compare, entre la base de données et la requête, le mot de passe hashé bcrypt.compare (retourne true ou false)
    Si les mots de passe correspondent, un token est généré à partir de l'userId et d'une clè secréte de cryptage (variable d'environnement)
*/
exports.login = (req, res, next) => {
    User.findOne({
        email: req.body.email
    })
        .then( user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch( error => res.status(500).json({error}));
};