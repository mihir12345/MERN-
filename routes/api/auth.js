const express=require('express')
const router=express.Router()
const auth =require('../../middleware/authMiddleware')
const User = require('../../models/User')


// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/',auth,async(req,res)=>
{
    try{
const user=await User.findById(req.user.id).select('-password')
res.json(user);
    }catch(error){
        console.error(error.message)
        res.status(500).send('no user found')
    }
}
// res.send('Auth page')
)



// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public


module.exports=router


