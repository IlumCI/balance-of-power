// Get power balance data from the Flask backend
fetch('/api/power-balance')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Check the data format

        // Tower Chart (Bar Chart)
        const ctxTower = document.getElementById('towerChart').getContext('2d');
        const towerChart = new Chart(ctxTower, {
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
        const pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: ['Military', 'Clergy', 'Capitalists', 'Workers'],
                datasets: [{
                    data: [data.military, data.clergy, data.capitalists, data.workers],
                    backgroundColor: ['#f38b4a', '#56d798', '#4ab3f4', '#9966ff']
                }]
            }
        });
    });
