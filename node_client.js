var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.0.0.32', { clientId: "mqttjs01" })
console.log("connected flag  " + client.connected);

client.on("connect", function () {
	console.log("connected  " + client.connected);
});

//handle incoming messages
client.on("message", function (topic, message, packet) {
	console.log("message is " + message);
	console.log("topic is " + topic);
});

client.on("error", function (error) {
	console.log("Error: " + error);
});

function publish(topic, msg, options) {
	console.log("publishing", msg);

	if (client.connected == true) {
		client.publish(topic, msg, options);
	}
}

var options = {
	retain: true,
	qos: 1,
};

var topic1 = "notification";
var topic2 = "hello";

var message = "Message From Node.js";

console.log("subscribing to Topic1");
client.subscribe(topic1, { qos: 1 }); //single topic
console.log("subscribing to Topic2");
client.subscribe(topic2, { qos: 1 }); //single topic
var timer_id = setInterval(function () {
	publish(topic1, message, options);
}, 10000);
