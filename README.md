# RPI_mqtt

## Installing Mosquitto on Raspberry Pi
Mosquitto is an open source (EPL/EDL licensed) message broker that implements the MQTT protocol versions 5.0, 3.1.1 and 3.1. To install it on the raspberry Pi I followed these [instructions](https://randomnerdtutorials.com/how-to-install-mosquitto-broker-on-raspberry-pi/) which are repeated below.

    pi@raspberry:~ $ sudo apt update -y && sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt dist-upgrade -y && sudo apt-get autoremove -y && sudo apt-get clean -y && sudo apt-get autoclean -y && sudo reboot

    pi@raspberry:~ $ sudo apt install -y mosquitto mosquitto-clients
    
Now to check if mosquitto was succesfully installed we can attempt to check the version 

    pi@raspberry:~ $ mosquitto -v

In order to connect clients to the broker we need to know the IP Address of the Raspberry Pi. To retrieve your Raspberry Pi IP address, type the next command in your Terminal window:

    pi@raspberry:~ $ hostname -I

## Testing Node.js Mqtt Client to Mosquitto Broker

Now let's test our broker by first running it in the background as a daemon.

    pi@raspberry:~ $ mosquitto -d

Second, install the required node packages, either by typing 

    npm install
    
which will install the packages included in *package-lock.json* or manually by running 

    npm install mqtt --save

Then you should be able to run our node client

    node node_client.js

To do more testing of the mosquitto broker follow the instructions [here](https://randomnerdtutorials.com/testing-mosquitto-broker-and-client-on-raspbbery-pi/).
