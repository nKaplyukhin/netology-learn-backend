const { v4: uuidv4 } = require("uuid");
const express = require("express");

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

class Book {
  constructor({
    id = uuidv4(),
    title = "",
    descriptrion = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
  }) {
    this.id = id;
    this.title = title;
    this.descriptrion = descriptrion;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
}

const stor = {
  users: [
    {
      login: "test",
      password: "test",
    },
  ],
  books: [
    new Book({
      title: "book1",
    }),
    new Book({
      title: "book2",
    }),
  ],
};

const isNotDefined = (res, message = "Не найдено") => {
  res.status(404);
  res.json(message);
};

app.post("/api/user/login", (req, res) => {
  const { login, password } = req.body;
  const { users } = stor;

  const findedUserIdx = users.findIndex(
    (item) => item.login === login && item.password === password
  );

  if (findedUserIdx === -1) {
    return isNotDefined(res, "Пользователь не найден");
  }

  res.status(201);
  res.json({
    id: 1,
    mail: "test@mail.ru",
  });
});

app.get("/api/books", (req, res) => {
  const { books } = stor;

  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const { books } = stor;
  const { id } = req.params;

  const book = books.find((item) => item.id === id);

  if (!book) {
    return isNotDefined(res, "404 | Книга не найдена");
  }

  res.json(book);
});

app.post("/api/books", (req, res) => {
  const params = req.body;
  const newBook = new Book(params);

  res.status(201);
  stor.books.push(newBook);
  res.json(newBook);
});

app.put("/api/books/:id", (req, res) => {
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

app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { books } = stor;

  const idx = books.findIndex((item) => item.id === id);

  if (idx === -1) {
    return isNotDefined(res, "404 | Книга не найдена");
  }

  books.splice(idx, 1);

  res.json("ok");
});

app.listen(port, () => {
  console.log(`Server start on ${port} port`);
});
