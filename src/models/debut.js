const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const debutSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 64,
        required: true
    },
    color: {
        type: String,
        minlength: 1,
        maxlength: 1,
        required: true
    },
    pgn: {
        type: [Object],
        required: true
    },
});
const Debut = mongoose.model('Debut', debutSchema, 'Debuts');

function validateDebut(debut) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(64).required(),
        color: Joi.string().min(1).max(1).required(),
        pgn: Joi.array().required()
    })
    return schema.validate(debut);
}

exports.debutSchema = debutSchema;
exports.validate = validateDebut;
exports.Debut = Debut;