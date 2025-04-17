const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();
const PORT = 3000;

app.post("/signup", async (req,res) => {
    const userObj = {
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "virat.kohli@gmail.com",
        password: "virat@123"
    }

    // Creating a new instance of user model
    const user = new User(userObj)
    try {
        await user.save();
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error Saving the User: " + err.message)
    }
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

