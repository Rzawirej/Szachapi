const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const auth = require('../middleware/auth');

router.route('/').post(auth).post(groupsController.createGroup);
router.route('/').get(auth).get(groupsController.getCoachGroups);
router.route('/participantGroups').get(auth).get(groupsController.getParticipantGroups);
router.route('/:groupId').delete(auth).delete(groupsController.deleteGroup);
router.route('/:groupId').patch(auth).patch(groupsController.editGroupName);
router.route('/:groupId').get(auth).get(groupsController.getGroup);
router.route('/leave/:groupId').patch(auth).patch(groupsController.leaveGroup);
router.route('/assign-debut/:groupId').patch(auth).patch(groupsController.assignDebut);
router.route('/assign-news/:groupId').patch(auth).patch(groupsController.assignNews);
router.route('/assign-puzzle-package/:groupId').patch(auth).patch(groupsController.assignPuzzlePackage);
router.route('/participants/:groupId').patch(auth).patch(groupsController.editGroupParticipants);
router.route('/participants/:groupId').get(auth).get(groupsController.getParticipantsInfo);
router.route('/puzzlePackages/:groupId').get(auth).get(groupsController.getGroupPuzzlePackages);
router.route('/participants/:groupId/answers/:participantId').get(auth).get(groupsController.getParticipantAnswers);
router.route('/:groupId/answer-participant/:puzzlePackageId').get(auth).get(groupsController.getAnswersParticipant);
router.route('/:groupId/answer-puzzle-package/:puzzlePackageId').get(auth).get(groupsController.getAnswersPuzzlePackage);
router.route('/:groupId/answer-puzzle-package/:puzzlePackageId').patch(auth).patch(groupsController.answerPuzzlePackage);

module.exports = router;