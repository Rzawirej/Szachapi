const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const autho = require('../middleware/autho');

router.route('/').post(autho).post(groupsController.createGroup);
router.route('/').get(autho).get(groupsController.getCoachGroups);
router.route('/participantGroups').get(autho).get(groupsController.getParticipantGroups);
router.route('/:groupId').delete(autho).delete(groupsController.deleteGroup);
router.route('/:groupId').put(autho).put(groupsController.editGroupName);
router.route('/:groupId').get(autho).get(groupsController.getGroup);
router.route('/leave/:groupId').put(autho).put(groupsController.leaveGroup);
router.route('/assign-debut/:groupId').put(autho).put(groupsController.assignDebut);
router.route('/assign-news/:groupId').put(autho).put(groupsController.assignNews);
router.route('/assign-puzzle-package/:groupId').put(autho).put(groupsController.assignPuzzlePackage);
router.route('/participants/:groupId').put(autho).put(groupsController.editGroupParticipants);
router.route('/participants/:groupId').get(autho).get(groupsController.getParticipantsInfo);
router.route('/puzzlePackages/:groupId').get(autho).get(groupsController.getGroupPuzzlePackages);
router.route('/participants/:groupId/answers/:participantId').get(autho).get(groupsController.getParticipantAnswers);
router.route('/:groupId/answer-participant/:puzzlePackageId').get(autho).get(groupsController.getAnswersParticipant);
router.route('/:groupId/answer-puzzle-package/:puzzlePackageId').get(autho).get(groupsController.getAnswersPuzzlePackage);
router.route('/:groupId/answer-puzzle-package/:puzzlePackageId').put(autho).put(groupsController.answerPuzzlePackage);

module.exports = router;