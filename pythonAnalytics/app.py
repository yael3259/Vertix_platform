from flask import Flask
from flask_cors import CORS
from API import api

app = Flask(__name__)

# CORS(app, origins=["http://localhost:3000"])
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(api, url_prefix="/api")