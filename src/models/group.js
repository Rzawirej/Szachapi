const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 32,
        required: true
    },
    debuts: {
        type: [Schema.Types.ObjectId]
    },
    puzzlesPackages: {
        type: [{
            packageId: Schema.Types.ObjectId,
            answers:{
                moves: [Object],
                playerId: Schema.Types.ObjectId
            }
        }]
    },
    players: {
        type: [Schema.Types.ObjectId]
    }
});
const Group = mongoose.model('Group', groupSchema, 'Groups');

function validateGroup(group) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(32).required(),
    })
    return schema.validate(group);
}

exports.groupSchema = groupSchema;
exports.validate = validateGroup;
exports.Group = Group;