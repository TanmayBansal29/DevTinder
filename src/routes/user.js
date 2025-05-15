const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connection");
const router = express.Router()

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]

// Get all the pending connection requests for the loggedIn User
router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_DATA)

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
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            } else {
                return row.fromUserId
            }
        });

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