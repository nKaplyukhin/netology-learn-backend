module.exports = {
  booksFilePath: "public/books",
  isNotDefined: (res, message = "Не найдено") => {
    res.status(404);
    res.json(message);
  }
};
