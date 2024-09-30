from flask import Flask, render_template, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Power balance data (initially all 50%)
power_balance = {
    "military": 50,
    "clergy": 50,
    "capitalists": 50,
    "workers": 50
}

# Route to serve the main web page
@app.route('/')
def index():
    return render_template('index.html')

# API route to get current power balance
@app.route('/api/power-balance')
def get_power_balance():
    return jsonify(power_balance)

if __name__ == '__main__':
    app.run(debug=True)
