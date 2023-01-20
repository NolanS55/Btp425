/*********************************************************************************
*  BTI425 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Nolan Smith Student ID: 101664217 Date: 23/01/20
*  Cyclic Link: https://calm-blue-colt-tutu.cyclic.app
*
********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var con = require('dotenv').config()
var app = express();
var cors = require('cors')
var fs = require('fs');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


app.use(cors())
app.use(express.json())

app.get("/", (req,res) => {
    res.json({message : "Home Page"})
})


app.post('/api/movies', (req,res) => {
    db.addNewMovie(req.body).then((data) => {res.json(data)}).catch(()=> {res.json({message : "Could not be added"})})
})

app.get('/api/movies/:_id', (req,res) => {
    db.getMovieById(req.params._id).then((data) => {res.json(data)}).catch((err) => res.json(err))
})

app.get('/api/movies/:page?/:perPage?/:title?', (req,res) => {
    if(req.query.page != null && req.query.perPage != null) {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {res.json(data)}).catch(() => {res.json({message: "No Movies Found"})})
    }
    else {
        res.json({message : "No Movies Found"})
    }  
})

app.put('/api/movies/:_id', (req,res) => {
    db.updateMovieById(req.body, req.params._id).then((data) => {res.json({message : data})
    }).catch(() => {res.json({message : "Movie not updated"})})
})

app.delete('/api/movies/:_id', (req, res) => {
    db.deleteMovieById(req.params._id).then((data) => {res.json({message : data})})
})

app.use((req, res, next) => {
    res.status(404).send("Page Not Found")
})

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
