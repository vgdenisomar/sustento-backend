const express = require('express');
var router = express.Router();


function DonacionesInit(db){

router.get('/', (req, res, next)=>{
  var sql = 'select * from organizaciones';
  db.query(sql, function(err, result) {
    if (err){
      return res.status(200).json([err])
    }
    return res.status(200).json(result);
  });
});

router.get('/Destacadas', (req, res, next)=>{
  var sql = 'select * from Donaciones where destacada=1';
  db.query(sql, function(err, result) {
    if (err){
      return res.status(200).json([err])
    }
    return res.status(200).json(result);
  });
});
 return router;
}
module.exports = DonacionesInit;
