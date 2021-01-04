const {
    Account,
    validate
} = require('../models/account');
const jwt = require('jsonwebtoken');

module.exports = {

    createAccount: async function (req, res) {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            
            account = new Account(req.body);
            await account.save(function (err, account) {
                if (err) return console.error(err);
            });
            const token = jwt.sign(account.email, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).send(token);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    login: async function (req, res) {
        try {
            let account = await Account.findOne({ email: req.body.email });
            if (!account) return res.status(404).send('Invalid email or password.');

            if (req.body.password !== account.password) {
                return res.status(404).send('Invalid email or password.')
            }
            const token = jwt.sign(account.email, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).send({token});
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