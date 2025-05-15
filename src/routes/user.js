const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const router = express.Router()

// Get all the pending connection requests for the loggedIn User
router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"])

        return res.status(200).json({
            message: "Conenction Requests Fetched Successfully",
            data: connectionRequests
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error Occurred", 
            error: err.message
        })
    }
})

// Get all the detail about connectiosn for loggedIn User
router.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ],
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"])

        const data = connectionRequests.map((row) => row.fromUserId);

        return res.status(200).json({
            message: "Connection Requests Found",
            data
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error Occured",
            error: err.message
        })
    }
})


module.exports = router