const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const autho = require('../middleware/autho');

router.route('/').post(autho).post(newsController.createNews);
router.route('/').get(autho).get(newsController.getCoachNews);
router.route('/:newsId').delete(autho).delete(newsController.deleteNews);
router.route('/group/:groupId').get(autho).get(newsController.getGroupNews);

module.exports = router;