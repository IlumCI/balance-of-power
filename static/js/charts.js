// Connect to the WebSocket server
var socket = io.connect('http://' + document.domain + ':' + location.port);

// Function to update both charts with new data
function updateCharts(data) {
    towerChart.data.datasets[0].data = [data.military, data.clergy, data.capitalists, data.workers];
    towerChart.update();
    pieChart.data.datasets[0].data = [data.military, data.clergy, data.capitalists, data.workers];
    pieChart.update();
}

// Fetch initial power balance data from the Flask backend and render charts
fetch('/api/power-balance')
    .then(response => response.json())
    .then(data => {
        // Tower Chart (Bar Chart)
        const ctxTower = document.getElementById('towerChart').getContext('2d');
        window.towerChart = new Chart(ctxTower, {
            type: 'bar',
            data: {
                labels: ['Military', 'Clergy', 'Capitalists', 'Workers'],
                datasets: [{
                    label: 'Power %',
                    data: [data.military, data.clergy, data.capitalists, data.workers],
                    backgroundColor: ['#f38b4a', '#56d798', '#4ab3f4', '#9966ff']
                }]
            }
        });

        // Pie Chart
        const ctxPie = document.getElementById('pieChart').getContext('2d');
        window.pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: ['Military', 'Clergy', 'Capitalists', 'Workers'],
                datasets: [{
                    data: [data.military, data.clergy, data.capitalists, data.workers],
                    backgroundColor: ['#f38b4a', '#56d798', '#4ab3f4', '#9966ff']
                }]
            }
        });

        // Update the charts with the initial data
        updateCharts(data);
    });

// Listen for power balance updates from the server via WebSocket
socket.on('updatePowerBalance', function(data) {
    updateCharts(data);
});

// Listen for new demands
socket.on('newDemand', function(demands) {
    const inbox = document.getElementById('inbox');
    inbox.innerHTML = '';  // Clear existing inbox

    demands.forEach(function(demand, index) {
        const demandDiv = document.createElement('div');
        demandDiv.classList.add('demand');
        demandDiv.innerHTML = `<span>${demand}</span>
                               <button onclick="processDemand('${demand.split(' ')[2].toLowerCase()}', 'pass')">Pass</button>
                               <button onclick="processDemand('${demand.split(' ')[2].toLowerCase()}', 'veto')">Veto</button>`;
        inbox.appendChild(demandDiv);
    });
});

// Send a demand as a branch leader
function sendDemand(branch) {
    fetch(`/api/send-demand/${branch}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => console.log(data));
}

// Process a demand (pass or veto)
function processDemand(branch, action) {
    socket.emit('processDemand', { branch: branch, action: action });
}
