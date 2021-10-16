const express = require('express');
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message:"Router Not implemented"
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message:"Router Not implemented"
    })
}

const addUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message:"Router Not implemented"
    })
   
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message:"Router Not implemented"
    })
}

const deleteUser =  (req, res) => {
    res.status(500).json({
        status: "error",
        message:"Router Not implemented"
    })
    
}
const router = express.Router();
router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;