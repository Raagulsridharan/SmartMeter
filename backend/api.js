const express = require('express');
const router = express.Router();
const Reading = require('./reading');
router.get('/readings', function (req, res, next) {
    Reading.find({}).then(function (readings) {
        res.send(readings);
    }).catch(next);
});
router.get('/readings/:deviceId', function (req, res, next) {
    var { unit, amount, unitType } = req.query;
    var query = { deviceId: req.params.deviceId, unitType };
    if(unit && amount){
        query = {
            ...query,
            $expr:{
                $gt:
                   [
                      "$usedAt",
                       {
                          $dateSubtract:
                             {
                                startDate: "$$NOW",
                                unit: unit,
                                amount: Number(amount)
                             }
                       }
                   ]
             }   
        }
    }
        
    Reading.find(query).then(function (readings) {
        res.send(readings);
    }).catch(next);
});
router.post('/readings', function (req, res, next) {
    Reading.create(req.body).then(function (reading) {
        res.send(reading);
    }).catch(next);
});
router.put('/readings/:id', function (req, res, next) {
    Reading.findOneAndUpdate({ _id: req.params.id }, req.body).then(function (reading) {
        Reading.findOne({ _id: req.params.id }).then(function (reading) {
            res.send(reading);
        });
    });
});
router.delete('/readings/:id', function (req, res, next) {
    Reading.findOneAndDelete({ _id: req.params.id }).then(function (reading) {
        res.send(reading);
    });
});
module.exports = router;