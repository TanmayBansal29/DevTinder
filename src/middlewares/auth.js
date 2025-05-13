const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies
        const {token} = cookies

        if(!token) {
            throw new Error ("Please Login Again")
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder098")
        const {_id} = decodedObj

        const user = await User.findById(_id)
        if(!user) {
            throw new Error ("User Not Found")
        } else {
            req.user = user
            next()
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
    
}

module.exports = { userAuth }