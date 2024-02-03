if(process.env.NODE_ENV != 'production') {
require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');   
const User = require('./models/user.js');
import nodeVersionAlias from 'node-version-alias'
await nodeVersionAlias('latest', {
    // Use a mirror for Node.js binaries
    mirror: 'https://npmmirror.com/mirrors/node',
    // Do not cache the list of available Node.js versions
    fetch: true,
    // Cancels when the signal is aborted
    signal: new AbortController().signal,
})

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsmate);
app.use(methodOverride('_method'));


/*******************************************************/
// database connectivity code
const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("connected to database successfully");
}).catch((err) => {
    console.log("err");
});

async function main() {
    await mongoose.connect(dbUrl);
}
/*******************************************************/

const store = MongoStore.create({
    mongoUrl : dbUrl,
    cypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error", () => {
    console.log("Error : ", err)
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true 
    }
};




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})


/****************** ****************/
//Restructing listings
app.use("/listings", listingRouter);
/****************** ****************/

/****************** ****************/
//Restructing reviews
app.use("/listings/:id/reviews", reviewRouter);
/****************** ****************/

/****************** ****************/
//Restructing reviews
app.use("/", userRouter);
/****************** ****************/




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})


/*Error Handling Middleware */
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went Wrong!"} = err;
    res.render("error.ejs", {err});
})

app.listen(8080, () => {
    console.log('listening on port 8080');
})