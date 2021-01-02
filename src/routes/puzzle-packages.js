const express = require('express');
const router = express.Router();
const puzzlePackagesController = require('../controllers/puzzle-packages');
const autho = require('../middleware/autho');

router.route('/').post(autho).post(puzzlePackagesController.createPuzzlePackage);
router.route('/').get(autho).get(puzzlePackagesController.getPuzzlePackages);
router.route('/:puzzlePackageId').get(autho).get(puzzlePackagesController.getPuzzlePackage);
router.route('/:puzzlePackageId').delete(autho).delete(puzzlePackagesController.deletePuzzlePackage);
router.route('/group/:groupId').get(autho).get(puzzlePackagesController.getParticipantPuzzlePackages);


module.exports = router;