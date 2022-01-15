//Importation du module token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Découpage de authorization dans le header nous récupérons la deuxième partie le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //jwt.verify décode notre token, il renvoi un objet JSON
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