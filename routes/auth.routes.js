const express = require('express')

const router = express.Router()
const User = require('../models/User.model')

const bcryptjs = require('bcryptjs');

const {isAuthenticated,isNotAuthenticated} = require('../middlewares/auth.middleware')


router.get('/', function (req, res) {
    res.render('index.hbs')
  })

  router.get('/signup',(req,res,next)=>{


    res.render('auth/signup.hbs')
  })

  router.post('/signup', (req,res,next) =>{
const {username, password} = req.body

// use bcrypt here

const hashedPassword = bcryptjs.hashSync(password)
User.create({username, password: hashedPassword})
.then((userDetails) =>{
console.log(userDetails)
})
.catch(err => console.log(err))

  })

  router.get('/login', (req,res,next)=>{
  


    
            res.render('auth/login.hbs')

       
  })



  router.post('/login', (req,res,next)=>{
    const {username, password} = req.body


        User.findOne({username})
        .then((foundUser)=>{
           if(!foundUser){
            res.send('user not found')
           }

        //   

        const isValidPassword = bcryptjs.compareSync(password, foundUser.password)

        if(!isValidPassword){
            res.send('incorrect password')
        
        }
        req.session.user = foundUser;  
            res.redirect('/profile')
        })
        .catch(err=>console.log(err))
  })

  router.get('/profile', (req,res,next)=>{


    if(req.session.user){
      res.render('profile.hbs', {username: req.session.user.username})
    }
    else {
      res.render('profile.hbs', { username: 'Anonymous' });
    }
    
  })



  router.get('/protected',isAuthenticated, (req,res,next)=>{
    res.send('this route is protected')
  })
  module.exports = router;