const express = require("express");
const uploadFile = require("../middlewares/upload-book");
const { isNotDefined } = require("../common");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
const Book = require("../schemas/book-schema")

const COUNTER_APP_URL = process.env.COUNTER_APP_URL || "http://counter:5001"

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().select(
      "-__v"
    )
    res.render('index', { title: 'Главная', books });
  } catch (error) {
    console.log(error);
  }
});

router.get("/info/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const newBook = await Book.findById(id).select("-__v")

    if (!newBook) {
      isNotDefined(res)
      return
    }

    await axios.post(`${COUNTER_APP_URL}/counter/${id}/incr`);

    const response = await axios.get(`${COUNTER_APP_URL}/counter/${id}`);
    const { count } = response.data;

    res.render("book-view", { title: newBook.title, book: newBook, count });
  } catch (err) {

    console.log(err);
    res.status(500).send('Произошла ошибка');
  }

});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const newBook = await Book.findById(id).select("-__v")

    if (!newBook) {
      isNotDefined(res)
      return
    }
    res.render("book-edit", { title: 'Редактирование', book: newBook });
  } catch (error) {
    isNotDefined(res)
  }
});

router.post("/edit/:id", async (req, res) => {
  const params = req.body;
  const { id } = req.params;

  try {
    const newBook = await Book.findByIdAndUpdate(id, params);
    res.status(201);
    res.redirect(`/books/info/${newBook._id}`)
  } catch (error) {
    isNotDefined(res)
  }


});

// router.get("/:id/download", (req, res) => {
//   const { id } = req.params;
//   const { books } = stor;

//   const book = books.find((item) => item.id === id);

//   if (!book) {
//     res.status(404).render("error", { title: "Ошибка" });
//     return
//   }

//   const { fileName } = book;

//   res.download(booksFilePath + "/" + fileName, fileName, (err) => {
//     if (err) {
//       res.status(404).json(err);
//     }
//   });
// });

router.post("/create", async (req, res) => {
  const params = req.body;

  try {
    const newBook = new Book(params);

    res.status(201);
    await newBook.save()
    res.redirect("/books")
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/create", (req, res) => {
  res.render('book-create', { title: 'Главная', book: {} });
});

// router.post("/upload", uploadFile.single("book"), (req, res) => {

//   if (req.file) {
//     const { filename, path, } = req.file;

//     const buffer = fs.readFileSync(path);

//     if (buffer) {
//       const bookData = JSON.parse(buffer);
//       const newBook = new Book({ ...bookData, fileName: filename, fileBook: path });

//       stor.books.push(newBook);

//       res.status(201).redirect("/books");
//       return;
//     }
//   }
//   res.status(404).render("error", { title: "Ошибка" });
// });

router.get("/upload", uploadFile.single("book"), (req, res) => {

  res.render('book-upload', { title: 'Главная', book: {} });
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Book.deleteOne({ _id: id });
    res.redirect("/books")
  } catch (error) {
    isNotDefined(res)
  }
});

module.exports = {
  bookRouter: router,
};