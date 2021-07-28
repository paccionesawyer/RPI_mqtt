import utime
from umqtt.simple import MQTTClient
import ubinascii
import machine
import micropython
import network
import esp
esp.osdebug(None)
import gc
gc.collect()

# Import Pin to control the LEDs
from machine import Pin

import uos, machine
uart = machine.UART(0, 115200, timeout = 50)
uos.dupterm(uart, 1)

# set the LED Pin
LED = Pin(2, Pin.OUT)

WIFI_CONFIG = {
    "SSID" : "RPiSpatialToolbox_EdgeWifi",
    "PASS" : "Vuforia123"
}

MQTT_CONFIG = {
    # Configuration details of the MQTT Broker
    "MQTT_BROKER" : "192.168.50.10",
    "USER" : "",
    "PASS" : "",
    "PORT" : 1883,
    "PUB_TOPIC1" : b'read',
    "SUB_TOPIC1" : b'run',
    "CLIENT_ID" : b'esp_8266-' + ubinascii.hexlify(machine.unique_id())
}

station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(WIFI_CONFIG["SSID"], WIFI_CONFIG["PASS"])

connect_counter = 0

print("Waiting to Connect to Wifi")
while station.isconnected() == False:
    if connect_counter > 10:
        connect_counter = 0
        print("Trying Again")
        station.active(True)
        station.connect(WIFI_CONFIG["SSID"], WIFI_CONFIG["PASS"])
        m = station.ifconfig()
    utime.sleep(1)
    connect_counter += 1

print('WiFi Connection successful:', end=" ")
print(station.ifconfig())

