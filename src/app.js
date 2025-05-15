const express = require("express");
const connectDB = require("./config/database")
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

const app = express();
const PORT = 3000;

app.use(express.json()) // Middleware to convert the JSON to JS Object that can be stored in DB
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

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

