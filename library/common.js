module.exports = {
  booksFilePath: "public/books",
  isNotDefined: (res) => {
    res.status(404);
    res.render("error", { title: "Ошибка" });
  }
};
