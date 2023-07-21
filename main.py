from flask import Flask
from os import environ as env

app = Flask(__name__)

@app.route('/')
def index():
    return 'Corriendo servidor' 

app.run(host='0.0.0.0', port=5000)