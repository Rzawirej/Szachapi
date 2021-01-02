const {
    PuzzlePackage,
    validate
} = require('../models/puzzle-package');
const { Account } = require('../models/account');
const { Group } = require('../models/group');

module.exports = {

    createPuzzlePackage: async function (req, res) {
        try {
            console.log(req.body);
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            puzzlePackage = new PuzzlePackage(req.body);
            console.log(req.userEmail);
            await puzzlePackage.save();
            await Account.findOneAndUpdate({ email: req.userEmail }, { $addToSet: { puzzlePackages: [puzzlePackage._id] } });
            res.status(200).send(puzzlePackage);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getPuzzlePackage: async function (req, res) {
        try {
            const puzzlePackage = await PuzzlePackage.findById(req.params.puzzlePackageId);
            res.status(200).send(puzzlePackage);
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getPuzzlePackages: async function (req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            account = await Account.findOne({ email: req.userEmail })
            const puzzlePackages = [];
            for (let i = (page - 1) * limit; i < account.puzzlePackages.length && i < page * limit; i++) {
                const puzzlePackage = await PuzzlePackage.findById(account.puzzlePackages[i]);
                if(puzzlePackage){
                    puzzlePackages.push(puzzlePackage);
                }
                
            }
            res.status(200).send(puzzlePackages.reverse());
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getParticipantPuzzlePackages: async function (req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            account = await Account.findOne({ email: req.userEmail })
            group = await Group.findById(req.params.groupId)
            if (!group.participants.includes(account._id)) {
                return res.status(403).send('Not participant of this group.')
            }
            const puzzlePackages = [];
            for (let i = (page - 1) * limit; i < group.puzzlesPackages.length && i < page * limit; i++) {
                const indexOfAnswer = group.answers.findIndex((element) => {
                    return element.puzzlePackage == group.puzzlesPackages[i]._id.toString() && element.participant == account._id.toString();
                });
                if (indexOfAnswer === -1 || group.answers[indexOfAnswer].solutions.length < group.puzzlesPackages[i].length){
                    const puzzlePackage = await PuzzlePackage.findById(group.puzzlesPackages[i]);
                    puzzlePackages.push(puzzlePackage);
                }
            }
            res.status(200).send(puzzlePackages.reverse());
        } catch (ex) {
            console.log(ex);
            return res.status(404).send(ex)
        }
    },
    deletePuzzlePackage: async function (req, res) {
        try {
            account = await Account.findOne({ email: req.userEmail })
            if (account.puzzlePackages.indexOf(req.params.puzzlePackageId) == -1)
                return res.status(404).send('A puzzle package with the given ID was not found');
            account.puzzlePackages.pull(req.params.puzzlePackageId);
            await account.save();
            const puzzlePackage = await PuzzlePackage.findOneAndDelete({ _id: req.params.puzzlePackageId });
            res.send(puzzlePackage);
        } catch (e) {
            res.status(500).send('Error occurred');
            console.log(e);
        }
    }
}