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

exports.getAllTours = (req, res) => {
    res.status(200).json({
        message: "success"
    })
}

exports.getTour = (req, res) => {
    const id = req.params.id;
    res.status(200).json({
        status: "success",
    })
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

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: "UPdated Successfully"
    })
}

exports.deleteTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: obj
    })
}