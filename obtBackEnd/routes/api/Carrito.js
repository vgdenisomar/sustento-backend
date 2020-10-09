const express = require('express');
var router = express.Router();


function CarritoInit(db){

router.post('/agregar', (req, res, next)=>{
  var sql = 'INSERT INTO carTemp (codProd, codCliente, cantidad) VALUES ('+req.body.codProd+', '+req.body.codCliente+','+req.body.cantidad+')';
  db.query(sql, function(err, result) {
    if (err){
      return res.status(200).json([])
    }
    return res.status(200).json(result);
  });
});


 return router;
}
module.exports = CarritoInit;
