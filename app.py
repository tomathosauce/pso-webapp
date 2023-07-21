from flask import Flask, render_template
import socket

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', hostname=socket.gethostname())

app.run(host='0.0.0.0', port=5000)