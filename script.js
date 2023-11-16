let chart;
let dbValue;

function getDbValue() {
    dbValue = parseFloat(document.getElementById("dbInput").value);
}

function calculateMaxVolume() {
    const abValue = parseFloat(document.getElementById("abInput").value);
    const bcMaxValue = parseFloat(document.getElementById("bcInput").value);
    const unitChoice = document.getElementById("unitChoice").value;

    getDbValue();

    function f(x) {
        return -3/4 * x**2 + 6*x;
    }

    function findCriticalPoints() {
        const criticalPoints = [];
        for (let x = 0; x <= bcMaxValue / 2; x += 0.01) {
            criticalPoints.push(x);
        }
        return criticalPoints;
    }

    function findMaxVolumeSolution(criticalPoints, value) {
        let maxVolume = -Infinity;
        let maxX;

        for (const x of criticalPoints) {
            const currentVolume = f(x);
            if (currentVolume > maxVolume) {
                maxVolume = currentVolume;
                maxX = x;
            }
        }

        return { maxX, maxVolume };
    }

    const { maxX: maxXAB, maxVolume: maxVolumeAB } = findMaxVolumeSolution(findCriticalPoints(), abValue);
    const { maxX: maxXDB, maxVolume: maxVolumeDB } = findMaxVolumeSolution(findCriticalPoints(), dbValue);

    const maxX = maxVolumeAB > maxVolumeDB ? maxXAB : maxXDB;
    const maxVolume = maxVolumeAB > maxVolumeDB ? maxVolumeAB : maxVolumeDB;

    const ladoCaixa = (abValue - 2 * maxX);
    const alturaCaixa = maxX;
    const larguraCaixa = maxVolumeAB > maxVolumeDB ? bcMaxValue : dbValue;

    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = `
        <p>Dimensões que maximizam o volume:</p>
        <p>Volume máximo: ${maxVolume.toFixed(3)} ${unitChoice}³</p>
    `;
    function updateChart(maxX, maxVolume, abValue) {
        const ctx = document.getElementById('myChart').getContext('2d');
        const alturaValues = Array.from({ length: 100 }, (_, i) => i * (bcMaxValue / 2) / 100);
    
        if (chart) {
            chart.destroy();
        }
    
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: alturaValues,
                datasets: [{
                    label: 'Volume da Caixa',
                    data: alturaValues.map(altura => f((abValue - 2 * altura) / 2)),
                    borderColor: 'blue',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Altura (m)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Volume'
                        }
                    }
                }
            }
        });
    
        const highestPointIndex = alturaValues.indexOf(Math.max(...alturaValues));
        const highestPoint = {
            x: alturaValues[highestPointIndex],
            y: maxVolume
        };
    
        chart.data.datasets.push({
            label: 'Ponto Mais Alto',
            data: [highestPoint],
            pointBackgroundColor: 'red',
            pointRadius: 5,
            pointHoverRadius: 8,
            type: 'scatter'
        });
    
        chart.update();
    }

    updateChart(maxX, maxVolume, abValue);
}

calculateMaxVolume();
