const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params to read req.params
const joi = require('joi');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const {isLoggedIn, isAuthor, validatedCampground } = require('../middleware'); 

//image upload using cloudinary
const multer  = require('multer');  //multer used to read the uploaded files 
const {storage} = require('../cloudinary'); //storage to upload files to
const upload = multer({ storage }); //connecting multer and cloudinary


const Campground = require('../models/campground'); //to import schema from this location

//for controllers
const campgrounds = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync (campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validatedCampground ,catchAsync(campgrounds.createCampground));
   


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatedCampground  , catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor , catchAsync(campgrounds.destroyCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


// router.get('/', catchAsync (campgrounds.index));
// router.post('/', isLoggedIn, validatedCampground,  catchAsync(campgrounds.createCampground));

// router.get('/:id', catchAsync(campgrounds.showCampground));

// router.put('/:id', isLoggedIn, isAuthor , catchAsync(campgrounds.updateCampground));

// router.delete('/:id', isLoggedIn, isAuthor , catchAsync(campgrounds.destroyCampground));



module.exports = router;