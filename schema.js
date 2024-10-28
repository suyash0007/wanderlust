const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow("", null),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string().valid(
            "Icons", "Trendings", "New", "Boats", "Castles", 
            "Beachfront", "Arctic", "Amazing pools", "Amazing views", "Top of the world", 
            "Mansions", "Rooms"
        ),
    }).required(),
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});