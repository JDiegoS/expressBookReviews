const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred"});
      } else {
        return res.status(404).json({message: "User already exists"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

let getBookPromise = new Promise((resolve,reject) => {
    resolve({message: JSON.stringify(books)})
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBookPromise.then((bookList) => {
        return res.status(200).json(bookList);
      })
  
});

var getBookByISBNPromise = function(isbn){ 
    return new Promise((resolve,reject) => {
        resolve({message: books[isbn]})
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getBookByISBNPromise(req.params.isbn).then((bookList) => {
    return res.status(200).json({message: bookList});
  })
 });
  

var getBookByAuthorPromise = function(author){ 
    return new Promise((resolve,reject) => {
        var result = [];
        for(i in books){
            if (books[i]['author'] == author){
                result.push(books[i])
            }
        }
        resolve({message: result})
    })
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    getBookByAuthorPromise(req.params.author).then((bookList) => {
        return res.status(200).json({message: bookList});
      })
});

var getBookByTitlePromise = function(title){ 
    return new Promise((resolve,reject) => {
        var result = [];
        for(i in books){
            if (books[i]['title'] == title){
                result.push(books[i])
            }
        }
        resolve({message: result})
    })
}


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    getBookByTitlePromise(req.params.title).then((bookList) => {
    return res.status(200).json({message: bookList});
  })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).json({message: books[req.params.isbn]['reviews'] });
});

module.exports.general = public_users;
