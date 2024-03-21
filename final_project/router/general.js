const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
    if (isValid(username)){
        return res.send("user already existed");
    }
    else{
        users.push({"username":username,"password":password});
        return res.send("success,now you can login with :"+username);
    }
  }
  return res.send("fail");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let apromise = new Promise((resolve,reject)=>{
    res.send(books);
  })
  apromise.then((message)=>{
    console.log("finish, get book list");
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let apromise = new Promise((resolve,reject)=>{
  const isbn = req.params.isbn;
    if(isbn){
        return res.send(books[isbn]);
    }
    return res.status(404).json({message: "cannt find"});
   });
   apromise.then(()=>{
    console.log("finish, get book with isbn");
   })
  });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let apromise = new Promise((resolve,reject)=>{
  const author = req.params.author;
  if(author){
    let i=1;
    while(books[i]!=undefined){
        if (books[i]["author"]===author){
            return res.send(books[i]);
        }
        i++;
    };
    return res.status(404).json({message: "cannt find"});
  }
});
 apromise.then(()=>{
    console.log("finish, get book with auther");

 })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let apromise = new promise((resolve,reject)=>{

    const title = req.params.title;
  if(title){
    let i=1;
    while(books[i]!=undefined){
        if (books[i]["title"]===title){
            return res.send(books[i]);
        }
        i++;
    };
    if(books[i]===undefined){
        return res.status(404).json({message: "cannt find"});
    }
  }
});
apromise.then(()=>{
    console.log("finish, get book with title");
 })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.send(books[req.params.isbn]["reviews"]);
});

module.exports.general = public_users;
