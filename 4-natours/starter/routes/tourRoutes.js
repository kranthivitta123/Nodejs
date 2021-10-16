const express = require('express');
const fs = require('fs');
const router = express.Router();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const getAllTours = (req, res) => {
    res.status(200).json({
        message: "success",
        count: tours.length,
        requestedAt:req.requestedTime,
        data: tours
    })
}

const getTour = (req, res) => {
    const id = req.params.id;
    const obj = tours.find(item => item.id == id);
    if (obj) {
        res.status(200).json({
            status: "success",
            data: obj
        })
    }
    else {
        res.status(204).json({
            message: "Not found"
        })
    }
}

const addTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), suc => {
        res.status(200).json({
            message: "success",
            data: newTour
        })
    })
}

const updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: "UPdated Successfully"
    })
}

const deleteTour =  (req, res) => {
    const id = req.params.id;
    const obj = tours.find(item => item.id == id);
    if (obj) {
        res.status(200).json({
            status: "success",
            data: obj
        })
    }
    else {
        res.status(204).json({
            message: "null"
        })
    }
}

router.route('/').get(getAllTours).post(addTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router;