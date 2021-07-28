# Instructions for the mini Hackathon

## Step 1: Setup the ESP

1. Download the python files from the above program
2. Save the files into the a folder your Labview IDE has access to
3. Connect your ESP8266 w/ micropython to a USB port on your computer and access it through the Labview IDE
4. Edit the sub_topic and pub_topic in your main.py (TBD: maybe "sub_sawyer", "pub_sawyer")
5. Save them onto your ESP8266 using the button with the blue arrow at the top of the screen
6. Done with the ESP

## Step 2: Setup the Spike

1. Now connect your spike prime to the USB port and access it through the labview IDE, 
2. Change the the arguement of dongle.ask() in main to send whatever you want to the PUB_TOPIC
3. The response to dongle.read() will be whatever has been sent to your SUB_TOPIC 
4. Do with this what you may

## Step 3: Edit the NodeJS file 

1. Subscribe to the topcis you want to subscribe to and publish to the topics you want to as you see fit
