const { v4: uuidv4 } = require("uuid");
const express = require("express");
const uploadFile = require("../middlewares/upload-book");
const fs = require("fs");
const { booksFilePath, isNotDefined } = require("../common");

const router = express.Router();

class Book {
  constructor({
    id = uuidv4(),
    title = "",
    descriptrion = "",
    authors = "",
    favorite = "",
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
      fileBook: "1742101789791-book.json",
    }),
    new Book({
      title: "book2",
    }),
  ],
};

router.get("/", (req, res) => {
  const { books } = stor;

  res.json(books);
});

router.get("/:id", (req, res) => {
  const { books } = stor;
  const { id } = req.params;

  const book = books.find((item) => item.id === id);

  if (!book) {
    return isNotDefined(res, "404 | Книга не найдена");
  }

  res.json(book);
});

router.get("/:id/download", (req, res) => {
  const { id } = req.params;
  const { books } = stor;

  const book = books.find((item) => item.id === id);
  console.log(id, book);

  if (!book) {
    return isNotDefined(res, "404 | Книга не найдена");
  }

  const { fileBook } = book;

  res.download(booksFilePath + "/" + fileBook, fileBook, (err) => {
    if (err) {
      res.status(404).json(err);
    }
  });
});

router.post("/", (req, res) => {
  const params = req.body;
  const newBook = new Book(params);

  res.status(201);
  stor.books.push(newBook);
  res.json(newBook);
});

router.post("/upload-book", uploadFile.single("book"), (req, res) => {
  if (req.file) {
    const { filename, path } = req.file;

    const buffer = fs.readFileSync(path);

    if (buffer) {
      const bookData = JSON.parse(buffer);
      const newBook = new Book({ ...bookData, fileBook: filename });

      stor.books.push(newBook);

      res.status(201).json(newBook);
      return;
    }
  }
  res.status(404).json("Произошла ошибка");
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { books } = stor;
  const params = req.body;

  const idx = books.findIndex((item) => item.id === id);

  if (idx === -1) {
    return isNotDefined(res, "404 | Книга не найдена");
  }

  books[idx] = { ...books[idx], ...params };

  res.json(books[idx]);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { books } = stor;

  const idx = books.findIndex((item) => item.id === id);

  if (idx === -1) {
    return isNotDefined(res, "404 | Книга не найдена");
  }

  books.splice(idx, 1);

  res.json("ok");
});

module.exports = {
  bookRouter: router,
};
