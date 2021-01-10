const express = require('express');
const router = express.Router();
const puzzlePackagesController = require('../controllers/puzzle-packages');
const auth = require('../middleware/auth');

router.route('/').post(auth).post(puzzlePackagesController.createPuzzlePackage);
router.route('/').get(auth).get(puzzlePackagesController.getPuzzlePackages);
router.route('/:puzzlePackageId').get(auth).get(puzzlePackagesController.getPuzzlePackage);
router.route('/:puzzlePackageId').delete(auth).delete(puzzlePackagesController.deletePuzzlePackage);
router.route('/group/:groupId').get(auth).get(puzzlePackagesController.getParticipantPuzzlePackages);


module.exports = router;