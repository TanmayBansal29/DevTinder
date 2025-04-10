const express = require("express")

const app = express()
const PORT = 3000

app.use("/hello", (req, res) => {
    res.send("Hello Hello Hello") // Request Handler Function
})

app.use("/test", (req, res) => {
    res.send("Hello from the server") // Request Handler Function
})

app.listen(PORT, () => {
    console.log(`Server Started on Port: ${PORT}`)
})