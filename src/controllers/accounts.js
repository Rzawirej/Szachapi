const {
    Account,
    validate
} = require('../models/account');
const axios = require('axios');

module.exports = {

    createAccount: async function (req, res) {
        try {
            const {
                error
            } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            account = new Account(req.body);
            await account.save(function (err, account) {
                if (err) return console.error(err);
            });
            res.status(200).send(account);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
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