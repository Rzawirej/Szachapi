const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const accountSchema = new mongoose.Schema({
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
        minlength: 6,
        maxlength: 32,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 32,
        required: true
    }
});
const Account = mongoose.model('Account', accountSchema, 'Accounts');

function validateAccount(account) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(64).required(),
        surname: Joi.string().min(1).max(64).required(),
        email: Joi.string().min(6).max(32).required(),
        password: Joi.string().min(8).max(32).required()
    })
    return schema.validate(account);
}

exports.accountSchema = accountSchema;
exports.validate = validateAccount;
exports.Account = Account;