const express = require('express');
const router = express.Router();
const debutsController = require('../controllers/debuts');
const autho = require('../middleware/autho');

router.route('/').post(autho).post(debutsController.createDebut);
router.route('/').get(autho).get(debutsController.getCoachDebuts);
router.route('/:debutId').get(autho).get(debutsController.getDebut);
router.route('/:debutId').delete(autho).delete(debutsController.deleteDebut);
router.route('/group/:groupId').get(autho).get(debutsController.getGroupDebuts);

module.exports = router;