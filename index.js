const { MongoClient, ServerApiVersion } = require('mongodb');
const mqtt = require('mqtt');

const uri = "mongodb+srv://saravanakumarrc:sarapower@cluster0.omi9lez.mongodb.net/SmartMeter?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const mqtt_client = mqtt.connect('mqtt://broker.hivemq.com')
    mqtt_client.subscribe('KNOW_16042023_VOL')
    mqtt_client.subscribe('KNOW_16042023_CUR')
    mqtt_client.subscribe('KNOW_16042023_POW')

    mqtt_client.on('message', (topic, message, packet) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}  : ${message.byteLength}`)

      MongoClient.connect(uri, function (err, client) {
        if (err) throw err;

        const db = client.db('SmartMeter');
        const collection = db.collection('readings');

        const document = { topic, reading: message.toString(), datetime: new Date() };
        collection.insertOne(document, function (err, result) {
          if (err) throw err;

          console.log('Document inserted:', result.insertedId);
          client.close();
        });
      });
    })

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
