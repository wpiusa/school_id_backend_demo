//import packages
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
//import passport from 'passport';
//import path from 'path';

import users from './routes/api/users'; // import api to index
const app = express();

// read data from front end  inside body (parse to use in backend)
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/myschool');

//setup routes for api
app.use('/api/users', users);  // set up default url 

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is connected !!`));