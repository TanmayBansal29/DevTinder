const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 3000;

// Handle Auth Middleware for all request - GET, POST
app.use("/admin", adminAuth)
app.use("/user", userAuth)

app.get("/user", (req, res) => {
    res.send("User Data Sent")
})

app.get("/admin/getAllData", (req, res) => {
    res.send("All Data Send")
})

app.get("/admin/deleteUser", (req, res) => {
    res.send("Delete Complete Data")
})

app.listen(PORT, () => {
    console.log(`Server Started on Port: ${PORT}`);
});