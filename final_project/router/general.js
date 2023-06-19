const express = require('express');
const axios = require('axios').default;
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

/* TASK 10 - Get the book list available in the shop asynchronously */
public_users.get('/books', (req, res) => {
	const get_books = new Promise( (resolve, reject) => {
			resolve(res.send(JSON.stringify(books, null, 4)));
	});
	get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  books[ISBN] ? res.send(books[ISBN])
              : res.send(`There is no book with ISBN: ${ISBN}`);
});

/* TASK 11 - Get the book details based on ISBN asynchronously */
public_users.get('/books/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  const get_books_isbn = new Promise((resolve, reject) => {
    books[ISBN] ? resolve(res.send(books[ISBN]))
                : reject(res.send(`There is no book with ISBN: ${ISBN}`));
  });
  get_books_isbn.then( () => console.log("Promise is resolved") )
                .catch( () => console.log(`There is no book with ISBN: ${ISBN}`) );
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

/* TASK 12 - Get the book details based on Author asynchronously */
public_users.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const get_books_author = new Promise((resolve, reject) => {
    let booksByAuthor = [];
    for (isbn in books) {
        if (books[isbn]["author"] === author) {
            booksByAuthor.push({...books[isbn]});
        }
    }
    (booksByAuthor.length > 0) ? resolve(res.send(JSON.stringify({booksByAuthor}, null, 4)))
                                : reject(res.send(`There is no books for: ${author}`));
  });
  get_books_author.then( () => console.log("Promise is resolved") )
                  .catch( () => console.log(`There is no books for: ${author}`) );
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

/* TASK 13 - Get the book details based on Title asynchronously */
public_users.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const get_books_title = new Promise((resolve, reject) => {
    for (isbn in books) {
        if (books[isbn]["title"] === title) {
            resolve(res.send(JSON.stringify(books[isbn], null, 4)))
        }
    }
    reject(res.send(`There is no books with title: ${title}`));
  });
  get_books_title.then( () => console.log("Promise is resolved") )
                  .catch( () => console.log(`There is no books with title: ${title}`) );
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  books[ISBN] ? res.send(books[ISBN].reviews)
              : res.send(`There is no book with ISBN: ${ISBN}`);
});

module.exports.general = public_users;
