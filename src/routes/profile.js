const express = require('express')
const { userAuth } = require('../middlewares/auth')
const { validateEditProfileData } = require('../utils/validation')
const router = express.Router()
const bcrypt = require("bcrypt")

router.get("/profile/view", userAuth, async (req, res) => {
    try{
       const user = req.user
       res.send(user)
    } catch (err) {
        res.status(400).send("Something Went Wrong")
    }
})

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).send("Invalid Edit Request")
        }
        const user = req.user
        
        Object.keys(req.body).forEach((key) => user[key] = req.body[key])
        await user.save();
        res.status(200).json({
            message: `${user.firstName}, Your Profile updated Successfully`,
            data: user
        })
        console.log("Logged In User: ", user)
    } catch (error) {
        return res.status(400).send("Error: ", error.message)
    }
})

router.patch("/profile/password", userAuth, async (req, res) =>{
    try {
        const {password, newPassword, confirmNewPassword} = req.body
        const user = req.user
        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).json({
                message: "Please enter correct old password"
            })
        }
        if(newPassword != confirmNewPassword) {
            return res.status(400).json({
                message: "Password and Confirm Password are not same. Please check"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save();

        res.status(200).json({
            message: "Password Updated Successfully"
        })

    } catch (error) {
        return res.status(400).send("Error: ", error.message)
    }
})

module.exports = router