# Complete project details at https://RandomNerdTutorials.com

def web_page():
  if led.value() == 0:
    gpio_state="ON"
  else:
    gpio_state="OFF"
  
  html  = '<html><head> <title>ESP Web Server</title> <meta name="viewport" content="width=device-width, initial-scale=1">'
  html += '<link rel="icon" href="data:,"> <style>html{font-family: Helvetica; display:inline-block; margin: 0px auto;'
  html += 'text-align: center;} h1{color: rgb(15, 51, 118); padding: 2vh;}p{font-size: 1.5rem;}.button{display: inline-block;' 
  html += 'background-color: rgb(231, 189, 59); border: none; border-radius: 4px; color: white; padding: 16px 40px;'
  html += 'text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}'
  html += '.button2{background-color: rgb(66, 134, 244);}</style></head><body> <h1>ESP Web Server</h1>'
  html += '<p>GPIO state: <strong>' + gpio_state + '</strong></p><p><a href="/?led=on"><button class="button">ON</button></a></p>'
  html += '<p><a href="/?led=off"><button class="button button2">OFF</button></a></p></body></html>'
  
  return html

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

while True:
  conn, addr = s.accept()
  print('Got a connection from %s' % str(addr))
  request = conn.recv(1024)
  request = str(request)
  print('Content = %s' % request)
  led_on = request.find('/?led=on')
  led_off = request.find('/?led=off')
  if led_on == 6:
    print('LED ON')
    led.value(0)
  if led_off == 6:
    print('LED OFF')
    led.value(1)
  response = web_page()
  conn.send('HTTP/1.1 200 OK\n')
  conn.send('Content-Type: text/html\n')
  conn.send('Connection: close\n\n')
  conn.sendall(response)
  conn.close()
  
  
  