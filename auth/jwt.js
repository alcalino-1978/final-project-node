// Cargamos el modelo 
const User = require("../models/User");
// Cargamos el módulo de bcrypt
const bcrypt = require("bcrypt");
// Cargamos el módulo de jsonwebtoken
const jwt = require("jsonwebtoken");


// Codificamos las operaciones que se podran realizar con relacion a los usuarios
const register = async (req, res, next) => {
  try {
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.lastName = req.body.lastName;
    newUser.phoneNumber = req.body.phoneNumber;
    newUser.email = req.body.email;
    const pwdHash = await bcrypt.hash(req.body.password, 10);
    newUser.password = pwdHash;
    console.log(newUser.id);

    // Check If User exists before create it
    const result = await User.exists({ email: newUser.email });
    if (result) {
      return res.status(404).json('This User already exists!');
    } else {
      const userDb = await newUser.save();
      //Pnt. mejora: autenticar directamente al usuario
      newUser.password = null;
      //creamos el token con el id y el name del user
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email
        },
        req.app.get("secretKey"),
        { expiresIn: "1h" }
      );
      //devolvemos el usuario y el token.
      return res.json({
        status: 201,
        message: 'Usuario registrado y logado correctamente',
        data: { userDb, token: token }
      });
    }
    console.log(token)

  } catch (err) {
    return next(err);
  }
}

const login = async (req, res, next) => {
  try {
    //Buscamos al user en bd
    const userInfo = await User.findOne({ email: req.body.email })
    //Comparamos la contraseña
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      //eliminamos la contraseña del usuario
      userInfo.password = null
      //creamos el token con el id y el name del user
      const token = jwt.sign(
        {
          id: userInfo._id,
          email: userInfo.email
        },
        req.app.get("secretKey"),
        { expiresIn: "1h" }
      );
      //devolvemos el usuario y el token.
      return res.json({
        status: 200,
        message: 'Login con éxito',
        data: { user: userInfo, token: token },
      });
    } else {
      return res.json({ status: 400, message: 'Bad request', data: null });
    }
  } catch (err) {
    return next(err);
  }
}

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization; //si en el header existe authorization lo guardamos en una variable. 
  //Esta tiene el formato: bearer token

  if(!authorization) { //Se comprueba que exista autorización
      return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          data: null
      });
  }

  const splits = authorization.split(" ");//troceamos el token en dos partes
  //en la primera quitamos la palabra Bearer
  if(splits.length!=2 || splits[0]!="Bearer"){ //
      return res.status(400).json({
          status: 400,
          message: "Bad Request",
          data: null
      })
  }

  const jwtString = splits[1] // En esta variable guardamos la parte que contiene la información del token

  try {
      var token = jwt.verify(jwtString, req.app.get("secretKey")); //verificamos que el token tiene una firma correcta

  } catch(err) {
      return next(err)
  }

  const authority = { // Creamos un objeto authority que contienen la informacion del token, 
  //en este caso el id y el name del usuario
      id   : token.id,
      email : token.email
  }
  //Asignamos al request el objeto authority
  req.authority = authority;
  next();
}

const deleteUser = async ( req, res, next) => {

  try {
    const result = await User.exists({ email: req.body.email });
    if (!result) {
      return res.status(404).json('This User not exists!');
    } else {
      const userDelete = await User.findOne({ email: req.body.email })
      await User.findByIdAndDelete(userDelete.id);
      return res.status(200).json('User deleted!');
    }
  } catch (error) {
    return next(error);
  }
}


//funcion logout, iguala el token a null.
const logout = (req, res, next) => {
  try {
    return res.json({
      status: 200,
      message: 'Logout OK',
      token: null
    });
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  register,
  login,
  isAuth,
  logout,
  deleteUser
}