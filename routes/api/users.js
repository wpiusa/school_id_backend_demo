import express from 'express';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import keys from '../../config/keys';
import User from '../../models/User'; // import model to api
const router = express.Router();

/*
    Inside api : 
    POST : Register user
    POST : Login user
    GET : Get all user
*/

/***************************
  Add new user: 
  Route : api/users/register   (api/users is already define in index)
  Desc: Register User
****************************/
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email}).then(user =>{
        if (user) {
            console.log('find the user');
            return res.status(400).json({error: 'email already exist'});
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                passport: req.body.passport,
                shortId: req.body.shortId,
                longId: req.body.longId,
                school: req.body.school,
                grade: req.body.grade,
                profileURL: req.body.profileURL,
                userType: req.body.shortId ? 'Student' : 'Admin'
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.passport, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.passport = hash;
                    newUser
                        .save()
                        .then(user => res.json({ status: 'success'}))
                        .catch(err => console.log(err));
                });
            })
        }
    });
});

/***************************
  Login user: 
  Route : api/users/login   (api/users is already define in index)
  Desc: Login User
****************************/
router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.passport;

    User.findOne({ email: email}).then(user => {
        if (!user){
            return res.status(400).json({errors: 'no user'});
        }
    });

    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch){
            const payload = { id: user.id, name: user.name, avatar: user.avatar }; 
            jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600},
                (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer' + token
                    });
                }
            )
        }else{
            return res.status(400).json({errors: 'invalid password'});
        }
    });
});

/***************************
  GET single user by email: 
  Route : api/users/email/:email   (api/users is already define in index) :/email (slug)
  Desc: Get User
****************************/
router.get('/email/:email', (req, res) => {
    const email = req.params.email;
    User.findOne({ email: email}).then(user => {
        if (!user){
            return res.status(400).json({error: 'user not found'});
        }
        res.json(user);
    });
});


/***************************
  GET all users by: 
  Route : api/users/all   (api/users is already define in index) 
  Desc: Get all Users
****************************/
router.get('/all', (req, res) => {
    const errors = {};
    User.find().then(users => {
        if (!users){
            errors.nouser = "no users";
            return res.status(400).json(errors);
        }
        res.json({ users:users });
    })
    .catch(err => res.status(404).json({users: 'no users'}));
});

/***************************
  GET single user: 
  Route : api/users/email/:email/password/:password   (api/users is already define in index) 
  Desc: Get single user
****************************/
router.get('/email/:email/password/:password', (req,res) => {
    const { email, password} = req.params;
    let findUser;
    User.findOne({ email: email}).then(user => {
        if (!user){
            errors.email = "User not found";
            return res.status(404).json(errors);
        }else {
            findUser = user;
        }

        bcrypt.genSalt(10, function(err, salt) {
            if (err) return
            bcrypt.hash(passport, salt, function(err, hash){
                if (err) return
                User.finOneAndUpdate({_id: findUser._id }, { password: hash})
                    .then(() => res.status(202).json("Password changed"))
                    .catch(err => res.status(500).json(err))
            })
        })
    });
});

/***************************
  PUT : update single user: 
  Route : api/users   (api/users is already define in index) 
  Desc: Update single user
****************************/
router.put('/', (req, res) => {
    const errors = {};
  
    var query = { email: req.body.email };
  
    User.findOneAndUpdate(query,{
      name: req.body.name,
          email: req.body.email,
          shortId: req.body.shortId,
          longId: req.body.longId,
          school: req.body.school,
          grade: req.body.grade,
          profileURL: req.body.profileURL,
          sixPeriod: req.body.sixPeriod,  
          lunchPeriod: req.body.lunchPeriod, 
          ASB: req.body.ASB,  
          profileURL: req.body.profileURL, 
          status: req.body.status,
          userType: req.body.shortId ? 'Student': 'Admin'
    }).then(user => {
      console.log(user);
      res.json({user: user});
    })
    .catch(err => res.status(404).json(err));
  });


module.exports = router