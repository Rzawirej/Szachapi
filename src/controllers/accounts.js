const {
    Account,
    validate
} = require('../models/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {

    createAccount: async function (req, res) {
        try {
            const { bodyError } = validate(req.body);
            if (bodyError) return res.status(400).send(error.details[0].message);
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);
            req.body.password = password;
            account = new Account(req.body);
            const databaseError = await account.save().catch(err => err);
            console.log(databaseError);
            if (databaseError.name === 'MongoError'){
                if (databaseError.code === 11000){
                    return res.status(403).send('EmailExists');
                }
                return res.status(403).send('MongoError');
            }
            if(databaseError.errors){
                if(databaseError.errors.email){
                    return res.status(403).send('NotEmail');
                }
                
            }
            const token = jwt.sign(account.email, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).send({token, nameSurname: account.name+' '+account.surname});
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    login: async function (req, res) {
        try {
            let account = await Account.findOne({ email: req.body.email });
            if (!account) return res.status(404).send('Invalid email or password.');
            const validPassword = await bcrypt.compare(req.body.password, account.password);
            if (!validPassword) {
                return res.status(404).send('Invalid email or password.')
            }
            const token = jwt.sign(account.email, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).send({token, nameSurname: account.name+' '+account.surname});
        } catch (ex) {
            console.log(ex);
            return res.status(404).send(ex)
        }
    },
    getAccounts: async function (req, res) {
        try {
            accounts = await Account.find({})
            res.status(200).send(accounts);
        } catch (ex) {
            return res.status(404).send(ex)
        }
    }
}