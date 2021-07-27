# Complete project details at https://RandomNerdTutorials.com
import random
import ujson as json

#response = {"AccelX" : random.getrandbits(10), "AccelY" : random.getrandbits(10), "AccelZ" : random.getrandbits(10)}
        
def sub_cb(topic, msg):
    #print("callback")
    if topic == b'run' :
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
    uos.dupterm(None, 1)
    reply = b'sss'
    response = None
    
    while (response == None):
        response = uart.readline()
        print(response)
        
    uos.dupterm(uart, 1)
    
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

while True:
    dataBytes = read()
    
    if (dataBytes == b'\x03\r\n'):
        break
        print("got a ctrl+c")
    # Put code to exit while loop is 
    client.publish(MQTT_CONFIG["PUB_TOPIC1"], dataBytes)
    client.check_msg()
    utime.sleep(1)
    


