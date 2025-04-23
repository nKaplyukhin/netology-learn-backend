const express = require("express");
const uploadFile = require("../middlewares/upload-book");
const fs = require("fs");
const { booksFilePath } = require("../common");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const COUNTER_APP_URL = process.env.COUNTER_APP_URL || "http://counter:5001"
const router = express.Router();
const Book = require("../schemas/book-schema")

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().select(
      "-__v"
    )
    res.json(books);

  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const newBook = await Book.findById(id).select("-__v")

    if (!newBook) {
      res.status(404).json("Не найдена");
    }

    res.status(201);
    res.json(newBook);
  } catch (error) {
    res.status(404).json("Не найдена");
  }
});

router.post("/", async (req, res) => {
  const params = req.body;

  const newBook = new Book(params);

  try {
    console.log(params);
    await newBook.save()
    res.status(201);
    res.json(newBook);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const params = req.body;

  try {
    const newBook = await Book.findByIdAndUpdate(id, params);

    res.status(201);
    res.json(newBook);
  } catch (error) {
    res.status(404).json("Не найдена");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Book.deleteOne({ _id: id });

    res.status(201);
    res.json("ok");
  } catch (error) {
    console.log(error);

    res.status(404).json("Не найдена");
  }
});


module.exports = {
  bookRouter: router,
};
