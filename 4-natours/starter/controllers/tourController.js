const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkBody = (req , res , next) => {
    if(!req.body.name) {
      return  res.status(404).json({
            status:"Name not found"
        })
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        message: "success",
        count: tours.length,
        requestedAt:req.requestedTime,
        data: tours
    })
}

exports.getTour = (req, res) => {
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

exports.addTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: "UPdated Successfully"
    })
}

exports.deleteTour =  (req, res) => {
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