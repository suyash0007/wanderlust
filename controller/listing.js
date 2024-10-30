const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError.js");
const axios = require('axios');

module.exports.indexListings = async (req, res) => {
    let cate = req.query.category;
    let searchQuery = req.query.search;
    let allListings;
    if(searchQuery) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { location: { $regex: searchQuery, $options: 'i' } },
            ]
        });    
    } else if (cate) {
        allListings = await Listing.find({category: cate});
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings });
}

module.exports.newRenderForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListingDetails = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "the listing you requests does not exist");
        res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", {listing});
}

module.exports.createNewListing = async (req, res) => {
    const  address  = req.body.listing.location;
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await axios.get(nominatimUrl);
    const lat = response.data[0].lat;
    const lon = response.data[0].lon;
    const category = req.body.listing.category;

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(...req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.coordinates = { address, lat, lon };
    newListing.category = category;
    let savedListing = (await newListing.save());
    console.log(savedListing);

    req.flash("success", "new listing created successfully");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "the listing you requests does not exist");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/ar_1:1,c_auto,g_auto,w_500/r_max");
    res.render("listings/edit.ejs", { listing, originalUrl });
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    if(!req.body.listing) {
        throw new ExpressError(400, "please provide a valid listing")
    }
    let listings = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = { url, filename };
        await listings.save()
    }
    req.flash("success", "listing updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListng = await Listing.findByIdAndDelete(id);
    console.log(deletedListng);
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
}