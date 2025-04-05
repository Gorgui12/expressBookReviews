const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Vérifie si un nom d'utilisateur est valide
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Vérifie les identifiants de connexion
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Tâche 7: Connexion d'un utilisateur
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Identifiants requis" });

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    req.session.authorization = { token, username };
    return res.status(200).json({ message: "Connexion réussie", token });
  }
  return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe invalide" });
});

// Tâche 8: Ajouter ou modifier une critique
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!books[isbn]) return res.status(404).json({ message: "Livre introuvable" });

  if (!review) return res.status(400).json({ message: "Critique manquante" });

  if (!books[isbn].reviews) books[isbn].reviews = {};
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Critique ajoutée ou mise à jour" });
});

// Tâche 9: Supprimer une critique
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Critique supprimée avec succès" });
  }

  return res.status(404).json({ message: "Critique non trouvée pour cet utilisateur" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
