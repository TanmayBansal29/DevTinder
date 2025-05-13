const express = require("express")
const { validateSignUpData, validateLoginData } = require("../utils/validation")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

// Signup API - POST /signup
// API for helping user registering into the database
router.post("/signup", async (req,res) => {
    try {
        // Firstly -> Validation of data
        validateSignUpData(req)

        // Encrypt the password
        const {firstName, lastName, emailId, password} = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)

        // Creating a new instance of user model
        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        })
        await user.save();
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error Saving the User: " + err.message)
    }
})


// Login API - POST /login
// API for login into the application after regsitering
router.post("/login", async (req, res) => {
    try{
        validateLoginData(req)
        const {emailId, password} = req.body
        const user = await User.findOne({emailId: emailId})
        if(!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(isPasswordValid) {
            // Create a JWT Token
            const token = await jwt.sign({_id:user._id}, "DEV@Tinder098",{expiresIn: "5h"})
            // Add the token to cookie and send the response back to user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send("Login Successful!!")
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch (err) {
        res.status(400).send("Error Saving the User: " + err.message)
    }
})

// Logout API - POST /logout
// API for logout from the application
router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successfully");
})

module.exports = router