const express = require("express");
const mongoose = require('mongoose');
const loginRoutes = require("./routes/login");

const SECRET = "RESTAPI";
var jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/test');
const app = express();

// app.use("/update", (req, res, next) =>{
//     var token = req.headers.authorization.split("test ")[1];
//     if(!token){
//         return res.status(401).json({
//             status: "failed",
//             message: "Token is missing"
//         })
//     }
//     // verify the toke
//     jwt.verify(token, SECRET, async function(err, decoded) {
//         if(err){
//             return res.status(401).json({
//                 status:"failed",
//                 message: "Invalid token"
//             })
//         }
//         // req.user = decoded.data;
//         next();
//     });
// });
app.get('/',(req,res)=>{
    res.json("ok")
})

app.use("/", loginRoutes);



app.listen(5000, () => console.log("server is started"));