const express = require("express");
const mongoose = require("mongoose");
const { bookRouter } = require("./routes/book");
const error404 = require("./middlewares/error-404");
const { isNotDefined } = require("./common");

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/books "

app.use(express.json());

const stor = {
  users: [
    {
      login: "test",
      password: "test",
    },
  ],
};

app.use(express.urlencoded({ extended: true }));
app.use("/api/books", bookRouter);

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

app.use(error404);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    app.listen(port, () => {
      console.log(`Server start on ${port} port`);
    });
  } catch (error) {
    console.log(error);
  }
}

start()