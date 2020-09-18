//our app is running in port 8080
let  PORT  = 8080;
//require express to achieve the communication
const express = require('express');
//require diadromes.js to handle the routes
const Router = require('./routes/diadromes.js');
//require the handlebars
const exphbs = require('express-handlebars');

//reuire the multer to achieve the uploading of the images/files
var multer = require('multer');

//require the mongoose to connect and access our mongo database in mongodb
const mongoose = require('mongoose');

// var nodemailer = require('nodemailer');

const app = express();

//require express-session to create sessions for the connected users-- cookies
var session = require('express-session')

//create a mongostore to achieve the connection to the db
const MongoStore = require('connect-mongo')(session);

//the url of our db in mongodb
const uri = "mongodb+srv://web:XXXX@cluster0-c4jof.mongodb.net/project?retryWrites=true&w=majority";

//set options of the connection
const dbOptions ={
  useNewUrlParser: true, 
  useUnifiedTopology: true  
}

//create connection to mongo using the url and the options
const connection = mongoose.createConnection(uri,dbOptions);

//create a session store, which is a connection to the sessions collection in mongo db
const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions'
});

//use the session for 1 day
app.use(session({
  secret: 'some secret',
  resave: false,
  saveUnitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //1 day
  }
}));

//load the hbs files
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.use(express.static('public'))

//check in view/ for hbs files
app.set('view engine', 'hbs');

app.use('/',Router);

//start the app to the selected port
app.listen(PORT,()=>{console.log('Server Started at port:'+PORT) });