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
	const reading = {
		usage: Number(message.toString()),
		usedAt: new Date(),
		deviceId: "DEVICE1",
		accountId: "ACCOUNT1",
		unitType: topic
	};

	Reading.create(reading).then(function (reading) {
		console.log(`Persisted!`);
	});
});