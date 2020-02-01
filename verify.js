const jwt = require("jsonwebtoken");
const fs = require('fs');
exports.verify = (token)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.SECRET,(jwterr,user)=>{
          if(jwterr){
            reject({code:401, message:jwterr.message});
          }else{
            fs.readFile('users.json',(err,users)=>{
              if(!err){
                  users = JSON.parse(users);
                  u = users.find(item=> item.user==user.user)
                  if(u){
                    delete u.password
                    resolve(u)
                  }else{
                      reject({code:401,message:"User Does not Exist"});
                  }
              }else{
                  reject({code:404,message:"Please Register First"});
              }
            }); //readFile Ends
          }
        });
    });
}