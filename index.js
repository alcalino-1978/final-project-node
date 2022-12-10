const express = require('express');
require('dotenv').config();

// Auth
const session = require('express-session');
const passport = require('passport');
require('./middlewares/passport'); // Requerimos nuestro archivo de configuración

// Utils
const { connect } = require('./utils/db');


// Server config
connect();
const app = express();
const PORT = process.env.PORT || 3000;

// Routes config
const patientsRoutes = require('./routes/patient.routes');
const userRouter = require('./routes/user.routes');


app.get('/', (req, res) => {
    // res.send('<h1>Hello World!</h1>');
    res.sendFile(__dirname + '/index.html');
});

app.set('view engine', 'ejs')

// Middlewares config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: 'upgradehub_node', // ¡Este secreto tendremos que cambiarlo en producción!
      resave: false, // Solo guardará la sesión si hay cambios en ella.
      saveUninitialized: false, // Lo usaremos como false debido a que gestionamos nuestra sesión con Passport
      cookie: {
        maxAge: 3600000 // Milisegundos de duración de nuestra cookie, en este caso será una hora.
      },
    })
  );
app.use(passport.initialize());
app.use(passport.session());

// Añadimos el nuevo middleware al servidor
app.use(passport.initialize())


//Routes
app.use('/patients', patientsRoutes);
app.use('/users', userRouter);
// const doctorsRoutes = require('./routes/doctor.routes');


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