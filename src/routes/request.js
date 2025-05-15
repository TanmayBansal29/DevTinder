const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connection")
const User = require("../models/user")
const router = express.Router()

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        // If status is ignored or interested for this API or some other
        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status Type: " + status
            })
        }

        // If user exists in Database or not
        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({
                message: "User Not Found!"
            })
        }

        // If there is an existing ConnectionRequest
        const exisitingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(exisitingConnectionRequest) {
            return res.status(400).json({
                message : "Connection Request Already Sent"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        return res.status(200).json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })

    } catch (err) {
        return res.status(400).json({
            message: "Error Occured",
            error: err
        })
    }
})

router.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user
        const allowedStatus = ["accepted", "rejected"]
        const status = req.params.status
        const requestId = req.params.requestId

        // If status is allowed or rejected for this API or some other
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid Status type: " + status
            })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest) {
            return res.status(404).json({
                message : "Connection Request Not Found"
            })
        }

        connectionRequest.status = status;
        await connectionRequest.save()
        return res.status(200).json({
            message: "Connection Request Accepted",
            connectionRequest
        })

    } catch (err) {
        return res.status(400).json({
            message: "Error Occured",
            error: err
        })
    }
})

module.exports = router