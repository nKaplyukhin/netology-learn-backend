1- запрос(ы) для вставки данных минимум о двух книгах в коллекцию books,
    db.books.insertMany([{title: "books1", description: "description1", authors: "authors"}, {title: "books2", description: "description2", authors: "authors2"}])

2- запрос для поиска полей документов коллекции books по полю title,
    db.books.find({title: "books1"})

3-3 запрос для редактирования полей: description и authors коллекции books по \_id записи.
    db.books.updateOne({_id: ObjectId("6804b7f232522e1240d861e2")}, {$set: {description: "new description", authors: "new authors"}})
