const isNotDefined = (req, res) => {
  res.status(404);
  res.json("Не найдено");
};

module.exports = isNotDefined;
