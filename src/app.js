const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middlewares/auth")

const app = express();
const PORT = 3000;

app.use(express.json()) // Middleware to convert the JSON to JS Object that can be stored in DB
app.use(cookieParser())

// Creating a New User into the database
app.post("/signup", async (req,res) => {
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
app.post("/login", async (req, res) => {
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
            const token = await jwt.sign({_id:user._id}, "DEV@Tinder098",{expiresIn: "60s"})
            // Add the token to cookie and send the response back to user
            res.cookie("token", token)
            res.send("Login Successful!!")
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch (err) {
        res.status(400).send("Error Saving the User: " + err.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try{
       const user = req.user
       res.send(user)
    } catch (err) {
        res.status(400).send("Something Went Wrong")
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user
    console.log("Sending a Connection Request")

    res.send(user.firstName + " Sent Connection Request!!")
})

// Resolving the promise returned using try catch
connectDB().then(() => {
    console.log("Database Connection Established")
    // Started the server after connecting to the database
    app.listen(PORT, () => {
        console.log(`Server Started on Port: ${PORT}`);
    });
})
.catch((err) => {
    console.log("Database cannot be connected", err)
})

