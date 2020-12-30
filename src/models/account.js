const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 64,
        required: true
    },
    surname: {
        type: String,
        minlength: 1,
        maxlength: 64,
        required: true
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 32,
        required: true
    },
    news: {
        type: [Schema.Types.ObjectId]
    },
    debuts: {
        type: [Schema.Types.ObjectId]
    },
    puzzlePackages: {
        type: [Schema.Types.ObjectId]
    },
    coachGroups: {
        type: [Schema.Types.ObjectId]
    },
    participantGroups: {
        type: [Schema.Types.ObjectId]
    }
});
const Account = mongoose.model('Account', accountSchema, 'Accounts');

function validateAccount(account) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(64).required(),
        surname: Joi.string().min(1).max(64).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(32).required()
    })
    return schema.validate(account);
}

exports.accountSchema = accountSchema;
exports.validate = validateAccount;
exports.Account = Account;