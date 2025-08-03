const { Schema, model } = require("mongoose")

const bookSchema = new Schema({
    id: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean
    },
    fileCover: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileBook: {
        type: String,
    },
})

module.exports = model("book", bookSchema)