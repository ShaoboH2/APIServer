const express = require('express');
const User = require('../models/Users');
const router = express.Router();

// get all users
router.get('/', async (req, res) => {
    try {

        const users = await User.find();

        res.status(200).json({message: "OK", data: users});
    } catch (err) {
        console.log("users/get: " + err.message)
        res.status(500).json({ message: err.message });
    }

})
// ger one user
router.get('/:id', async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); 
        }
        res.status(200).json({message: 'OK', data: user});
    } catch(err) {
        res.status(500).json({ message: err.message });
    }

})
// Create one
router.post('/', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            CityList: req.body.CityList || [],
            preference: req.body.preference
        });


        if (!req.body.password) {
            throw new Error("Password is required");
        }

        user.setPassword(req.body.password);

        const newUser = await user.save();

        res.status(201).json({ message: 'OK', data: newUser });
    } catch(err) {
        console.error("Error details:", err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "Duplicate user" });
        }
        res.status(500).json({ message: err.message });
    }
});

module.exports = router