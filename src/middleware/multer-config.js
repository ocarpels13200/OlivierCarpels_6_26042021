//Importation de multer
const multer = require('multer');

//Dictionnaire de MIMETYPE
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

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