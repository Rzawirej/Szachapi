const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts');
const auth = require('../middleware/auth');

router.route('/').post(accountsController.createAccount);
router.route('/').get(auth).get(accountsController.getAccounts);
router.route('/login').post(accountsController.login);


module.exports = router;