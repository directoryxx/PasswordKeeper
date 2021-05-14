'use strict';

const express = require('express');
const formData = require("express-form-data");
const os = require("os");
require('buffer').Buffer;
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
// const multer = require('multer');
// const forms = multer();
const zip = require('express-easy-zip');


//Middleware
const auth = require('./middleware/auth');

// Options Form data
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};

app.use(zip());
// app.use(forms.array()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

// Route
app.use('/', indexRoutes);
app.use('/app', appRoutes);
app.use('/auth', authRoutes);
app.use('/keygen', auth ,keygenRoutes);
app.use('/crypt', auth ,cryptRoutes);

app.use(jsonHandler);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);