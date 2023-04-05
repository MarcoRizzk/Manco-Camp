const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params to read req.params

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

//for controllers
const reviews = require('../controllers/reviews');


const Review = require('../models/review'); 
const Campground = require('../models/campground'); //to import schema from this location

 


//REVIEWS
router.post('/', validateReview , isLoggedIn, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview));

module.exports = router;