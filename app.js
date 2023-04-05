if(process.env.NODE_ENV !== 'production') {  //this line wrote to make me see the error stack only during developer mode
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');   //for ejs

const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
const session = require('express-session');
const joi = require('joi');
const flash = require('connect-flash')

const { reviewSchema } = require('./schemas.js')

const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
var methodOverride = require('method-override');

const Campground = require('./models/campground'); //to import schema from this location
const Review = require('./models/review'); 

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');


const MongoStore = require('connect-mongo');
// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://127.0.0.1:27017/Manco';


mongoose.connect(dbUrl, { 
     useNewUrlParser: true,
     useUnifiedTopology: true,    
    })
.then (() => {     
   console.log(' DataBase connected to Manco')
})
.catch(err => {
    console.log('Connection Error!!!!!!!!!!')
    console.log(err)
    }) ;

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views' )); //for ejs
app.set('view engine', 'ejs');



app.use(express.urlencoded({ extended: true }));  // used to show data coming from the form in req.body
app.use(methodOverride('_method'));               // used in put and patch methods for updating data in mongoose
app.use(express.static(path.join(__dirname, 'public')));                //making it public directory

app.use(mongoSanitize({
    replaceWith: '_',
  }));
 
// //HELMET SECURITY
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dk6pstm5m/",  
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret: 'Mancoisasecret',
    touchAfter: 24 * 3600
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

//session config
const sessionconfig = {
    store: store,
    name:'session', //used to change sessionid to another name to  be hardly noticed in cookies bar
    secret: 'Mancoisasecret',
    resave: false,
    // secure: true, //used to work only on https which is more secure and will not run on local host
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expiress: Date.now() + 1000 * 60 * 60 * 24 * 7 , 
        // maxAge: 1000 * 60 * 60 * 24 * 7 , //same as above
    }
}
app.use(session(sessionconfig));

//passport use (must be used after session middleware)
app.use(passport.initialize()); //needed to make passport initialized
app.use(passport.session())     //needed to be logged in in every request and no need to login every request
passport.use(new LocalStrategy(User.authenticate()));  //authenticate included in Localstrategy

passport.serializeUser(User.serializeUser());  //to store user in the session
passport.deserializeUser(User.deserializeUser()); //to unstore user in the session (logout)

//flash use
app.use(flash());
app.use((req, res, next)=> {               //this made to not specify flash message for every page it automaticly detect msgs
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;  //used to check if i am logged in or not and to show or disable login logout and register in the navbar
    next();
})

//for routers
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND!!!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if (!err.message) err.message = 'OH NO , Somthing went wrong!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("APP IS LISTENING TO PORT 3000")
}) 