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
// get one user
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

});
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

// authentication
router.post('/authentication/:email/:password', async (req, res) => {
    const email = req.params.email;
    const password = req.params.password;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password not match" });
        }
        res.status(200).json({message: 'OK',
            data: {
                _id: user._id, 
                userName: user.email
            }
        });
    } catch (err) {
        res.status(500).json( {message: err.message });
    }
});
// patch for citylist or preference
router.patch('/:id', async (req, res) => {
    const userID = req.params.id;
    const updates = req.body;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the request includes a password, update it securely
        if (updates.password) {
            user.setPassword(updates.password);
        }


        

        // Update other fields if provided
        for (let key in updates) {
            if (key !== "password") {
                user[key] = updates[key];
            }
        }
        if (updates.addCity && !user.CityList.includes(updates.addCity)) {
            user.CityList.push(updates.addCity);
        }
        if (updates.removeCity) {
            user.CityList = user.CityList.filter(city => city !== updates.removeCity);
        }


        await user.save();
        res.status(200).json({ message: 'OK', data: user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router