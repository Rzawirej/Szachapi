const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;

const puzzlePackageSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 32,
        required: true
    },
    puzzles: {
        type: [{
            FEN: String,
            answer: [String] 
        }],
        required: true
    }
});
const PuzzlePackage = mongoose.model('PuzzlePackage', puzzlePackageSchema, 'PuzzlePackages');

function validatePuzzlePackage(puzzlePackage) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(32).required(),
        puzzles: Joi.array()
    })
    return schema.validate(puzzlePackage);
}

exports.puzzlePackageSchema = puzzlePackageSchema;
exports.validate = validatePuzzlePackage;
exports.PuzzlePackage = PuzzlePackage;