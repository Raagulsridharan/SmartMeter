const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Subscription = require('./subscription');
const Reading = require('./reading');
const Alert = require('./alert');

//connecting to mqtt broker
const mqttclient = mqtt.connect('mqtt://broker.hivemq.com')
//mqttclient.subscribe('KNOW_16042023_VOL');
//mqttclient.subscribe('KNOW_16042023_CUR');
mqttclient.subscribe('KNOW_16042023_POW');

// connect to mongodb
mongoose.connect('mongodb+srv://saravanakumarrc:sarapower@cluster0.omi9lez.mongodb.net/SmartHomeDB?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

// set up our express app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
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

mqttclient.on('message', (topic, message, packet) => {
	console.log(`Received message on topic ${topic}: ${message.toString()}`);
	var deviceId = topic.split('_')[1];
	var readingType = topic.split('_')[2];
	var cost = 0;
	var reading = {};
	if (readingType == "POW") {		
		var date = new Date();
		var monthStartingDay = new Date(date.getFullYear(), date.getMonth(), 1);
		Reading.findOne({ deviceId: deviceId, unitType: "POW", usedAt: { $gt: monthStartingDay } },[], { sort: { 'usedAt': -1 }}).then(function(lastReading){
			var unit = message/1000;
			if(lastReading){
				console.log(lastReading.usedAt);
				console.log(lastReading.units);
				units = parseFloat(lastReading.units + unit);
				Alert.find({deviceId: deviceId}).then(function(alerts){
					alerts.forEach(function(alert){
						if(alert && units > alert.unitLimit){
							sendMail();
						}
					});					
				});
			} else {				
				console.log("No Last Reading");
				units = parseFloat(unit);
			}			
			console.log(units);
			cost = calculateCost(units);
			reading = BuildReadingObject(message, deviceId, topic, cost, units);

			Reading.create(reading).then(function (reading) {
				console.log(`Persisted!`);
			});			
		});
	}
});

function BuildReadingObject(message, deviceId, topic, cost, units) {
	return {
		usage: Number(message.toString()),
		usedAt: new Date(),
		deviceId: deviceId,
		unitType: topic.split('_')[2],
		cost: cost,
		units: units
	};
}

function calculateCost(units) {
	var cost = 0;
	//units = units - 50;
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

function sendMail(){
	console.log("sending mail");
}