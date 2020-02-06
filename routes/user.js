const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const verify = require("../verify").verify


router.get("/",(req,res)=>{
    verify(req.headers["headerauth"]).then((data)=>{
        if(data.usertype != "admin"){
            res.send([data]);
            return;
        }
        fs.readFile('users.json',(err,users)=>{
            if(err){
                res.status(404).send("Register First");
            }else{
                users = JSON.parse(users);
                users.forEach((user)=>{
                    delete user.password;
                })
                res.send(users);                
            }
        });
    }).catch((err)=>{
        res.status(err.code).send(err.message);
    })
});

router.post("/login",(req,res)=>{
    if(!req.body.username){
        res.status(400).send("username is required");
        return
    }else if(!req.body.password){
        res.status(400).send("password is required");
        return;
    }
    fs.readFile('users.json',(err,data)=>{
        let users = []
        if(!err){
            users = JSON.parse(data);
            u = users.find(item=> item.user==req.body.username)
            if(u){
                bcrypt.compare(req.body.password,u.password, function(matcherror, match) {
                    if(match){
                        payload = {user:u.user,usertype:u.usertype}
                        jwt.sign(payload,process.env.SECRET,{expiresIn:'1d'},(err,token)=>{
                            res.send([payload,{"token":token}]);
                        })
                    } else {
                      res.status(403).send("Wrong Password");
                    }
                  });
            }else{
                res.status(401).send("User Doesnot Exist")
            }
        }else{
            res.status(404).send("Please Register First");
        }
    }); //readFile Ends

})

router.post("/register",(req,res)=>{
    if(!req.body.username){
        res.status(400).send("username is required");
        return
    }else if(!req.body.password){
        res.status(400).send("password is required");
        return;
    }else if(!req.body.usertype){
        req.body.usertype = req.body.username=="admin"?"admin":"user";
    }
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        user={
                user:req.body.username,
                password:hash,
                usertype:req.body.usertype
            }
        fs.readFile('users.json',(err,data)=>{
            let users = []
            if(!err){
                users = JSON.parse(data);
                u = users.find(item=> item.user==req.body.username)
                if(u){
                    res.send("Username Already Exists");
                    return;
                }
            }
            users.push(user);
            fs.writeFile("users.json",JSON.stringify(users),(err)=>{
                payload = {user:req.body.username,usertype:req.body.usertype}
                jwt.sign(payload,process.env.SECRET,(err,token)=>{
                    res.send([payload,{"token":token}])
                })
            })
        }); //readFile Ends
    }); //bcrypt ends
})
module.exports = router; 