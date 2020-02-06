const express = require("express");
const fs = require("fs");
require('dotenv').config()


app = express();
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.listen(3030,()=>{
    console.log("Server Started");
})
app.get("/",(req,res)=>{res.send("Welcome to Sample Api")})
app.use("/users",require('./routes/user'));

