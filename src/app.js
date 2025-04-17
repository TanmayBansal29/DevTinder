const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 3000;

app.get("/getUserData", (req, res) => {
    try{
        throw new Error("Random Error")
        res.send("User Data sent")  
    }
    catch (err) {
        res.status(500).send("Some Error Contact Support Team")
    }
})

app.use("/" ,(err, req, res, next) => {
    if(err) {
        res.status(500).send("Something Went Wrong")
    }
})

app.listen(PORT, () => {
    console.log(`Server Started on Port: ${PORT}`);
});