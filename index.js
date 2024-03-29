const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Auth
require("jsonwebtoken"); // Requerimos nuestro archivo de configuración

// Utils
const { connect } = require("./utils/db");

// Server config
connect();
const app = express();
const PORT = process.env.PORT || 3000;

// Routes config
const patientsRoutes = require("./routes/patient.routes");
const doctorsRoutes = require("./routes/doctor.routes");
const userRoutes = require("./routes/user.routes");

//CORS CONFIG
const whitelist = [
  "http://localhost:4200", 
  "http://localhost:63022", 
  "https://final-project-angular.vercel.app/"
]; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};
// const insuranceRoutes = require('./routes/insurance.routes');

app.get("/", (req, res) => {
  // res.send('<h1>Hello World!</h1>');
  res.sendFile(__dirname + "/index.html");
});

app.set("view engine", "ejs");

// Middlewares config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: whitelist,
//   })
// );
app.set("secretKey", "nodeRestApi"); // Config JWT

//Routes
app.use("/patients", patientsRoutes);
app.use("/doctors", doctorsRoutes);
// app.use('/insurances', insuranceRoutes);
app.use("/users", userRoutes);

// Control error
app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json(error.message || "Unexpected error");
});

// Listen Server
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
