const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tâche 6: Enregistrement d'un nouvel utilisateur
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Tâche 1: Obtenir tous les livres
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 4));
});

// Tâche 2: Détails d’un livre via ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Tâche 3: Détails des livres par auteur
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Tâche 4: Détails des livres par titre
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  for (let key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Tâche 5: Critiques du livre par ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

// -----------------------------
// Tâches 10 à 13 : Promesses
// -----------------------------

// Tâche 10 : Obtenir tous les livres via promesse
public_users.get('/promise/books', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };
    const result = await getBooks();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// Tâche 11 : Obtenir un livre par ISBN via promesse
public_users.get('/promise/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const getBook = () => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };
    const result = await getBook();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Tâche 12 : Obtenir livres par auteur via promesse
public_users.get('/promise/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = [];
        for (let key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject("No books found by this author");
        }
      });
    };
    const result = await getBooksByAuthor();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Tâche 13 : Obtenir livres par titre via promesse
public_users.get('/promise/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const booksByTitle = [];
        for (let key in books) {
          if (books[key].title === title) {
            booksByTitle.push(books[key]);
          }
        }
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject("No books found with this title");
        }
      });
    };
    const result = await getBooksByTitle();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;

