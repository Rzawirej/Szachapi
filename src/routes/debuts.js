const express = require('express');
const router = express.Router();
const debutsController = require('../controllers/debuts');
const autho = require('../middleware/autho');

router.route('/').post(autho).post(debutsController.createDebut);
router.route('/').get(autho).get(debutsController.getCoachDebuts);

module.exports = router;