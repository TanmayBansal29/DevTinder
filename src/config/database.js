const mongoose = require("mongoose")

// Creating a async function for connecting to the database
// This returns a promise
const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://bansaltanmay554:brmo0YPI7l5YxEcf@cluster0.p8ct9dj.mongodb.net/devTinder"
    )
}

module.exports = connectDB
