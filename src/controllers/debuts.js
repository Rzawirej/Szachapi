const {
    Debut,
    validate
} = require('../models/debut');
const { Account } = require('../models/account');
const { Group } = require('../models/group');

module.exports = {

    createDebut: async function (req, res) {
        try {
            const {
                error
            } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            debut = new Debut(req.body);
            await debut.save(function (err, debut) {
                if (err) return console.error(err);
            });
            await Account.findOneAndUpdate({ email: req.userEmail }, { $addToSet: { debuts: [debut._id] } }); 
            res.status(200).send(debut);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getDebut: async function (req, res) {
        try {
            const debut = await Debut.findById(req.params.debutId);
            res.status(200).send(debut);
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getCoachDebuts: async function (req, res) {
        try {
            const {page = 1, limit = 10} = req.query;
            account = await Account.findOne({ email: req.userEmail })
            const debuts = [];
            for(let i = (page-1)*limit; i < account.debuts.length && i < page*limit; i++) {
                const debut = await Debut.findById(account.debuts[i]);
                debuts.push(debut);
            }
            res.status(200).send(debuts.reverse());
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getGroupDebuts: async function (req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            account = await Account.findOne({ email: req.userEmail })
            group = await Group.findById(req.params.groupId)
            if(!group.participants.includes(account._id)){
                return res.status(403).send('Not participant of group.')
            }
            const debuts = [];
            for (let i = (page - 1) * limit; i < group.debuts.length && i < page * limit; i++) {
                const debut = await Debut.findById(group.debuts[i]);
                debuts.push(debut);
            }
            res.status(200).send(debuts.reverse());
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    deleteDebut: async function (req, res) {
        try {
            account = await Account.findOne({ email: req.userEmail })
            if (account.debuts.indexOf(req.params.debutId) == -1)
                return res.status(404).send('A news with the given ID was not found');
            account.debuts.pull(req.params.debutId);
            await account.save();
            const debut = await Debut.findOneAndDelete({ _id: req.params.debutId });
            res.send(debut);
        } catch (e) {
            res.status(500).send('Error occurred');
            console.log(e);
        }
    }
}