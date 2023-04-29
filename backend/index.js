const mqtt = require('mqtt');
const Reading = require('./reading');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webpush = require('web-push');
const Subscription = require('./subscription');

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

const vapidKeys = {
	publicKey: "BEkWJ8M1r08QeZo_xy2TDBKo5b67xyOCdqFePE9s3k9a9Mrsuv_qsYIuEQ3yNHaK5Thrsfh0AfizQM9fN8payw8",
	privateKey: "GQdwZG982IJat65DP5IG3-l1v1nREXJuYm8RC3uaG6g"
};
webpush.setVapidDetails(
	'mailto:example@yourdomain.org',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

function sendNewsletter(deviceId) {

	var query = { deviceId: req.params.deviceId };
	Subscription.find(query).then(function (allSubscriptions) {
		console.log('Total subscriptions', allSubscriptions.length);

		const notificationPayload = {
			"notification": {
				"title": "Angular News",
				"body": "Newsletter Available!",
				"icon": "assets/main-page-logo-small-hat.png",
				"vibrate": [100, 50, 100],
				"data": {
					"dateOfArrival": Date.now(),
					"primaryKey": 1
				},
				"actions": [{
					"action": "explore",
					"title": "Go to the site"
				}]
			}
		};

		Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
			sub, JSON.stringify(notificationPayload))))
			.then(() => res.status(200).json({ message: 'Newsletter sent successfully.' }))
			.catch(err => {
				console.error("Error sending notification, reason: ", err);
				res.sendStatus(500);
			});
	}).catch(next);
}