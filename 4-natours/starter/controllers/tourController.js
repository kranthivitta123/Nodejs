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

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            message: "success",
            count:tours.length,
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
        const tour = await Tour.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators:true
        })
        res.status(200).json({
            status: "updated successfully",
            data: tour
        })
    }
    catch(err) {
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
    catch(err) {
        res.status(400).json({
            error: "fail"
        })
    }
}