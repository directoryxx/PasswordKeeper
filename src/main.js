'use strict';

const express = require('express');
require('dotenv/config');

// Constants
const PORT = 8081;
const HOST = '0.0.0.0';

// App
const app = express();
const indexRoutes = require('./routes/index');
const appRoutes = require('./routes/app');
const authRoutes = require('./routes/auth');
const keygenRoutes = require('./routes/keygen');
const cryptRoutes = require('./routes/crypt');
const jsonHandler = require('./error/json');
const multer = require('multer');
const forms = multer();
const zip = require('express-easy-zip');


//Middleware
const auth = require('./middleware/auth');

app.use(zip());
app.use(forms.array()); 
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Route
app.use('/', indexRoutes);
app.use('/app', appRoutes);
app.use('/auth', authRoutes);
app.use('/keygen', auth ,keygenRoutes);
app.use('/crypt', auth ,cryptRoutes);

app.use(jsonHandler);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);