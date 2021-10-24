const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

//only for this route middleware
router.param('id', (req, res, next, val) => {
    console.log("Can be used as common method to check if id is valid");
    next();
})

router.route('/top-5-cheap').get(tourController.aliasTopTours , tourController.getAllTours)

router.route('/tour-stats')
   .get(tourController.getAllTourStats)

router.route('/monthly-plan/:year')
   .get(tourController.getMonthlyPlan)

router.route('/').get(tourController.getAllTours).post(tourController.checkBody , tourController.addTour)
router.route('/:id').get(tourController.getTour).
    patch(tourController.updateTour).
    delete(tourController.deleteTour)

module.exports = router;