import utime
from umqtt.simple import MQTTClient
import ubinascii
import machine
import network
import esp
import uos
import gc

from sensitive_data import sensitive_data
esp.osdebug(None)
gc.collect()

# Define uart and turn the REPL on
uart = machine.UART(0, 115200, timeout = 50)
uos.dupterm(uart, 1)

WIFI_CONFIG = {
    # Configuration Details for the Edge Server
    "SSID" : sensitive_data["RPI_SSID"],
    "PASS" : sensitive_data["RPI_PASS"]
}

MQTT_CONFIG = {
    # Configuration details of the MQTT Broker
    "MQTT_BROKER" : sensitive_data["RPI_IP"],
    "USER" : "",
    "PASS" : "",
    "PORT" : 1883,
    "PUB_TOPIC1" : b'hub_data1',
    "PUB_TOPIC2" : b'',
    "SUB_TOPIC1" : b'commands1',
    "SUB_TOPIC2" : b'',
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
    utime.sleep(1)
    connect_counter += 1

print('WiFi Connection successful:', end=" ")
print(station.ifconfig())
