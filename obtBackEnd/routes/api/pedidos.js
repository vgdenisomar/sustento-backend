const express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

function ProductsInit(db) {


    var ProductsColl = db.collection('car');
    var FacturasColl = db.collection('pedido');
    var FacturaDetColl = db.collection('detallepedido');


    router.get('/', (req, res, next) => {
        var { _id} = req.user;
        var query = {"proveedor": new ObjectID(_id), "estado":"SLC"}
        FacturaDetColl.aggregate(
            [
                 {$match: query},
                 {$group: {_id: "$factura", total: { $sum:1}, name:{"$first":"$name"}, precio:{"$first":"$precio"}} }
            ]
       ).toArray((err, things) => {
            if (err) return res.status(200).json([]);
            return res.status(200).json(things);
        });
    });

    router.get('/entregar', (req, res, next) => {
        var { _id} = req.user;
        var query = {"proveedor": new ObjectID(_id), "estado":"ENT"}
        FacturaDetColl.aggregate(
            [
                 {$match: query},
                 {$group: {_id: "$factura", total: { $sum:1},name:{"$first":"$name"}} }
            ]
       ).toArray((err, things) => {
            if (err) return res.status(200).json([]);
            return res.status(200).json(things);
        });
    });

    router.get('/detalle/:idElemento', (req, res, next) => {
        var { _id} = req.user;
        var query = {"factura": new ObjectID(req.params.idElemento),"proveedor": new ObjectID(_id)};
        console.log(req.params.idElemento);
        FacturaDetColl.aggregate(
          [
               {$match: query},
               {$group: {_id: "$factura", total: { $sum:1},nombre_Product:{"$first":"$nombre_Product"},precio:{"$first":"$precio"}} }
          ]
     ).toArray((err, things) => {
          if (err) return res.status(200).json([]);
          return res.status(200).json(things);
      });
    });

    router.post('/', (req, res, next) => {
        var { _id} = req.user;
        var query = {"by": new ObjectID(_id)}
        ProductsColl.find(query,{projection:{_id:0,codProd:0, nombre_Product:0, proveedor:0}}).limit(1).toArray((err, things) => {
            if (err) return res.status(200).json([]);
            console.log(things);
            FacturasColl.insertMany(things, function(err, res) {
                fac=res.ops[0]._id;
                req.user.fac=fac;
                if (err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
              });

              var query = {"by": new ObjectID(_id)}
              ProductsColl.find(query,{projection:{_id:0,by:0}}).toArray((err,thingsw)=>{
                ejemplo = thingsw.map(item=>{
                    item.factura=new ObjectID(req.user.fac);
                    item.estado="SLC"
                    return item;
                })
                console.log(ejemplo);
                FacturaDetColl.insertMany(ejemplo, function(err, res) {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                  });

              });

              var query = {"by": new ObjectID(_id)}
              ProductsColl.remove(query, (err, result) => {
                if(err) {
                  console.log(err);
                  return res.status(400).json({"error":"Error al eliminar documento"});
                }
                return res.status(200).json(result);
              });

        });

    });
    router.put('/aceptar', (req, res, next) => {
        var {_id} = req.user;
        req.body.by= new ObjectID(_id);
        var query = {"factura": new ObjectID(req.body.id),"proveedor":new ObjectID(_id)};
        var update = { "$set": {estado:"ENT"}};
        FacturaDetColl.updateMany(query, update, (err, rst) => {
            if(err){
              console.log(err);
              return res.status(400).json({"error": "Error al actualizar documento"});
            }
            return res.status(200).json(rst);
          });


    });

    router.put('/pagar', (req, res, next) => {
        var {_id} = req.user;
        req.body.by= new ObjectID(_id);
        var query = {"factura": new ObjectID(req.body.id),"proveedor":new ObjectID(_id)};
        var update = { "$set": {estado:"PAG"}};
        FacturaDetColl.updateMany(query, update, (err, rst) => {
            if(err){
              console.log(err);
              return res.status(400).json({"error": "Error al actualizar documento"});
            }
            return res.status(200).json(rst);
          });


    });

    router.put('/cancelar', (req, res, next) => {
        var {_id} = req.user;
        req.body.by= new ObjectID(_id);
        var query = {"factura": new ObjectID(req.body.id),"proveedor":new ObjectID(_id)};
        var update = { "$set": {estado:"CNC"}};
        FacturaDetColl.updateMany(query, update, (err, rst) => {
            if(err){
              console.log(err);
              return res.status(400).json({"error": "Error al actualizar documento"});
            }
            return res.status(200).json(rst);
          });


    });




    router.delete('/:id', (req, res, next) => {
        var { _id} = req.user;
        var query = {"by": new ObjectID(_id)}
        ProductsColl.remove(query, (err, result) => {
          if(err) {
            console.log(err);
            return res.status(400).json({"error":"Error al eliminar documento"});
          }
          return res.status(200).json(result);
        });
        //var soft = req.params.soft;
        // thingsCollection = thingsCollection.filter( (e, i) => {
        //   return (e.id !== id );
        // } ); //
        // res.status(200).json({ 'msg': 'Elemento ' + id + ' fué eleminido!!!' });
      });// put /

    return router;
}
module.exports = ProductsInit;
