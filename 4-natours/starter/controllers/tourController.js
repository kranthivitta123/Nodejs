const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIfeatures = require('../utils/apiFeatures')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkBody = (req, res, next) => {
    if (!req.body.name) {
        return res.status(404).json({
            status: "Name not found"
        })
    }
    next();
}

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = "-ratingsAverage,price",
        req.query.fields = "name,price,ratingsAverage",
        next();
}



exports.getAllTours = async (req, res) => {
    try {
        const features = new APIfeatures(Tour.find(), req.query).filter().sort().limitfields().paginate();
        //http://localhost:3000/api/v1/tours?sort=price Default asc
        //http://localhost:3000/api/v1/tours?sort=-price Desc

        // if (req.query.page) {
        //     const count = await Tour.countDocuments();
        //     console.log(count)
        //     if ((page - 1) * limit >= count) throw new Error('Page does not exist');
        // }
        const tours = await features.query;
        res.status(200).json({
            message: "success",
            count: tours.length,
            data: tours
        })
    } catch (err) {
        res.status(400).json({
            message: "error"
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const id = req.params.id;
        const tour = await Tour.findById(id);
        res.status(200).json({
            status: "success",
            data: tour
        })
    } catch (err) {
        res.status(400).json({
            message: "error"
        })
    }
}

exports.addTour = async (req, res) => {
    try {
        const tour = new Tour(req.body);
        const newTour = await tour.save();
        res.status(200).json({
            message: "success",
            data: newTour
        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "updated successfully",
            data: tour
        })
    }
    catch (err) {
        res.status(400).json({
            error: "fail",
        })
    }

}

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "deleted successfully"
        })
    }
    catch (err) {
        res.status(400).json({
            error: "fail"
        })
    }
}

exports.getAllTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: "$difficulty",
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRatings: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            } ,
            {
                $sort : { avgPrice : 1 }
            }
        ])

        res.status(200).json({
            status: "Fetched successfully",
            data: stats
        })
    }
    catch (err) {
        res.status(400).json({
            error: "fail"
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1 ;

        const stats = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates:
                    {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month :  "$startDates" },
                    numToursStats: { $sum: 1 },
                    tours : { $push : '$name' } 
                }
            } ,
            {
                $addFields : { month : '$_id'}
            } ,
            {
                $project : { _id : 0}
            }
        ])

        res.status(200).json({
            status: "Fetched successfully",
            data: stats
        })
    }
    catch (err) {
        res.status(400).json({
            error: "fail"
        })
    }
}