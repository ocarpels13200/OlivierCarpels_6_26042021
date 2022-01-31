//Dans les controllers nous retrouvons la logique métier

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Appel du model sauce afin d'obtenir le schema de la BDD */
const Sauce = require('../models/sauce');

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Importation du module fs File System pour intervenir sur le système de fichier local */
const fs = require('fs');

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Récupération de l'ensemble des sauces sous la forme d'un tableau JSON grâce à la méthode find() */
exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Récupération de d'une sauce grâce à la méthode findOne(), une comparaison entre l'ID de la base de données et l'ID de la requête est faite (ligne 22) */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then( sauce => res.status(200).json(sauce))
        .catch( error => res.status(404).json({ error }));
};

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Ajout une nouvelle sauce :

    delete sauceObject._id; -> Supprime le faux ID éventuellement généré par le frontend
    const sauce = new Sauces -> Création d'une nouvelle instance du modèle sauce
    ...sauceObject -> Opérateur de propagation spread, récupére le contenu du body (objet JS contenant les informations sur la sauce)
    imageUrl -> Création de l'adresse URL de l'image
    sauce.save() -> Sauvegarde de la sauce dans la base de données

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

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Mise à jour une sauce :

sauceObject -> Objet contenant les nouvelles informations sur la sauce et/ou la nouvelle image

Les deux conditions if (!sauce) et if (sauce.userId !== req.auth.userId) permettent de contrôler que la sauce existe bien et qu'elle appartient bien à l'auteur de la requête

Sauce.updateOne -> Méthode utilisée pour mettre à jour une sauce, deux paramètres lui sont passées
    le premier, {_id: req.params.id}, pour comparer l'ID de la sauce avec l'ID de la raquête
    le deuxième, {...sauceObject, _id: req.params.id}, contient la mise à jour de la sauce et permet à la sauce de garder le même ID

*/
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error : new Error('Sauce non trouvée') });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error('requête non autorisé') });
            }
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce modifié'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Suppression d'une sauce :

Les deux conditions if (!sauce) et if (sauce.userId !== req.auth.userId) permettent de contrôler que la sauce existe bien et qu'elle appartient bien à l'auteur de la requête

filename et fs.unlink permettent de récupérer dans un premier temps le nom de l'image (fichier) pour dans un second temps la supprimer du dossier images

Sauce.deleteOne -> Méthode utilisée pour supprimer une sauce, un paramètre lui est passée
    {_id: req.params.id}, compare l'ID de la sauce avec l'ID de la raquête

*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne( { _id: req.params.id } )
        .then(sauce => {
            if (!sauce) {
                return res.status(404).json({ error : new Error('Sauce non trouvée') });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error('requête non autorisé') });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink( `images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch( error => res.status(500).json({ error }));
};

/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Like / Dislike

Le frontEnd peut envoyer 3 valeurs -> 1 pour un like, -1 pour un dislike ou 0 pour un vote nul

4 possibilités :
    1 - Utilisateur non présent dans le tableau des likes et like = 1 -> incrémentation de la valeur des likes et ajout de l'utilisateur dans le tableau des likes (126 à 133)
    2 - Utilisateur présent dans le tableau des likes et like = 0 -> décrémentation de la valeur des likes et suppresion de l'utilisateur du tableau des likes (134 à 141)
    3 - Utilisateur non présent dans le tableau des dislikes et like = -1 -> incrémentation de la valeur des dislikes et ajout de l'utilisateur dans le tableau des dislikes (142 à 149)
    4 - Utilisateur présent dans le tableau des dislikes et like = 0 -> décrémentation de la valeur des dislikes et suppression de l'utilisateur du tableau des dislikes (150 à 157)

*/
exports.likeDislikeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauce.updateOne({_id: req.params.id}, {
                    $inc: {likes: 1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $push: {usersLiked: req.body.userId} //Opérateur push permettant d'ajouter une valeur dans un tableau
                })
                    .then(() => res.status(200).json({message: 'Like ajouté'}))
                    .catch(error => res.status(400).json({error}));
            }
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({_id: req.params.id}, {
                    $inc: {likes: -1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $pull: {usersLiked: req.body.userId} //Opérateur pull permettant de supprimer une valeur dans un tableau
                })
                    .then(() => res.status(200).json({message: 'Like supprimé'}))
                    .catch(error => res.status(400).json({error}));
            }
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauce.updateOne({_id: req.params.id}, {
                    $inc: {dislikes: 1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $push: {usersDisliked: req.body.userId} //Opérateur push permettant d'ajouter une valeur dans un tableau
                })
                    .then(() => res.status(200).json({message: 'Dislike ajouté'}))
                    .catch(error => res.status(400).json({error}));
            }
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({_id: req.params.id}, {
                    $inc: {dislikes: -1}, //Opérateur permettant d'incrémenter ou de décrémenter la valeur d'un champ
                    $pull: {usersDisliked: req.body.userId} //Opérateur pull permettant de supprimer une valeur dans un tableau
                })
                    .then(() => res.status(200).json({message: 'Dislike supprimé'}))
                    .catch(error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(404).json({error}));
};