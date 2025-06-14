const express = require('express')
const authRoute = require('./routes/auth')
const blogRoute = require('./routes/blog')
require('dotenv').config();
const cors = require ('cors')
const bodyParser = require('body-parser')
const passport = require('passport')  
const Port = process.env.PORT
const app = express()
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

 require("./authutility");
// Connect to MongoDb
const db = require('./db')

db.connectToMongoDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));



app.set('views', 'views');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(passport.initialize());

app.use('/', authRoute);
app.use('/', blogRoute);


//renders home page
app.get('/', (req, res) => {
    res.render('blog');
  });
// renders the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// renders the signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

//catch errors middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something broke!');
});

app.listen(Port,()=>{
    console.log(`Server is listening on ${Port}`)
})