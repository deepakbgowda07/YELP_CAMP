const Joi = require('joi');

/* -----------------------------------------------------
   CAMPGROUND VALIDATION
------------------------------------------------------ */
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().min(3).required(),
        description: Joi.string().min(10).required(),
    }).required(),
    deleteImages: Joi.array()
});


/* -----------------------------------------------------
   REVIEW VALIDATION
------------------------------------------------------ */
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().min(5).required()
    }).required()
});


/* -----------------------------------------------------
   USER REGISTRATION VALIDATION
------------------------------------------------------ */
module.exports.userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),

    // Full email regex validation
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    // Strong password validation
    password: Joi.string()
        .min(8)
        .pattern(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
});
