//importation du framework mongoose
const mongoose = require('mongoose');

//Création du schéma avec les informations à stocker
const saucesSchema = mongoose.Schema({
    userId: { type: 'String', required: true },
    name: { type: 'String', required: true},
    manufacturer: { type: 'String', required: true },
    description: { type: 'String', required: true },
    mainPepper: {type: 'String', required: true},
    imageUrl: {type: 'String'},
    heat: {type: 'Number', required: true},
    likes: {type: 'Number'},
    dislike: {type: 'Number'}
});

//Exportation du schema sous forme de model
module.exports = mongoose.model('Sauces', saucesSchema);