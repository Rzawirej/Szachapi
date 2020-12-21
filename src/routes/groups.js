const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groups');
const autho = require('../middleware/autho');

router.route('/').post(autho).post(groupController.createGroup);
router.route('/').get(autho).get(groupController.getCoachGroups);
router.route('/:groupId').delete(autho).delete(groupController.deleteGroup);
router.route('/:groupId').put(autho).put(groupController.editGroupName);
router.route('/assignDebuts/:groupId').put(autho).put(groupController.assignDebut);

module.exports = router;