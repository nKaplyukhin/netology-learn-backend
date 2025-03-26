const express = require("express");
const uploadFile = require("../middlewares/upload-book");
const fs = require("fs");
const { booksFilePath } = require("../common");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

class Book {
  constructor({
    id = uuidv4(),
    title = "",
    descriptrion = "",
    authors = "",
    favorite = false,
    fileCover = "",
    fileName = "",
    fileBook = "",
  }) {
    this.id = id;
    this.title = title;
    this.descriptrion = descriptrion;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

const stor = {
  books: [
    new Book({
      title: "book1",
      fileName: "1742101789791-book.json",
      favorite: true
    }),
    new Book({
      title: "book2",
    }),
  ],
};

router.get("/", (req, res) => {
  const { books } = stor;

  res.render('index', { title: 'Главная', books });
});

router.get("/info/:id", (req, res) => {
  const { books } = stor;
  const { id } = req.params;

  const book = books.find((item) => item.id === id);

  if (!book) {
    res.status(404).render("error", { title: "Ошибка" });
    return
  }

  res.render("book-view", { title: book.title, book });
});


router.get("/edit/:id", (req, res) => {
  const { books } = stor;
  const { id } = req.params;

  const book = books.find((item) => item.id === id);

  if (!book) {
    res.status(404).render("error", { title: "Ошибка" });
    return
  }

  res.render("book-edit", { title: 'Редактирование', book });
});

router.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { books } = stor;
  const params = req.body;

  const idx = books.findIndex((item) => item.id === id);

  if (idx === -1) {
    res.status(404).render("error", { title: "Ошибка" });
    return
  }

  books[idx] = { ...books[idx], ...params, favorite: !!params.favorite || false };

  res.status(201);
  res.redirect(`/books/info/${books[idx].id}`)
});

router.get("/:id/download", (req, res) => {
  const { id } = req.params;
  const { books } = stor;

  const book = books.find((item) => item.id === id);

  if (!book) {
    res.status(404).render("error", { title: "Ошибка" });
    return
  }

  const { fileName } = book;

  res.download(booksFilePath + "/" + fileName, fileName, (err) => {
    if (err) {
      res.status(404).json(err);
    }
  });
});

router.post("/create", (req, res) => {
  const params = req.body;
  const newBook = new Book({ ...params, favorite: !!params.favorite || false });

  res.status(201);
  stor.books.push(newBook);
  res.redirect("/books")
});

router.get("/create", (req, res) => {
  res.render('book-create', { title: 'Главная', book: {} });
});

router.post("/upload", uploadFile.single("book"), (req, res) => {

  if (req.file) {
    const { filename, path, } = req.file;

    const buffer = fs.readFileSync(path);

    if (buffer) {
      const bookData = JSON.parse(buffer);
      const newBook = new Book({ ...bookData, fileName: filename, fileBook: path });

      stor.books.push(newBook);

      res.status(201).redirect("/books");
      return;
    }
  }
  res.status(404).render("error", { title: "Ошибка" });
});

router.get("/upload", uploadFile.single("book"), (req, res) => {

  res.render('book-upload', { title: 'Главная', book: {} });
});

router.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const { books } = stor;

  const idx = books.findIndex((item) => item.id === id);

  if (idx === -1) {
    res.status(404).render("error", { title: "Ошибка" });
    return
  }

  books.splice(idx, 1);

  res.redirect("/books")
});

module.exports = {
  bookRouter: router,
};
