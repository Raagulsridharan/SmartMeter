const mqtt = require('mqtt');
const Reading = require('./reading');
const express = require('express');
const mongoose = require('mongoose');

//connecting to mqtt broker
const client = mqtt.connect('mqtt://broker.hivemq.com')
client.subscribe('KNOW_16042023_VOL');
client.subscribe('KNOW_16042023_CUR');
client.subscribe('KNOW_16042023_POW');

// connect to mongodb
mongoose.connect('mongodb+srv://saravanakumarrc:sarapower@cluster0.omi9lez.mongodb.net/SmartHomeDB?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

// set up our express app
const app = express();
app.use(express.static('public'));
app.use(express.json());
// initialize routes
app.use('/api', require('./api'));

// error handling middleware
app.use(function (err, req, res, next) {
	//console.log(err);
	res.status(422).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
	console.log('Ready to Go!');
});

client.on('message', (topic, message, packet) => {
	console.log(`Received message on topic ${topic}: ${message.toString()}  : ${message.byteLength}`);
	var deviceId = topic.split('_')[1];
	var unitType = topic.split('_')[2];
	var cost = 0;
	var reading = {};
	if (unitType == "POW") {
		Reading.aggregate([
			{
				$match: { deviceId: deviceId, unitType: "POW" }
			},
			{
				$group: { _id: "$deviceId", totalPowerConsumption: { $sum: "$usage" } }
			}
		]).then(function (aggregateResult) {
			console.log(aggregateResult);
			units = aggregateResult[0].totalPowerConsumption / 1000;
			console.log(units);
			cost = calculateCost(units);
			console.log(cost);
			reading = BuildReadingObject(message, deviceId, topic, cost, units);

			Reading.create(reading).then(function (reading) {
				console.log(`Persisted!`);
			});
		});
	} else {
		reading = BuildReadingObject(message, deviceId, topic, cost, 0);

		Reading.create(reading).then(function (reading) {
			console.log(`Persisted!`);
		});
	}
});

function BuildReadingObject(message, deviceId, topic, cost, calculatedUnit) {
	return {
		usage: Number(message.toString()),
		usedAt: new Date(),
		deviceId: deviceId,
		unitType: topic.split('_')[2],
		cost: cost,
		calculatedUnit: calculatedUnit
	};
}

function calculateCost(units) {
	var cost = 0;
	units = units - 50;
	if (units > 0) {
		if (units > 150) {
			cost += 150 * 4.5;
		} else {
			cost += units * 4.5;
		}
		units = units - 150;
	}
	if (units > 0) {
		if (units > 50) {
			cost += 50 * 6;
		} else {
			cost += units * 6;
		}
		units = units - 50;
	}
	if (units > 0) {
		if (units > 50) {
			cost += 50 * 8;
		} else {
			cost += units * 8;
		}
		units = units - 50;
	}
	if (units > 0) {
		if (units > 100) {
			cost += 100 * 9;
		} else {
			cost += units * 9;
		}
		units = units - 100;
	}
	if (units > 0) {
		if (units > 100) {
			cost += 100 * 100;
		} else {
			cost += units * 10;
		}
		units = units - 100;
	}
	if (units > 0) {
		cost += units * 11;
	}
	return cost;
}