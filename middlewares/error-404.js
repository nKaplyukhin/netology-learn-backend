const isNotDefined = (req, res) => {
  res.status(404);
  res.render("error", {title: "Ошибка"});
};

module.exports = isNotDefined;
