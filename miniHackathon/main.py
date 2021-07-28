# Complete project details at https://RandomNerdTutorials.com
import random
import ujson as json

#response = {"AccelX" : random.getrandbits(10), "AccelY" : random.getrandbits(10), "AccelZ" : random.getrandbits(10)}

def sub_cb(topic, msg):
    print("callback")
    if topic == MQTT_CONFIG["SUB_TOPIC1"] :
        msgStr = msg.decode('utf-8')
        #print(type(msgStr))
        write(msgStr)
        #client.publish(MQTT_CONFIG["PUB_TOPIC1"], msg)
    elif topic == b'init' : 
        pass

def connect_and_subscribe():
    client = MQTTClient(client_id = MQTT_CONFIG["CLIENT_ID"], server = MQTT_CONFIG["MQTT_BROKER"], port = MQTT_CONFIG["PORT"])
    client.set_callback(sub_cb)
    client.connect()
    client.subscribe(MQTT_CONFIG["SUB_TOPIC1"])
    print('Connected to %s MQTT broker, subscribed to %s topic' % (MQTT_CONFIG["MQTT_BROKER"], MQTT_CONFIG["SUB_TOPIC1"]))
    return client

def restart_and_reconnect():
    print('Failed to connect to MQTT broker. Reconnecting...')
    utime.sleep(10)
    machine.reset()

def read ():
    reply = b'sss'
    response = None

    while (response == None):
        response = uart.readline()
        #print(response)

    return response

def write(msg):
    uart.write(msg)

LED.off()

try:
    client = connect_and_subscribe()
except OSError as e:
    restart_and_reconnect()

LED.on()

client.publish(MQTT_CONFIG["PUB_TOPIC1"], b'Connected: ' + MQTT_CONFIG["CLIENT_ID"])
#uos.dupterm(None, 1) # Turn the REPL off to be able to read a message into a variable
while True:

    #dataBytes = read()
    #write(">>>")

    #if (dataBytes == b'\x03\r\n'):
    #    uos.dupterm(uart, 1) # Turn the REPL back on
    #    print("got a ctrl+c")
    #    break

    # Put code to exit while loop is 
    client.publish(MQTT_CONFIG["PUB_TOPIC1"], "hello from Sawyer")
    client.check_msg()
    utime.sleep(1)

