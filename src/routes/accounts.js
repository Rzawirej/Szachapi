const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts');

router.route('/').post(accountsController.createAccount);
router.route('/').get(accountsController.getAccounts);

module.exports = router;