const express = require("express")
const { userAuth } = require("../middlewares/auth")
const router = express.Router()

router.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user
    console.log("Sending a Connection Request")

    res.send(user.firstName + " Sent Connection Request!!")
})

module.exports = router