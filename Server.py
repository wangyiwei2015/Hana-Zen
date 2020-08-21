import serial
import serial.tools.list_ports
import _thread
from flask import Flask, render_template
import socket
from time import sleep


class Hardware:
    s = serial.Serial()

    def __init__(self, port: str):
        self.s.port = port
        self.s.baudrate = 9600
        self.s.open()

    def invoke(self, data: str):
        self.s.write(data.encode())

    @classmethod
    def find(cls) -> list:
        availables = ["请选择设备"]
        for device in serial.tools.list_ports.comports():
            availables.append(device.device)
        return availables


class Manager:
    arduino = None
    port = None
    devices = []

    def __init__(self):
        self.devices = Hardware.find()

    def run(self, port: int):
        self.port = self.devices[port]
        _thread.start_new_thread(self.arduinoLoop, ())

    def arduinoLoop(self):
        try:
            self.arduino = Hardware(port=self.port)
        except:
            exit(-2)

    def invoke(self, data: str):
        self.arduino.invoke(data)

    def read(self) -> str:
        return self.arduino.s.read_all().decode().split('\r\n')[-2]


def main():
    manager = Manager()
    if len(manager.devices) < 2:
        print('No devices connected.')
        return -1
    i = 0
    for name in manager.devices:
        print(i, ' - ', name)
        i += 1
    print('\nEnter the id to connect:')
    i = int(input('Serial port '))
    while i < 1 or i >= len(manager.devices):
        i = int(input('Invalid, try again: '))
    manager.run(i)

    #sleep(1)
    #while True:
        #manager.read()
    '''
    from bottle import route, run, static_file
    from os import path
    @route('/main')
    def index():
        return static_file('index.html', path.dirname(__file__)+'/templates/')
    run(host='127.0.0.1', port=8080, debug=True)
    return
    '''

    web = Flask(__name__, static_folder='./templates')
    @web.route('/<path:arg>')
    def index(arg: str):
        if arg == 'read':
            print('client readed')
            return str(manager.read()), 200, [('Access-Control-Allow-Origin', '*')]
        if arg == 'test':
            return render_template('test.html')
        if arg == 'main':
            return render_template('index.html')

    web.run(host='0.0.0.0')


if __name__ == '__main__':
    main()