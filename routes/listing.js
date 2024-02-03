const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

router
.route("/")
    // Index route
    .get(wrapAsync(listingController.index))
    //Create route  
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));


/*******************************************************/
//New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

/*******************************************************/

router
.route("/:id")
    //Show route
    .get(wrapAsync(listingController.showListing))
    //update route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    //Delete route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));




/*******************************************************/
// Edit & Update route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing))

/*******************************************************/

module.exports = router;