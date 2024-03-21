const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validuser= users.filter((user)=> user.username===username);
    return (validuser!=0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validuser= users.filter((user)=> user.username===username&&user.password===password);
    return (validuser!=0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({user:username,data:password},'secret',{expiresIn:60*60});
    req.session.authorization={accessToken,username};
    return res.send("success to login");
  }
    return res.send("fail to login");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const newreview = req.query.review;
    delete books[isbn]["reviews"][username];
    let text = "{\""+username +"\":"+newreview+"}";
    if (JSON.stringify(books[isbn]["reviews"])!="{}"){
        text=text+JSON.stringify(books[isbn]["reviews"])
    }
    books[isbn]["reviews"]=JSON.parse(text);

    res.send("success to review \n new book content:\n"+JSON.stringify(books[isbn]));
    }

);

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const username = req.session.authorization.username;
    delete books[isbn]["reviews"][username];
    res.send("success to delete");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
