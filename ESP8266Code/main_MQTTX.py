import random
import ujson as json

sub_topics = []
pub_topics = []
messages = []

global client

def sub_cb(topic, msg):
    print(msg, topic)
    # if topic == MQTT_CONFIG["SUB_TOPIC1"] :
    #     msgStr = msg.decode('utf-8')
    #     write(msgStr)
    #     #print("MsgSTr", msgStr)
     
    # elif topic == MQTT_CONFIG["SUB_TOPIC2"] : 
    #     pass

def connect_and_subscribe():
    client = MQTTClient(client_id = MQTT_CONFIG["CLIENT_ID"], server = MQTT_CONFIG["MQTT_BROKER"], port = MQTT_CONFIG["PORT"], user = MQTT_CONFIG["USER"], password = MQTT_CONFIG["PASS"])
    client.set_callback(sub_cb)
    client.connect()
    print('Connected to %s MQTT broker' % (MQTT_CONFIG["MQTT_BROKER"]), end=" ")
    subscribe(client)
    setup_publish(client)
    return client

def subscribe(client):
    for key in MQTT_CONFIG:
        if key.startswith("SUB") and str(type(MQTT_CONFIG[key])) == "<class 'bytes'>" and MQTT_CONFIG[key] != b'':
            client.subscribe(MQTT_CONFIG[key])
            print('subscribed to %s topic' % (MQTT_CONFIG[key]), end = ", ")
            sub_topics.append(MQTT_CONFIG[key])
    print()

def restart_and_reconnect():
    print('Failed to connect to MQTT broker. Reconnecting...')
    utime.sleep(10)
    #machine.reset()

def setup_publish(client):
    for key in MQTT_CONFIG:
        if key.startswith("PUB") and str(type(MQTT_CONFIG[key])) == "<class 'bytes'>" and MQTT_CONFIG[key] != b'':
            pub_topics.append(MQTT_CONFIG[key])
 
    publish_all(client, "Connected to %s" % MQTT_CONFIG['CLIENT_ID'])

def publish_all(client, msg):
    for topic in pub_topics:
        client.publish(topic, msg)

client = connect_and_subscribe()