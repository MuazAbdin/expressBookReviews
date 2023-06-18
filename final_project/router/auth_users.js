const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.filter( user => user.username === username ).length == 0;
}

const authenticatedUser = (username, password) => {
  return users.filter( user => 
    (user.username === username && user.password === password)
  ).length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: password }, 'access', { expiresIn: 60 * 60 }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).send("Customer successfully logged in");

  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const userReview = req.query.review;
  const username = req.session.authorization.username;
  
  if (!books[ISBN]) { res.send(`There is no book with ISBN: ${ISBN}`); }
  else {
    books[ISBN]['reviews'][username] = userReview;
    let reviewsDetails = '';
    for (customer in books[ISBN]['reviews']) {
      reviewsDetails += `{ ${customer} says: ${books[ISBN]['reviews'][customer]} }\n`;
    }
    res.send(`The review for the book with ISBN ${ISBN} has been added/updated.
              REVIEWS are:
              ${reviewsDetails}`);
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization.username;
  
  if (!books[ISBN]) { res.send(`There is no book with ISBN: ${ISBN}`); }
  else {
    delete books[ISBN]['reviews'][username];
    let reviewsDetails = '';
    for (customer in books[ISBN]['reviews']) {
      reviewsDetails += `{ ${customer} says: ${books[ISBN]['reviews'][customer]} }\n`;
    }
    res.send(`The review of ${username} for the book with ISBN ${ISBN} has been deleted.
              REVIEWS are:
              ${reviewsDetails}`);
  }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
