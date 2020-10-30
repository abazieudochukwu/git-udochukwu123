const express = require('express');
const dotenv =require('dotenv')
const  morgan = require('morgan');
const  exphbs = require('express-handlebars');
const path =require('path');
const passport = require('passport')
const  session =require('express-session')
const connectDB = require('./config/db');
const mongoose  = require('mongoose');
const MongoStore = require('connect-mongo')(session);

//loading the configuration file 
dotenv.config({path: './config/config.env'});

//Passport config 
require('./config/passport')(passport);

//connecting to the database
connectDB();

//loading the express app
const app = express();

//Body- parser middleware for forms 
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// function for formatting date 

const {formatDate,truncate,stripTags}  = require('./helpers/hbs');

//config template engine Handlebars
app.engine('hbs',exphbs({
    helpers: {
        formatDate,
        truncate,
        stripTags,
    },
    defaultLayout:'main',
    extname:'.hbs'
}))
app.set('view engine','hbs');

//Session Middleware for sessions 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
  }))




//passport middle ware
app.use(passport.initialize());
app.use(passport.session());

//Load all static files 
app.use(express.static(path.join(__dirname,'public')));

//Routes 
app.use('/',require('./routes/index'))
//Google strategy auth routes 
app.use('/auth',require('./routes/auth'))
//route to add stories
app.use('/stories',require('./routes/stories'))

//logging request to the console 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

/*
//@desc 404 NOT FOUND PAGE 
//@desc  GET /400

app.use(function(req,res,next){
    res.status(404);
    res.render('error/404')
    
});

//@desc 500 ERROR route
//@desc  GET /500
app.use(function(err,req,res,next){
    res.status(500);
    res.render('error/500')
    
})
*/

// declaration of the port
const PORT = process.env.PORT || 5050;
app.listen(PORT,function(){
    console.log(`server running  in ${process.env.NODE_ENV} mode on port ${PORT} `)

});