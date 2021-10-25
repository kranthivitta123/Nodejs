const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour name is required'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour length should be less than 40 char'],
        minLength: [10, 'A tour length should not be less than 10 char'],
        validate: [ validator.isAlpha , 'Validator should not be alpha numberic' ]
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have max group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty should be either easy,medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'Rating must be above 5.0'],
        min: [1, 'Rating must be above 1.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current document
                return val < this.price;
            },
            message: 'Discount ({VALUE}) should be less than price'
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have image cover']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

//Document Middleware only for save() and create() befor saving to db,
//this points to current doc
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

//after saving to db
tourSchema.post('save', function (doc, next) {
    // console.log(doc);
    next();
})

//Query Middleware this points to current mongoose query
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    next();
})

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;