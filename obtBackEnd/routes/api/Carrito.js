const express = require('express');
var router = express.Router();


function CarritoInit(db){

router.post('/agregar', (req, res, next)=>{
  var sql = 'INSERT INTO carTemp (codProd, codCliente, cantidad) VALUES ('+req.body.codProd+', '+req.body.codCliente+','+req.body.cantidad+')';
  db.query(sql, function(err, result) {
    if (err){
      return res.status(200).json([err])
    }
    return res.status(200).json(result);
  });
});

router.post('/verCarrito', (req, res, next)=>{
  var queryCarrito = 'SELECT b.nomProd,b.precioProd, b.precioOfProd,(b.precioProd-b.precioOfProd) as oferta , a.cantidad, (b.precioOfProd * a.cantidad) as total from sustento.carTemp a INNER JOIN sustento.productos b ON a.codProd = b.codProd WHERE a.codCliente = "'+req.body.codCliente+'"';
  db.query(queryCarrito, function(err, result) {
    if (err){
      return res.status(200).json([err])
    }
    console.log(req.body.codCliente);
    return res.status(200).json(result);
  });
});

router.post('/actualizarTemporal', (req, res, next)=>{
  var sql = 'INSERT INTO carTemp (codProd, codCliente, cantidad) VALUES ('+req.body.codProd+', '+req.body.codCliente+','+req.body.cantidad+')';
  db.query(sql, function(err, result) {
    if (err){
      return res.status(200).json([])
    }
    return res.status(200).json(result);
  });
});

router.post('/confirmarPedido', (req, res, next)=>{
  var queryPedido = 'INSERT INTO pedidos ( codCliente ) VALUES ('+req.body.codCliente+')';
  var queryTemporal = 'SELECT * FROM carTemp where codCliente="'+req.body.codCliente+'"';
  var queryDeleteTemporal = 'Delete from carTemp where codCliente="'+req.body.codCliente+'"';

  db.query(queryPedido, function(err, result) {
    if (err){
      return res.status(200).json([])
    }
    
  db.query(queryTemporal, function(err, carrito) {
    if (err){
      return res.status(200).json([])
    }

    carrito.forEach(element => {  
      var queryDetalle = 'INSERT INTO detalle_pedido ( codPedido,codProd, cant, estPedido ) VALUES ('+result.insertId+', '+element.codProd+','+element.cantidad+',"SLT")';
      db.query(queryDetalle, function(err, resultado) {
        if (err){
          return res.status(200).json([err])
        } 
      });  
    });
 
    db.query(queryDeleteTemporal, function(err, resultado) {
      if (err){
        return res.status(200).json([err])
      }
     });
  });

  return res.status(200).json(result);
  });
});

 return router;
}
module.exports = CarritoInit;
