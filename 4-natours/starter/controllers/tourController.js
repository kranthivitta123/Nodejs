const fs = require('fs');
const Tour = require('./../models/tourModel');

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
        const queryObj = { ...req.query };
        console.log(queryObj);
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        let query = Tour.find(JSON.parse(queryStr));
        //sorting

        //http://localhost:3000/api/v1/tours?sort=price Default asc
        //http://localhost:3000/api/v1/tours?sort=-price Desc
        if (req.query.sort) {
            //only one field sorting if value equal mention other field
            // query = query.sort(req.query.sort); 
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy);
            //http://localhost:3000/api/v1/tours?sort=-price,-duration
        }
        else {
            query = query.sort('duration')
        }
        //fields limiting 

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        }
        else {
            query = query.select('-__v')
        }

        //pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        query = query.skip((page - 1) * limit).limit(limit);

        if (req.query.page) {
            const count = await Tour.countDocuments();
            console.log(count)
            if ((page - 1) * limit >= count) throw new Error('Page does not exist');
        }
        const tours = await query;
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