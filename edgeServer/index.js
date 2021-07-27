// ************** CHANGE THIS ************** //
var TOOL_NAME = "SpikeW"; // This is what is made on the webserver for the image target
let objectName = "spikeNodeW"; // This is the name of the folder in spatialToolbox in Documents
var complexity = "SpikeW"; // This will make sure the complexity level for each can be different

// Variables
var server = require("@libraries/hardwareInterfaces");
var settings = server.loadHardwareInterface(__dirname);

// MQTT WiFi-Communication
var mqtt = require("mqtt");
var options = {
    retain: true,
    qos: 1,
};

var read_topic = "read"; // Subscribe to this topic to read from Spike Sensors
var run_topic = "run"; // Publish to this topic what commands should be run on the Spike Prime
var initialize_topic = "initialize"; // Publish to this Topic every reset of the edge server to restart the code on the ESP

var colors = [
    "black",
    "violet",
    "blue",
    "cyan",
    "green",
    "yellow",
    "red",
    "white",
];
var distance, color, accelArray;
var runMotors = true;

exports.enabled = settings("enabled");
exports.configurable = true;

// MQTT Code //
var sensor_data = "";

client.on("connect", function () {
    console.log("connected  " + client.connected);
    console.log("Subscribing to the read Topic");
    client.subscribe(read_topic, {
        qos: 0
    });
    console.log("Subscribing to the init Topic");
    client.subscribe(initialize_topic, {
        qos: 2
    });
    // TODO Maybe have a reset topic that the ESP is subscribed to if there is ever a message the ESP will CTRL+D soft reboot
});

//handle incoming messages
client.on("message", function (topic, message, packet) {
    console.log("message is " + message);
    console.log("topic is " + topic);

    // Sort Sensor Data whenever there is a message from the read topic
    if (topic == read_topic) {
        try {
            sensor_data = JSON.parse(message);
            sortSensor(sensor_data);
        } catch (e) {}
    } else if (topic == initialize_topic) {
        connect_message = "Connect"; // The message the ESP sends to the init topic TODO update
        if (message == connect_message) {
            // Now we can run the actual program
        } else {
            port_data = JSON.parse(message);
            initializePorts(port_data);
        }
    }
});

client.on("error", function (error) {
    console.log("Error: " + error);
});

function publish(topic, msg, options) {
    console.log("publishing", msg, "to", topic);

    if (client.connected == true) {
        client.publish(topic, msg, options);
    }
}

if (exports.enabled) {
    // Code executed when your robotic addon is enabled
    setup();
    console.log("Spike: Settings loaded: ", objectName);
    console.log("Spike is connected");

    console.log("Attempting to Connect to MQTT Broker");
    var client = mqtt.connect("mqtt://192.168.50.10:1883", {
        clientId: TOOL_NAME
    });

    // Publish to the initialize topic to let the spike prime know to send port data
    publish(initialize_topic, "new instance", options);

    // Sets up the settings that can be customized on localhost:8080
    function setup() {
        exports.settings = {
            // Name for the object
            spikeName: {
                // CHANGED HERE --> Name is changed here
                value: settings("objectName", objectName),
                type: "text",
                default: objectName,
                disabled: false,
                helpText: "The name of the object that connects to this hardware interface.",
            },
            // Complexity level for the object
            spikeComplexity: {
                // CHANGED HERE --> Name is changed here
                value: settings("spikeComplexity", "intermediate"),
                type: "text",
                default: "intermediate",
                disabled: false,
                helpText: 'The complexity of the interface. "beginner" gives a few nodes, "intermediate" \
                gives more, and "advanced" gives full control. If you want super accurate sensor data, \
                you can use the complexity "sensor" to get faster sensor data in exchange for no motor control.',
            },
        };
    }

    // Get the settings that the user defined on localhost:8080
    objectName = exports.settings.spikeName.value;
    complexity = exports.settings.spikeComplexity.value.toLowerCase();
    complexity = complexity.replace(/\n/g, "");

    console.log("with complexity: " + complexity);

    server.addEventListener("reset", function () {
        settings = server.loadHardwareInterface(__dirname);
        setup();

        console.log("Spike: Settings loaded: ", objectName);
    });
}

// Starts the interface with the hardware
function startHardwareInterface() {
    console.log("Spike: Starting up");
    // Code to restart esp here
    server.enableDeveloperUI(true);

    // Adds sensor nodes to the object on the app
    server.addNode(objectName, TOOL_NAME, "stopMotors", "node", {
        x: 0,
        y: 125,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "color", "node", {
        x: 75,
        y: -175,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "distance", "node", {
        x: 0,
        y: -175,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "force", "node", {
        x: -75,
        y: -175,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "accelerometerX", "node", {
        x: -125,
        y: -100,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "accelerometerY", "node", {
        x: -125,
        y: -25,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "accelerometerZ", "node", {
        x: -125,
        y: 50,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "gyroscopeX", "node", {
        x: -200,
        y: -100,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "gyroscopeY", "node", {
        x: -200,
        y: -25,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "gyroscopeZ", "node", {
        x: -200,
        y: 50,
        scale: 0.175,
    });

    // Adds motor nodes to the object on the app
    server.addNode(objectName, TOOL_NAME, "motor1", "node", {
        x: 125,
        y: -100,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "motor2", "node", {
        x: 125,
        y: -25,
        scale: 0.175,
    });
    server.addNode(objectName, TOOL_NAME, "motor3", "node", {
        x: 125,
        y: 50,
        scale: 0.175,
    });

    // Removes nodes that are only found in beginner (otherwise they will stay spawned in when switching)
    server.removeNode(objectName, TOOL_NAME, "LED");
    server.removeNode(objectName, TOOL_NAME, "screen");
    server.removeNode(objectName, TOOL_NAME, "motors");

    if (complexity == "beginner" || complexity == "intermediate") {
        // Remove the accelerometer/gyroscope/FFT nodes
        server.removeNode(objectName, TOOL_NAME, "accelerometerX");
        server.removeNode(objectName, TOOL_NAME, "accelerometerY");
        server.removeNode(objectName, TOOL_NAME, "accelerometerZ");
        server.removeNode(objectName, TOOL_NAME, "gyroscopeX");
        server.removeNode(objectName, TOOL_NAME, "gyroscopeY");
        server.removeNode(objectName, TOOL_NAME, "gyroscopeZ");

        // Removing more nodes for beginner
        if (complexity == "beginner") {
            server.removeNode(objectName, TOOL_NAME, "color");
            server.removeNode(objectName, TOOL_NAME, "force");
            server.removeNode(objectName, TOOL_NAME, "motor1");
            server.removeNode(objectName, TOOL_NAME, "motor2");
            server.removeNode(objectName, TOOL_NAME, "motor3");

            // Adding LED and Screen nodes and moving the distance node
            server.addNode(objectName, TOOL_NAME, "screen", "node", {
                x: -125,
                y: -25,
                scale: 0.175,
            });
            server.addNode(objectName, TOOL_NAME, "LED", "node", {
                x: -125,
                y: 50,
                scale: 0.175,
            });
            server.addNode(objectName, TOOL_NAME, "motors", "node", {
                x: 125,
                y: -25,
                scale: 0.175,
            });
            server.moveNode(objectName, TOOL_NAME, "distance", 125, 50);
        }
        // Moving nodes for intermediate
        else {
            server.moveNode(objectName, TOOL_NAME, "color", -125, -100);
            server.moveNode(objectName, TOOL_NAME, "distance", -125, -25);
            server.moveNode(objectName, TOOL_NAME, "force", -125, 50);
        }
    }

    // Remove the motor nodes for sensor and moves other nodes
    if (complexity == "sensor") {
        server.removeNode(objectName, TOOL_NAME, "motor1");
        server.removeNode(objectName, TOOL_NAME, "motor2");
        server.removeNode(objectName, TOOL_NAME, "motor3");
        server.removeNode(objectName, TOOL_NAME, "stopMotors");
        server.moveNode(objectName, TOOL_NAME, "color", 125, -100);
        server.moveNode(objectName, TOOL_NAME, "distance", 125, -25);
        server.moveNode(objectName, TOOL_NAME, "force", 125, 50);

        // Sets the refresh rate for the sensors to 10
        sensorRefresh = 10;
    }

    // Moves nodes for advanced
    if (complexity == "advanced") {
        server.moveNode(objectName, TOOL_NAME, "color", 75, -175);
        server.moveNode(objectName, TOOL_NAME, "distance", 0, -175);
        server.moveNode(objectName, TOOL_NAME, "force", -75, -175);
    }

    // Listens for the stopMotors node
    server.addReadListener(
        objectName,
        TOOL_NAME,
        "stopMotors",
        function (data) {
            // When true, stop the Spike motors
            if (data.value == 1) {
                console.log("motors off");
                stopMotors();
            }
            // When false, allow the motors to run
            if (data.value == 0) {
                console.log("motors on");
                runMotors = true;
            }
        }
    );
    // TODO UPDATE VALUES TO CORRESPOND WITH HUB MODULE CHANGES
    // Listen for the motor1 node
    server.addReadListener(objectName, TOOL_NAME, "motor1", function (data) {
        // If we are running motors, then run the motor at the speed of the value sent to the node
        if (runMotors) {
            setTimeout(() => {
                publish(
                    run_topic,
                    "A" + ".start(" + Math.round(data.value) + ")\r\n",
                    options
                );
            }, 0);
        }
        // Else stop the motors
        else {
            stopMotors();
        }
    });

    // Listen for the motor2 node
    server.addReadListener(objectName, TOOL_NAME, "motor2", function (data) {
        // If we are running motors, then run the motor at the speed of the value sent to the node
        if (runMotors) {
            setTimeout(() => {
                publish(
                    run_topic,
                    "B" + ".start(" + Math.round(data.value) + ")\r\n",
                    options
                );
            }, 0);
        }
        // Else stop the motors
        else {
            stopMotors();
        }
    });

    // Listen for the motor3 node
    server.addReadListener(objectName, TOOL_NAME, "motor3", function (data) {
        // If we are running motors, then run the motor at the speed of the value sent to the node
        if (runMotors) {
            setTimeout(() => {
                publish(
                    run_topic,
                    "C" + ".start(" + Math.round(data.value) + ")\r\n",
                    options
                );
            }, 0);
        }
        // Else stop the motors
        else {
            stopMotors();
        }
    });

    // Listens for the motors node (used in beginner mode to control all motors)
    server.addReadListener(objectName, TOOL_NAME, "motors", function (data) {
        // If we are running motors, then run all the motors at the speed of the value sent to the node
        if (runMotors) {
            if (motor1 != "none") {
                setTimeout(() => {
                    publish(
                        run_topic,
                        motor1 + ".start(" + Math.round(-data.value) + ")\r\n",
                        options
                    );
                }, 0);
            }
            if (motor2 != "none") {
                setTimeout(() => {
                    publish(
                        run_topic,
                        motor2 + ".start(" + Math.round(data.value) + ")\r\n",
                        options
                    );
                }, 0);
            }
            if (motor3 != "none") {
                setTimeout(() => {
                    publish(
                        run_topic,
                        motor3 + ".start(" + Math.round(data.value) + ")\r\n",
                        options
                    );
                }, 0);
            }
        }
        // Else stop the motors
        else {
            stopMotors();
        }
    });

    // Listen for the screen node (beginner mode only)
    server.addReadListener(objectName, TOOL_NAME, "screen", function (data) {
        setTimeout(() => {
            publish(
                run_topic,
                'hub.display.show("' + data.value + '")\r\n',
                options
            );
        }, 0);
    });

    // Listen for the LED node (beginner mode only)
    server.addReadListener(objectName, TOOL_NAME, "LED", function (data) {
        setTimeout(() => {
            publish(
                run_topic,
                "hub.led(" + data.value + ")\r\n",
                options
            );
        }, 0);
    });

    updateEvery(0, 10);
}

// Gets the port ordering from the Spike Prime, which initialized itself
function initializePorts(port_data) {
    ports = port_data
    var [motor1, motor2, motor3, distanceSensor, colorSensor, forceSensor] = ports;
}

// parse the sensor data taken from the read topic as a JSON obj to the server map
async function sortSensor(sensor_data) {
    // TODO Maybe check to see if the sensors are attached by looking at port return
    // The variables (may?) below need to be converted into strings to be mapped to the server
    distance = sensor_data.distance;
    color = sensor_data.color;
    force = sensor_data.force;

    if (typeof distance != undefined) {
        server.write(
            objectName,
            TOOL_NAME,
            "distance",
            server.map(distance, 0, 150, 0, 150),
            "f"
        );
    }

    if (typeof color != undefined) {
        server.write(
            objectName,
            TOOL_NAME,
            "color",
            color,
            "f"
        );
    }

    if (typeof force != undefined) {
        server.write(
            objectName,
            TOOL_NAME,
            "force",
            server.map(force, 0, 10, 0, 10),
            "f"
        );
    }

    accelArray = sensor_data.accelArray;
    if (typeof accelArray != undefined) {
        // TODO Change SPIKE CODE TO MAKE ONE ACC VAL/KEY THAT IS AN ARRAY
        processAccelerometer(accelArray);
    } else {
        console.log("Something has gone terribly wrong");
    }
}

// Processes the accelerometer/gyroscopic data and writes it to the nodes
function processAccelerometer(accelArr) {
    server.write(
        objectName,
        TOOL_NAME,
        "accelerometerX",
        server.map(accelArr[0], -5000, 5000, -5000, 5000),
        "f"
    );
    server.write(
        objectName,
        TOOL_NAME,
        "accelerometerY",
        server.map(accelArr[1], -5000, 5000, -5000, 5000),
        "f"
    );
    server.write(
        objectName,
        TOOL_NAME,
        "accelerometerZ",
        server.map(accelArr[2], -5000, 5000, -5000, 5000),
        "f"
    );
    server.write(
        objectName,
        TOOL_NAME,
        "gyroscopeX",
        server.map(accelArr[3], -5000, 5000, -5000, 5000),
        "f"
    );
    server.write(
        objectName,
        TOOL_NAME,
        "gyroscopeY",
        server.map(accelArr[4], -5000, 5000, -5000, 5000),
        "f"
    );
    server.write(
        objectName,
        TOOL_NAME,
        "gyroscopeZ",
        server.map(accelArr[5], -5000, 5000, -5000, 5000),
        "f"
    );
}

// Send commands to stop all the motors
function stopMotors() {
    runMotors = false;
    if (motor1 != "none") {
        publish(run_topic, "motor1.pwm(0)\r\n", options);
    }
    if (motor2 != "none") {
        publish(run_topic, "motor2.pwm(0)\r\n", options);
    }
    if (motor3 != "none") {
        publish(run_topic, "motor3.pwm(0)\r\n", options);
    }
}

// Updates readListeners
function updateEvery(i, time) {
    setTimeout(() => {
        updateEvery(++i, time);
    }, time);
}

// Wait for the connection to be established with the Spike Prime before starting up
// TODO FIGURE OUT HOW TO WAIT FOR MESSAGE FROM ESP TO START SENDING DATA BACK AND FORTH
server.addEventListener("initialize", function () {
    if (exports.enabled)
        setTimeout(() => {
            startHardwareInterface();
        }, 10000);
});

// Stop motors on server shutdown
server.addEventListener("shutdown", function () {
    stopMotors();
});
