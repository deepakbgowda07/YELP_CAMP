const Joi = require('joi');

/* -----------------------------------------------------
   CAMPGROUND VALIDATION
------------------------------------------------------ */
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Campground title is required',
                'string.min': 'Title must be at least 3 characters long',
                'string.max': 'Title must not exceed 100 characters',
                'any.required': 'Title is required'
            }),
        price: Joi.number()
            .min(0)
            .required()
            .messages({
                'number.base': 'Price must be a valid number',
                'number.min': 'Price cannot be negative',
                'any.required': 'Price is required'
            }),
        location: Joi.string()
            .min(3)
            .required()
            .messages({
                'string.empty': 'Location is required',
                'string.min': 'Location must be at least 3 characters long',
                'any.required': 'Location is required'
            }),
        description: Joi.string()
            .min(10)
            .required()
            .messages({
                'string.empty': 'Description is required',
                'string.min': 'Description must be at least 10 characters long',
                'any.required': 'Description is required'
            }),
    }).required(),
    deleteImages: Joi.array()
});


/* -----------------------------------------------------
   REVIEW VALIDATION
------------------------------------------------------ */
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.base': 'Rating must be a valid number',
                'number.min': 'Rating must be at least 1 star',
                'number.max': 'Rating cannot exceed 5 stars',
                'any.required': 'Please select a rating'
            }),
        body: Joi.string()
            .min(5)
            .required()
            .messages({
                'string.empty': 'Review comment is required',
                'string.min': 'Review must be at least 5 characters long',
                'any.required': 'Review is required'
            })
    }).required()
});


/* -----------------------------------------------------
   USER REGISTRATION VALIDATION
------------------------------------------------------ */
module.exports.userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 30 characters',
            'any.required': 'Username is required'
        }),

    // Full email regex validation
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address (e.g., user@example.com)',
            'any.required': 'Email is required'
        }),

    // Strong password validation
    password: Joi.string()
        .min(8)
        .pattern(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one number, and one special character (@$!%*?&)',
            'any.required': 'Password is required'
        })
});
