from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

# Initialize Flask app and SocketIO
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

# Power balance data (initially all 50%)
power_balance = {
    "military": 50,
    "clergy": 50,
    "capitalists": 50,
    "workers": 50
}

# List to store incoming demands
demands = []

# Send the updated power balance to all clients in real time
def broadcast_power_balance():
    socketio.emit('updatePowerBalance', power_balance)

# President's dashboard route
@app.route('/')
def index():
    return render_template('index.html')

# API route to get the current power balance
@app.route('/api/power-balance')
def get_power_balance():
    return jsonify(power_balance)

# WebSocket route to handle passing or vetoing demands
@socketio.on('processDemand')
def handle_demand(data):
    branch = data['branch']
    action = data['action']  # Either 'pass' or 'veto'

    # Modify power balance based on action
    if action == 'pass':
        power_balance[branch] += 10  # Increase power if passed
    elif action == 'veto':
        power_balance[branch] -= 10  # Decrease power if vetoed

    # Ensure the power balance stays within the limits (0-100)
    power_balance[branch] = max(0, min(power_balance[branch], 100))

    # Broadcast updated power balance to all clients
    broadcast_power_balance()

# Route for branch leaders to send a demand
@app.route('/api/send-demand/<branch>', methods=['POST'])
def send_demand(branch):
    # Add demand to the list
    demands.append(f"Demand from {branch}: Increase Power")
    
    # Broadcast the new demand to all clients (especially the President)
    socketio.emit('newDemand', demands)
    
    return jsonify({"status": "Demand Sent"})

if __name__ == '__main__':
    socketio.run(app, debug=True)
