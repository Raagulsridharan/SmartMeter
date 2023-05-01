const express = require('express');
const router = express.Router();
const Reading = require('./reading');
const Subscription = require('./subscription');
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
router.post('/subscriptions', function (req, res, next) {
    var subscription = {
        endpoint: req.body.endpoint,
        expirationTime: req.body.expirationTime,
        keys_p256dh: req.body.keys.p256dh,
        keys_auth: req.body.keys.auth,
        deviceId: req.body.deviceId
    }
    Subscription.create(subscription).then(function (subscription) {
        res.send(subscription);
    }).catch(next);
});
router.get('/subscriptions/:deviceId', function (req, res, next) {
    var query = { deviceId: req.params.deviceId };
    Subscription.find(query).then(function (subscription) {
        res.send(subscription);
    }).catch(next);
});
module.exports = router;