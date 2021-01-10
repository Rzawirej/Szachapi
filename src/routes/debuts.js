const express = require('express');
const router = express.Router();
const debutsController = require('../controllers/debuts');
const auth = require('../middleware/auth');

router.route('/').post(auth).post(debutsController.createDebut);
router.route('/').get(auth).get(debutsController.getCoachDebuts);
router.route('/:debutId').get(auth).get(debutsController.getDebut);
router.route('/:debutId').delete(auth).delete(debutsController.deleteDebut);
router.route('/group/:groupId').get(auth).get(debutsController.getGroupDebuts);

module.exports = router;