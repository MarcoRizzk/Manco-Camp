const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/campground');


module.exports.isLoggedIn = (req, res, next)=> {
 if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl ;   //saving the requested urlto redirect me back to the url (through routes) that i visited when i am not logged in after redirecting to the logging in page and logging in
    req.flash('error', 'You must be logged in !')
    return res.redirect('/login');
    }
    next();
}

module.exports.validatedCampground = (req, res, next)=> {
     const { error } = campgroundSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
    }

module.exports.isAuthor = async(req, res, next)=> {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findOne({ id: reviewId });
    if (!review.author.equals(req?.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module,exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}


