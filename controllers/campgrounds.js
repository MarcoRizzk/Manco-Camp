const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');

//MAP BOX
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); 
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    console.log(geoData);
    const campground = new Campground(req.body.campground); 
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename:f.filename})); //this made to append the images url and names from cloudinary to the model of campground
    campground.author = req.user._id;
    await campground.save();
    req.flash('Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`) 
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
}).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds'); 
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req,res) => {
    const { id } = req.params;
    // const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators: true, new: true })  //we have to struct this to find the campground then to check if the user can update it or not
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators: true, new: true })
    const imgs = req.files.map(f => ({url: f.path, filename:f.filename})); //we turned this into array using map
    campground.images.push(...imgs); //the we push it in the original array after spreading it
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);    //to delete deletedImages from cloud
        };
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});  //this means to pull images with the exact file name with the deletedImages included in req.body and delete them
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.destroyCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground' );
    res.redirect('/campgrounds');
}