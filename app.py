from flask import Flask, render_template
import socket
import os

hostname = socket.gethostname() if 'HOSTNAME' not in os.environ else os.environ['HOSTNAME']

app = Flask(__name__)

solicitudes = 0

@app.route('/')
def index():
    return render_template('index.html', hostname=hostname, solicitudes=solicitudes)

app.run(host='0.0.0.0', port=5000)