const {
    Group,
    validate
} = require('../models/group');
const { Account } = require('../models/account');
const { PuzzlePackage } = require('../models/puzzle-package');

module.exports = {

    createGroup: async function (req, res) {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            const group = new Group(req.body);
            await group.save(function (err, group) {
                if (err) return console.error(err);
            });
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
            const account = await Account.findOne({ email: req.userEmail })
            const groups = [];
            for (let i = (page - 1) * limit; i < account.coachGroups.length && i < page * limit; i++) {
                const group = await Group.findById(account.coachGroups[i]);
                groups.push(group);
            }
            const groupsWith = [];
            const groupsWithout = []
            if (req.query.newsId) {
                for (let i = 0; i < groups.length; i++){
                    if(groups[i].news.includes(req.query.newsId)){
                        groupsWith.push(groups[i]);
                    }else{
                        groupsWithout.push(groups[i]);
                    }
                }
                return res.status(200).send({ groupsWith: groupsWith, groupsWithout: groupsWithout});
            }
            if (req.query.debutId) {
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i].debuts.includes(req.query.debutId)) {
                        groupsWith.push(groups[i]);
                    } else {
                        groupsWithout.push(groups[i]);
                    }
                }
                return res.status(200).send({ groupsWith: groupsWith.reverse(), groupsWithout: groupsWithout.reverse() });
            }
            if (req.query.puzzlePackageId) {
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i].puzzlesPackages.includes(req.query.puzzlePackageId)) {
                        groupsWith.push(groups[i]);
                    } else {
                        groupsWithout.push(groups[i]);
                    }
                }
                return res.status(200).send({ groupsWith: groupsWith.reverse(), groupsWithout: groupsWithout.reverse() });
            }
            res.status(200).send(groups.reverse());
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getParticipantGroups: async function (req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const account = await Account.findOne({ email: req.userEmail })
            const groups = [];
            for (let i = (page - 1) * limit; i < account.participantGroups.length && i < page * limit; i++) {
                const group = await Group.findById(account.participantGroups[i]);
                if(group){
                    groups.push(group);
                }
                
            }
            res.status(200).send(groups.reverse());
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getGroup: async function (req, res) {
        try {
            const account = await Account.findOne({ email: req.userEmail })
            if (!account.coachGroups.includes(req.params.groupId)){
                return res.status(403).send("You are not coach of that group.")
            }
            const group = await Group.findById(req.params.groupId);
            res.status(200).send(group);
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getParticipantsInfo: async function (req, res) {
        try {
            const account = await Account.findOne({ email: req.userEmail })
            if (!account.coachGroups.includes(req.params.groupId)) {
                return res.status(403).send("You are not coach of that group.")
            }
            const group = await Group.findById(req.params.groupId).select({name: 1, participants: 1});
            const participants = [];
            for(let i = 0; i < group.participants.length; i++){
                const participant = await Account.findById(group.participants[i]).select({name: 1, surname: 1, email: 1});
                if(participant){
                    participants.push(participant);
                }
            }
            res.status(200).send({name: group.name, participants: participants});
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    getGroupPuzzlePackages: async function (req, res) {
        try {
            const account = await Account.findOne({ email: req.userEmail })
            if (!account.coachGroups.includes(req.params.groupId)) {
                return res.status(403).send("You are not coach of that group.")
            }
            const group = await Group.findById(req.params.groupId).select({ name: 1, puzzlesPackages: 1 });
            const puzzlePackages = [];
            for (let i = 0; i < group.puzzlesPackages.length; i++) {
                const puzzlePackage = await PuzzlePackage.findById(group.puzzlesPackages[i]);
                if (puzzlePackage) {
                    puzzlePackages.push(puzzlePackage);
                }
            }
            res.status(200).send({ groupName: group.name, puzzlePackages: puzzlePackages });
        } catch (ex) {
            return res.status(404).send(ex)
        }
    },
    deleteGroup: async function (req, res) {
        try {
            const account = await Account.findOne({ email: req.userEmail })
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
                    $set: { name: req.body.name }
                }
            );
            res.status(200).send(oldGroup);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    editGroupParticipants: async function (req, res) {
        try {
            let newGroup;
            const account = await Account.findOne({ email: req.body.participant })
            if(req.query.isDel === 'true'){
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $pull: { participants: account._id}
                    },
                    {
                        new: true
                    }
                );
                await Account.findOneAndUpdate(
                    { 
                        email: req.body.participant 
                    }
                    ,
                    {
                        $pull: { participantGroups: req.params.groupId }
                    }
                );
            }else{
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $addToSet: { participants: [account._id] }
                    },
                    {
                        new: true
                    }
                );
                await Account.findOneAndUpdate(
                    {
                        email: req.body.participant
                    }
                    ,
                    {
                        $addToSet: { participantGroups: [req.params.groupId] }
                    }
                );
            }
            
            res.status(200).send(newGroup.participants);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    leaveGroup: async function (req, res) {
        try {
            const account = await Account.findOne({ email: req.userEmail })
            const group = await Group.findById(req.params.groupId);
            const indexOfParticipant = group.participants.findIndex((participant) => {
                return participant == account._id.toString();
            });
            const indexOfGroup = account.participantGroups.findIndex((group) => {
                return group == req.params.groupId;
            });
            console.log(indexOfParticipant, indexOfGroup);
            if (indexOfParticipant !== -1 && indexOfGroup !== -1){
                group.participants.splice(indexOfParticipant, 1);
                account.participantGroups.splice(indexOfGroup, 1);
            }else{
                return res.status(403).send("You are not participant of that group.")
            }
            group.save(); 
            account.save();        
            res.status(200).send(account);
        } catch (ex) {
            console.log(ex);
            return res.status(404).send(ex)
        }
    },
    assignDebut: async function (req, res) {
        try {
            let newGroup;
            if (req.query.isDel === 'true') {
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $pull: { debuts: req.body.debut }
                    },
                    {
                        new: true
                    }
                );
            } else {
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $addToSet: { debuts: [req.body.debut] }
                    },
                    {
                        new: true
                    }
                );
            }
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    assignNews: async function (req, res) {
        try {
            let newGroup;
            if (req.query.isDel === 'true') {
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $pull: { news: req.body.news }
                    },
                    {
                        new: true
                    }
                );
            } else {
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $addToSet: { news: [req.body.news] }
                    },
                    {
                        new: true
                    }
                );
            }
            res.status(200).send(newGroup);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    assignPuzzlePackage: async function (req, res) {
        try {
            let newGroup;
            if (req.query.isDel === 'true') {
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $pull: { puzzlesPackages: req.body.puzzlePackage }
                    },
                    {
                        new: true
                    }
                );
            } else {
                newGroup = await Group.findByIdAndUpdate(
                    req.params.groupId,
                    {
                        $addToSet: { puzzlesPackages: [req.body.puzzlePackage] }
                    },
                    {
                        new: true
                    }
                );
            }
            res.status(200).send(newGroup);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getAnswersParticipant: async function (req, res) {
        try {
            const group = await Group.findById(req.params.groupId);
            const account = await Account.findOne({ email: req.userEmail });
            const indexOfAnswer = group.answers.findIndex((element) => {
                return element.puzzlePackage == req.params.puzzlePackageId && element.participant == account._id.toString();
            });
            if(indexOfAnswer === -1){
                return res.status(200).send([]);
            }
            res.status(200).send(group.answers[indexOfAnswer].solutions);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getAnswersPuzzlePackage: async function (req, res) {
        try {
            const group = await Group.findById(req.params.groupId);
            const answers = group.answers.filter((element) => {
                console.log(element.puzzlePackage, req.params.puzzlePackageId);
                return element.puzzlePackage == req.params.puzzlePackageId;
            });
            res.status(200).send(answers);
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    getParticipantAnswers: async function (req, res) {
        try {
            const group = await Group.findById(req.params.groupId);
            const account = await Account.findById(req.params.participantId);
            const participantAnswers = group.answers.filter((answer) => {
                return answer.participant == req.params.participantId
            });
            res.status(200).send({ participant: account.name + ' ' + account.surname, answers: participantAnswers });
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    },
    answerPuzzlePackage: async function (req, res) {
        try {
            const group = await Group.findById(req.params.groupId);
            const account = await Account.findOne({ email: req.userEmail });
            const indexOfAnswer = group.answers.findIndex((element) => {
                return element.puzzlePackage == req.params.puzzlePackageId && element.participant == account._id.toString();
            });

            if(indexOfAnswer === -1){
                if (req.body.puzzleNumber === 0){
                    const answerObject = {
                        puzzlePackage: req.params.puzzlePackageId,
                        participant: account._id,
                        solutions: [req.body.answer]
                    }
                    group.answers.push(answerObject);
                    await group.save();
                    return res.status(200).send(answerObject);
                }
            }else{
                const solutions = group.answers[indexOfAnswer].solutions;
                if (solutions.length === req.body.puzzleNumber){
                    solutions.push(req.body.answer);
                    await group.save();
                    return res.status(200).send(solutions);
                }
            }
            res.status(409).send('Bad puzzle number');
        } catch (e) {
            console.log(e);
            return res.status(404).send(e);
        }
    }
}