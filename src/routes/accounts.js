const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts');
const autho = require('../middleware/autho');

router.route('/').post(accountsController.createAccount);
router.route('/').get(autho).get(accountsController.getAccounts);
router.route('/login').post(accountsController.login);


module.exports = router;