const express = require('express');
const path = require('path');
require('dotenv').config();

// Auth
require('jsonwebtoken'); // Requerimos nuestro archivo de configuración

// Utils
const { connect } = require('./utils/db');


// Server config
connect();
const app = express();
const PORT = process.env.PORT || 3000;

// Routes config
const patientsRoutes = require('./routes/patient.routes');
const doctorsRoutes = require('./routes/doctor.routes');
const userRoutes = require('./routes/user.routes');
// const insuranceRoutes = require('./routes/insurance.routes');


app.get('/', (req, res) => {
    // res.send('<h1>Hello World!</h1>');
    res.sendFile(__dirname + '/index.html');
});

app.set('view engine', 'ejs')

// Middlewares config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.set('secretKey', 'nodeRestApi'); // Config JWT

//Routes
app.use('/patients', patientsRoutes);
app.use('/doctors', doctorsRoutes);
// app.use('/insurances', insuranceRoutes);
app.use('/users', userRoutes);


// Control error
app.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error');
})

// Listen Server
app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})