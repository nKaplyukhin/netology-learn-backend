const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    id: {
        type: String,
    },
    login: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = model("user", userSchema)