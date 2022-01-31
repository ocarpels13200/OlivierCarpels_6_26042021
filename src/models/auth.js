//J'importe le framework mongoose
const mongoose = require('mongoose');

//J'importe le validateur mongoose pour controler qu'une adresse e-mail est unique
const uniqueValidator = require('mongoose-unique-validator');

//Création du schéma avec les informations à stocker
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //l'email doit être unique
    password: { type: String, required: true }
})

//Application du validateur à notre schema
userSchema.plugin(uniqueValidator);

//Exportation du schema sous forme de model
module.exports = mongoose.model('User', userSchema);