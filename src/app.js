const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const app = express();
const PORT = 3000;

app.use(express.json()) // Middleware to convert the JSON to JS Object that can be stored in DB

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

// Get User by email
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId

    try {
        const users = await User.findOne({emailId:userEmail})
        //const users = await User.find({emailId: userEmail})
        if(users.length === 0) {
            res.status(404).send("User Not Found")
        } else {
            res.send(users)
        }
    } catch (err) {
        res.status(400).send("Something Went Wrong")
    }
})

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(400).send("Something Went Wrong")
    }
})

// Delete API - DELETE /user - Delete a particular user from database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User Deleted Sucessfully")
    } catch (err) {
        res.status(400).send("Something Went Wrong")
    }
})

// Update API - Update /user - Update the data using ID in database
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body

    try {
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed) {
            throw new Error("Update Not Allowed")
        }
        if(data.skills.length > 10) {
            throw new Error("Add only 10 Skills")
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            runValidators: "true"
        })
        res.send("User Updated Successfully")
    } catch (err) {
        res.status(400).send("UPDATE FAILED: " + err.message)
    }
})

// // Update API - Update /userEmail - Update the data using email ID in database
// app.patch("/userEmail", async (req, res) => {
//     const userEmail = req.body.emailId
//     const data = req.body
//     try {
//         const user = await User.findOneAndUpdate({emailId: userEmail}, data)
//         res.send("User Updated Successfully")
//     } catch (err) {
//         res.status(400).send("Something Went Wrong")
//     }
// })

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

