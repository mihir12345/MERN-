const express=require('express')
const router=express.Router()
const auth =require('../../middleware/authMiddleware')
const { findOne } = require('../../models/User')

router.get('/',auth,(req,res)=>
{
    try{
const user=User.findById(req.user.id).select('-password')
    }catch(error){
        console.error(error.message)
        res.status(500).send('no user found')
    }
}
// res.send('Auth page')
)

module.exports=router


