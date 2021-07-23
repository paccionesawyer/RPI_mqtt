var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://<RPI_IPADDRESS>')

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log("message: " + message.toString())
  client.end()
})