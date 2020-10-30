// top level routes are to be here 
const express = require('express');
const {ensureAuth} = require('../middleware/auth')
const router = express.Router();
const Story = require('../models/Stories');

//@desc  route to add stories to the page  
//@route GET stories/add

router.get('/add',ensureAuth,(req,res) => {
    res.render('stories/add');
});

//@desc  Process the stories  
//@route POST /stories

router.post('/story',ensureAuth, async (req,res) => {
   
   try{

       req.body.user = req.user.id;
         await  Story.create(req.body);
       res.redirect('/dashboard');

   }
   catch(err){
       console.error(err)
       res.render('error/500');
   }
});

//@desc  show all stories   
//@route GET / stories

router.get('/public',ensureAuth, async (req,res) => {
   
   try{
const stories = await Story.find({status : 'public'})
.populate('user')
.sort({createdAt: 'desc'})
.lean()

res.render('stories/index',{
    stories,
})
   }
   catch(err){
       console.error(err);
    res.render('/error/500');
   } 
});



module.exports = router;