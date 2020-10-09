const express = require('express'), cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { json } = require('express');

var router = express.Router();

function initSecurity (db){

  var userModel =  require('./users')(db);

  //configurar el passport local
  passport.use(
      new LocalStrategy(
        {
          usernameField:'email',
          passwordField:'password',
        },
        (email,pswd,next)=>{
          console.log(email);
          console.log(pswd);
            //--
          if ((email ||'na') === 'na' || (pswd ||'na') == 'na') {
            console.log("Valores de correo y contraseña no vienen");
            return next(null, false, {"Error":"Credenciales Incorrectas"});
          }
          
          userModel.obtenerPorCorreo(email, (err, user) => {
           
            if (err) {
              console.log(err);
              console.log("Tratando de Ingresar con cuenta inexistente " + email);
              return next(null, false, { "Error": "Credenciales Incorrectas" });
            }
            //Ver si la cuenta está activa
            
            if (!userModel.comparePasswords(pswd, user[0].contraCliente)) {
              console.log("Tratando de Ingresar con contraseña incorrecta " + email);
              return next(null, false, { "Error": "Credenciales Incorrectas" });
            }
            delete user.password;
            delete user.lastPasswords;
            delete user.active;
            delete user.dateCreated;

            return next(null, JSON.stringify(user), { "Status": "Ok" });
          });
            //---
        }
      )
  );

  router.use(cors());

  router.post('/login', (req, res, next)=>{
    passport.authenticate(
        'local',
        {session:false},
        (err, user, info) => {
          if(user){
            req.login(user, {session:false}, (err)=>{
              if(err){
                return res.status(400).json({"Error":"Error al iniciar sesión"});
              }
              const token = jwt.sign(user, 'cuandolosgatosnoestanlosratonesfiestahacen');
              var userF=JSON.parse(user)
              userModel.actualizaUsuario(userF[0].codCliente,req.body.longitud, req.body.latitud, (err, resultado)=>{
                if(err){
                  console.log(err);
                }
                console.log(resultado);
              });
              return res.status(200).json({userF, token});
            });
          }else{
           //console.log(email,password);
            return res.status(400).json({info});
          }
        }
    )(req, res);
  }); //login

  router.post('/signin', (req, res ,next)=>{
    var name = req.body.name || 'na';
    var email = req.body.email || 'na';
    var pswd = req.body.password || 'na';

    if(name === 'na' || email ==='na' || pswd == 'na') {
      return res.status(400).json({"Error":"El nombre, El correo y la contreseña son necesarios"});
    }
    if (!(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(email)) {
      return res.status(400).json({ "Error": "El correo electrónico debe ser uno válido" });
    }
    if (! (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z\.!@#$%]{8,32}$/).test(pswd)){
      return res.status(400).json({ "Error": "La contraseña debe contener al menos una Mayúscula, una Minúscula, un número y un signo especial ! @ # $ % y mínimo 8 caracteres" });
    }
    
    userModel.verificarCorreo(email, (err, user) => {
           
      if (err) {
        console.log("Tratando de Ingresar  cuenta existente " + email);
        return res.status(400).json({ "Error": "Usuario Existente"});
      }
      userModel.agregarNuevo(name, email, pswd, (err, newUser)=>{
        if(err){
          return res.status(400).json({ "Error": "No se pudo crear nueva cuenta" });
        }
        delete newUser.password;
        return res.status(200).json(newUser);
      })
    
    });
    
  }); // signin

  return router;
}

module.exports = initSecurity;
