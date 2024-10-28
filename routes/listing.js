const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })


//index & create route
router
    .route("/")
    .get(wrapAsync(listingController.indexListings))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));

//new Route
router.get("/new", isLoggedIn, listingController.newRenderForm);

//show, update, & delete route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListingDetails))
    .patch(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;