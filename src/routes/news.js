const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const auth = require('../middleware/auth');

router.route('/').post(auth).post(newsController.createNews);
router.route('/').get(auth).get(newsController.getCoachNews);
router.route('/:newsId').delete(auth).delete(newsController.deleteNews);
router.route('/group/:groupId').get(auth).get(newsController.getGroupNews);

module.exports = router;