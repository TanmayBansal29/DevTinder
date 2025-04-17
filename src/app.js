const express = require("express");
const connectDB = require("./config/database")

const app = express();
const PORT = 3000;

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

