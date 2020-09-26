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
/*
  //Ingresa un nuevo usuario a la colección de Usuario
  userModel.agregarNuevo = (name,email, password,tipo, handler) => {
    var newUser = Object.assign({}, {
      name:name,
      email:email,
      password: genPassword(password),
      dateCreated: new Date().getTime(),
      active: true,
      user:tipo,
      qr:"https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth%3A%2F%2Ftotp%2FGoogle+Autenticador%3Fsecret%3DHS4OI2GFLJ54EJ7X%26issuer%3Dhttp%253A%252F%252Flocalhost%252Fgoogle-authenticator%252F",
      lastPasswords:[],
      roles:["public"]
      }
      );
    userColl.insertOne(newUser, (err, result)=>{
      if(err){
        console.log(err);
        return handler(err, null);
      }
      if(result.insertedCount == 0){
        return handler(new Error("No se guardo el usuario"), null);
      }
      return handler(null, result.ops[0]);
    })
  } // agregarNuevo

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
