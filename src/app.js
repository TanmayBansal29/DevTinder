const express = require("express")

const app = express()
const PORT = 3000

// app.use("/hello", (req, res) => {
//     res.send("Hello Hello Hello") // Request Handler Function
// })

// app.use("/test", (req, res) => {
//     res.send("Hello from the server") // Request Handler Function
// })

// app.use("/", (req, res) => {
//     res.send("Hnjiiii") // Request Handler Function
// })

// app.use("/user", (req,res) => {
//     res.send("Aa gye phir se maut ka tamasha dekhne")
// })

app.get("/user", (req, res) => {
    res.send({firstName: "Tanmay", lastName: "Bansal"})
})

app.post("/user", (req,res) => {
    res.send("Data Successfully saved to Database")
})

app.delete("/user", (req,res) => {
    res.send("Deleted Successfully")
})

app.put("/user", (req,res) => {
    res.send("Data Updated")
})

app.listen(PORT, () => {
    console.log(`Server Started on Port: ${PORT}`)
})