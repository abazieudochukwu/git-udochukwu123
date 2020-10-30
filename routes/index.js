// top level routes are to be here 
const {ensureAuth,ensureGuest} = require('../middleware/auth')
const express = require('express');
const router = express.Router();
const Story = require('../models/Stories');

//@desc  login/Landing page 
//@route GET  /

router.get('/',ensureGuest,(req,res) => {
    res.render('login',{
        layout:'login'
    });
})
//@desc  dashboard/
//@route GET  /dashboard

router.get('/dashboard',ensureAuth,async (req,res) =>{
try{
const stories = await Story.find({user: req.user._id}).lean()  
       res.render('dashboard',{
           name: req.user.firstName,
           stories,
});
}catch(err){
    console.error(err)
    res.render('error/500');
} 

})



module.exports = router;