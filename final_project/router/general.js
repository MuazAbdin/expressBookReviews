const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  }

  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => res.send(JSON.stringify(books, null, 4)) );

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  books[ISBN] ? res.send(books[ISBN])
              : res.send(`There is no book with ISBN: ${ISBN}`);
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  for (key in books) {
    if (books[key].author === author) {
      res.send(books[key]);
      return;
    }
  }
  res.send(`No books for ( ${author} )`);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  for (key in books) {
    if (books[key].title === title) {
      res.send(books[key]);
      return;
    }
  }
  res.send(`No books with the title ( ${title} )`);
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  books[ISBN] ? res.send(books[ISBN].reviews)
              : res.send(`There is no book with ISBN: ${ISBN}`);
});

module.exports.general = public_users;
