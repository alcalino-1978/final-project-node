const express = require('express');
const passport = require('passport');

const router = express.Router();

// Post Register
router.post('/register', (req, res, next) => {
    // Invocamos a la autenticación de Passport

		const done = (error, user) => {
        // Si hay un error, llamamos a nuestro controlador de errores
        if (error) {
            return next(error);
        }
        user.password = null;
            // res.status(201).json(user);
        //     // Método de passport
            req.logIn(user, (error) => {
            // Si hay un error logeando al usuario, resolvemos el controlador
            if (error) {
                return next(error);
            }
            // Si no hay error, devolvemos al usuario logueado
           return res.status(201).json(user)
        });
        
    };

    passport.authenticate('register', done)(req); // ¡No te olvides de invocarlo aquí!
});


// Post Login
router.post('/login', (req, res, next) => {

    const done = (error, user) => {
        // Si hay un error, llamamos a nuestro controlador de errores
        if (error) {
            return next(error);
        }
        // Método de passport
        req.logIn(user, (error) => {
        // Si hay un error logeando al usuario, resolvemos el controlador
            if (error) {
                return next(error);
            }
            // Si no hay error, devolvemos al usuario logueado
            return res.status(200).json(user)
    });
        
    };
    passport.authenticate('login', done)(req);
});

// Post logout

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.status(200).send();
    });
  });

module.exports = router;