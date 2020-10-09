var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');

module.exports = function(db){
  var userModel = {}

  //Obtiene el usuario por correo electrónico
  userModel.obtenerPorCorreo = function( email, handler) {
    var sql = 'SELECT * FROM clientes WHERE emailCliente = "'+email+'"';
    db.query(sql, function(err, user) {
      if (err){
        
        return handler(err, null);
      }
      if(user.length != 1)
      {
       
        return handler(new Error("No se encontró el usuario"), null);
      }
      if(!user){
        
        return handler(new Error("No se encontró el usuario"), null);
        
      }

      return handler(null, user);
    });
  }

  //buscar correo para la creacion de usuario
  userModel.verificarCorreo = function( email, handler) {
    var sql = 'SELECT * FROM clientes WHERE emailCliente = "'+email+'"';
    db.query(sql, function(err, user) {
      if (err){
        
        return handler(err, null);
      }
      if(user.length > 0)
      {
       
        return handler(new Error("Usuario ya existente"), null);
      }

      return handler (null, user);
       
    });
  }
    //Actualiza ubicacion de usuario
    userModel.actualizaUsuario = function( codCliente, longitud,latitud, handler) {
      var sql = 'UPDATE clientes SET latitud = "'+latitud+'", longitud="'+longitud+'" WHERE codCliente = "'+codCliente+'"';
      db.query(sql, function(err, result) {
        if (err){
          
          return handler(err, null);
        }
  
        return handler(null, result.affectedRows);
      });
    }

  //Ingresa un nuevo usuario a la colección de Usuario
  userModel.agregarNuevo = (name, email, password, handler) => {
    var query = "INSERT INTO clientes (nomCliente,emailCliente,contraCliente,admin) VALUES (?,?,?,?);";
    db.query(query,[name, email,password,0], function (err,rs){
      if(err){
        return handler(err, null);
      }
      return handler(null, rs.affectedRows);

    });
  } 

  /*
  userModel.changePassword = (email, newPassword, handler) => {
    var query = {email: email};
    var projection = {"password":1, "active":1, "lastPasswords":1};
    userColl.findOne(query, {"projection": projection}, (err,user)=>{
        if(err){
          console.log(err);
          return handler(err, null);
        }
        if(!user){
          return handler(new Error("No se encontró usuario"), null);
        }
        if(!user.active){
          return handler(new Error("Usuario Inactivo"), null);
        }
        var newPasswordHash = genPassword(newPassword);
        if(bcrypt.compareSync(newPassword, user.password)){
          return handler(new Error("Debe usar una contraseña no utilizada anteriormente"), null);
        }
        var oldPasswords = user.lastPasswords.filter(
          (psw, i)=>{
            return bcrypt.compareSync(newPassword, psw);
          }
        );
        if(oldPasswords.length > 0){
          return handler(new Error("Debe usar una contraseña no utilizada anteriormente"), null);
        }
        var lastPasswords = user.lastPasswords.slice(1,5);
        lastPasswords.push(user.password);
        var update = {
          "$set": {"password": newPasswordHash, "lastPasswords": lastPasswords, "lastChangedPassword": new Date().getTime()}
        }
        userColl.updateOne({"_id": user._id}, update, (err, result)=>{
          if(err){
            console.log(err);
            return handler(err, null);
          }
          return handler(null, true);
        });
    });
  } //changePassword
  function genPassword(rawPassword){
    var hashedPassword = bcrypt.hashSync(rawPassword, 10);
    return hashedPassword;
  }*/

  userModel.comparePasswords = (rawPassword, dbPassword)=>{
    if(rawPassword==dbPassword)
    {
      return true;
    }
    else{
      return false;
    }
  }
  return userModel;
}
