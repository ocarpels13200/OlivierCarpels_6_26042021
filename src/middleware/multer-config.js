//Importation de multer
const multer = require('multer');

//Dictionnaire de MIMETYPE
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/*
Règle de création des noms des fichiers des images
    La destination permet d'indiquer le lieu ou nous enregistrons nos images
    La variable extension permet de stocker le type de l'image (png, jpg)
    La variable name permet de séparer le nom de l'image de son extension pour ne garder que le nom
    La variable finalName permet de supprimer les espaces pour les remplacer par des '_'
    Enfin je retourne le nom du fichier contenant le finalName + la date + l'extension
*/
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const name = file.originalname.split('.' + extension)[0];
        const finalName = name.split(' ').join('_');
        callback(null, finalName + Date.now() + '.' + extension);
    }
});

module.exports = multer( {storage} ).single('image');