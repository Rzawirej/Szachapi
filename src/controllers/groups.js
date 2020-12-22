const {
    Group,
    validate
} = require('../models/group');
const { Account } = require('../models/account');

module.exports = {

    createGroup: async function (req, res) {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            group = new Group(req.body);
            await group.save(function (err, group) {
                if (err) return console.error(err);
            });
            console.log(req.userEmail);
            await Account.findOneAndUpdate({ email: req.userEmail }, { $addToSet: { coachGroups: [group._id] } });
            res.status(200).send(group);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getCoachGroups: async function (req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            account = await Account.findOne({ email: req.userEmail })
            const groups = [];
            for (let i = (page - 1) * limit; i < account.coachGroups.length && i < page * limit; i++) {
                const group = await Group.findById(account.coachGroups[i]);
                groups.push(group);
            }
            res.status(200).send(groups);
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    deleteGroup: async function (req, res) {
        try {
            account = await Account.findOne({ email: req.userEmail })
            if (account.coachGroups.indexOf(req.params.groupId) == -1)
                return res.status(404).send('A group with the given ID was not found');
            account.coachGroups.pull(req.params.groupId);
            await account.save();
            const group = await Group.findOneAndDelete({ _id: req.params.groupId });
            res.send(group);
        } catch (e) {
            res.status(500).send('Error occurred');
            console.log(e);
        }
    },
    editGroupName: async function (req, res) {
        try {
            const oldGroup = await Group.findByIdAndUpdate(
                req.params.groupId,
                {
                    $set: {name: req.body.name}
                }
            );
            res.status(200).send(oldGroup);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    assignDebut: async function (req, res) {
        try {
            const newGroup = await Group.findByIdAndUpdate(
                req.params.groupId,
                {
                    $addToSet: { debuts: [...req.body.debuts] }
                },
                {
                    new: true
                }
            );
            res.status(200).send(newGroup);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    }
}