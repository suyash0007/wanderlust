const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema ({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    coordinates: {
        address: String,
        lat: Number,
        lon: Number,
    },
    category : {
        type: String,
        enum: ["Icons", "Trendings", "New", "Boats", "Castles", "Beachfront", "Arctic", "Amazing pools", "Amazing views", "Top of the world", "Mansions", "Rooms"],
        // required: true,
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;