const express = require("express");
const mongoose = require("mongoose");
const { bookRouter } = require("./routes/book");
const { userRouter } = require("./routes/user");
const error404 = require("./middlewares/error-404");
const { isNotDefined } = require("./common");

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/books "

app.use(express.json());
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));

app.use("/api/books", bookRouter);
app.use("/api/user", userRouter);

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