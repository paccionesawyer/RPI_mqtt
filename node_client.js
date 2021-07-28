var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.50.10:1883', { clientId: "mqttjs01" })
console.log("connected flag  " + client.connected);
var sensor_data = ""


client.on("connect", function () {
	console.log("connected  " + client.connected);
	console.log("subscribing to ReadTopic");
	client.subscribe(read_topic, {
        qos: 1
    });
});

//handle incoming messages
client.on("message", function (topic, message, packet) {
	console.log("message is " + message);
	try {
		sensor_data = JSON.parse(message)
		console.log(sensor_data.AccelY)
	} catch (e) {}
	
	console.log("topic is " + topic);
});

client.on("error", function (error) {
	console.log("Error: " + error);
});

function publish(topic, msg, options) {
	console.log("publishing", msg, "to", topic);

	if (client.connected == true) {
		client.publish(topic, msg, options);
	}
};

var options = {
	retain: true,
	qos: 1,
};

var read_topic = "hub_data1";
var run_topic = "commands1";
var sensor_refresh = 100;

var timer_id = setInterval(function () {
	var speed = Math.floor(Math.random()*80)
	publish(run_topic, "motor1.pwm(s)".replace('s', speed.toString()), options);
	//publish(sub_Chris, "motor1.pwm(s)".replace('s', speed.toString()), options);
}, 10000);

