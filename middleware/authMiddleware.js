const config=require('../config/default.json')
const jwt = require('jsonwebtoken');

module.exports =async(req,res,next)=>{
    const token =req.header('x-access-token')

    if(!token){
      return res.status(400).json({msg:'No token auth'})
    }
    try {
        await jwt.verify(token, 'mihir', (error, decoded)=>{
          if(error){
            res.status(401).json({ msg: 'Token is not valid' });
          }
          else{
            req.user = decoded.user;
            next();
          }
        });
    }catch(err){
return res.status(400).json({msg:'token is not valid'})
    }
}