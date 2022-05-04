const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const { body, param, validationResult } = require('express-validator');
const SECRET = "RESTAPI";

router.use(bodyParser.urlencoded({extended:true}));

router.use(bodyParser.json());

// Get route to fetch the data
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json({
        users
    });
}); 

router.post("/register", body("username"), body("name"), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {name, username,email, password} = req.body;
        bcrypt.hash(password, 10, async function(err, hash) {
            // Store hash in your password DB.
            if(err){
                res.status(400).json({
                    status: "failed",
                    message: "Invalid details"
                })
            }
            const user = await User.create(
                {
                    name, 
                    username, 
                    email,
                    password:hash
                }
            );
            res.json({
                status: "success",
                user
            })
        });
       
    } catch (e) {
        res.json({
            status: "failed",
            message: e.message
        })
    }
})
// 
router.post("/login", body("username"), body("password"), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            res.status(401).json({
                status:"failed",
                message:"Invalid user"
            })
        }
        // Load hash from your password DB.
        bcrypt.compare(password, user.password).then(function(result) {
            if(result){
                var token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                  }, SECRET);
                res.json({
                    status: "sucess",
                    token
                })
            }else{
                res.status(401).json({
                    status: "failed",
                    message: "Not Authenticated"
                })
            }
        });
       
    } catch (e) {
        res.json({
            status: "failed",
            message: e.message
        })
    }
})


// PUT route-- update data
router.put("/update/:id", param("id").isMongoId(), async (req, res) => {
    try{
        await User.updateOne({_id: req.params.id}, req.body);
        return res.json({
             status: "Success",
            // data : user
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            status: "failed",
            message: e.message
        });
    }
});
// for wrong API or wrong url
router.get("*", async (req, res) => {
    res.status(404).json({
        status: "failed",
        message: "API NOT FOUND"
    });
})

module.exports = router;