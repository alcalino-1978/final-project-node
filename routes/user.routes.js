const express = require("express");
const router = express.Router();
//importamos las funciones del controlador y del middleware
const { register, login, isAuth, logout, deleteUser } = require("../auth/jwt");

router.post("/register", register);
router.post("/login", login);
//le añadimos el middleware para que solo sea accesible si el user esta logueado
router.post("/logout", [isAuth], logout)
router.delete("/delete", [isAuth], deleteUser)

module.exports = router;