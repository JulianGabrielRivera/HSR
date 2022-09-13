const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const hbs = require('hbs')
const MongoStore = require('connect-mongo');
const session = require('express-session');
mongoose.connect('mongodb://localhost/authExample')
.then((x)=>{
   console.log('successfully connected to database' + x.connections[0].name)
})
.catch(err => console.log(err))
// this gives us our web server.
const app = express()

// dirname is whatever the file path app.js is then look in views folder.
app.set('views', __dirname + '/views')


app.set('view engine', hbs);
app.use(morgan('dev'))

app.set('trust proxy', 1);

app.use(
    session({
      secret: 'hey',
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000 // 60 * 1000 ms === 1 min
      },
      store:
    MongoStore.create({
        mongoUrl: 'mongodb://localhost/authExample'
    })
      
    })
  );


// parsing data from form
app.use(bodyParser.urlencoded({ extended: false }))




//  setting up my auth

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

app.listen(3000, () =>{
    console.log('server running')
})