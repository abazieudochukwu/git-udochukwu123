const express = require('express');
const dotenv =require('dotenv')
const  morgan = require('morgan');
const  exphbs = require('express-handlebars');
const path =require('path');
const passport = require('passport')
const  session =require('express-session')
const connectDB = require('./config/db')

//loading the configuration file 
dotenv.config({path: './config/config.env'});

//Passport config 
require('./config/passport')(passport);

//connecting to the database
connectDB();

//loading the express app
const app = express();

//config template engine Handlebars
app.engine('hbs',exphbs({
    defaultLayout:'main',
    extname:'.hbs'
}))
app.set('view engine','hbs');

//Session Middleware for sessions 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false,
  }))




//passport middle ware
app.use(passport.initialize());
app.use(passport.session());

//Load all static files 
app.use(express.static(path.join(__dirname,'public')));

//Routes 
app.use('/',require('./routes/index'))

//logging request to the console 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// declaration of the port
const PORT = process.env.PORT || 5050;
app.listen(PORT,function(){
    console.log(`server running  in ${process.env.NODE_ENV} mode on port ${PORT} `)

});