const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter your Full Name")
    }
    // else if(firstName.length<4 || firstName.length>50) {
    //     throw new Error("FirstName should be 4-50 characters")
    // }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please Use a Strong Password")
    }
}

const validateLoginData = (req) => {
    const {emailId} = req.body;
    if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"]
    const isEditAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field))

    return isEditAllowed
}

module.exports = {validateSignUpData, validateLoginData, validateEditProfileData}