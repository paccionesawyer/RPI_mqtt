import hub, utime, ujson
from Backpack_Code import Backpack

# Setup Dongle
dongle = Backpack(hub.port.F, verbose = False) 

def main():
    # This Messages can be defined in a function on the Spike
    msg = "Message From Spike"

    # dongle.ask() sends the message to ESP uart. In this setup the ESP's REPL has been turned off 
    response = dongle.ask(msg)

    # dongle.ask() is blocking and waits for ">>>"
    response = response.replace('>','')
    
    print("response:", response)
    if response == '' or response == ">>>":
        response = dongle.read()
    
while True:
    main()
    utime.sleep(0.5)
    
  