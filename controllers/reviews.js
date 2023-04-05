const Review = require('../models/review');  
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Creaated a new review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }}) //to delete review id from reviews id in the campground 
    await Review.findByIdAndDelete(reviewId); //to delete review itself
    req.flash('success', 'Successfully deleted review' );
    res.redirect(`/campgrounds/${id}`);
}