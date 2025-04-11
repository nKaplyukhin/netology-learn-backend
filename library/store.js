const { Book } = require("./book");

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
            fileBook: "1742101789791-book.json",
        }),
        new Book({
            title: "book2",
        }),
    ],
};


module.exports = {
    stor
}