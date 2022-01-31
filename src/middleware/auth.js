//J'importe le module token
const jwt = require('jsonwebtoken');

/*
La variable token sert à stocker le token récupéré dans le header de la requête.
La variable decodedToken récupère un tableau JSON après vérification du token (variable d'environnement contenant la clé secrète
Enfin la variable userId récupère l'Id de l'utilisateur et une condition permet de contrôler si la requête est autorisée ou non
*/
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error : error | 'Requête non authentifiée' });
    }
};