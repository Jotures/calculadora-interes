document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result');
    const finalAmountEl = document.getElementById('final-amount');
    const totalProfitEl = document.getElementById('total-profit');

    calculateBtn.addEventListener('click', () => {
        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const time = parseFloat(document.getElementById('time').value);

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal < 0 || rate < 0 || time < 0) {
            alert('Por favor, ingresa valores válidos y positivos.');
            return;
        }

        // Formula: A = P(1 + r/100)^t
        // Assuming annual compounding (n=1)
        const amount = principal * Math.pow((1 + rate / 100), time);
        const profit = amount - principal;

        // Format currency
        const formatter = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        finalAmountEl.textContent = formatter.format(amount);
        totalProfitEl.textContent = `+ ${formatter.format(profit)}`;

        resultContainer.classList.remove('hidden');

        // Chart Logic
        renderChart(principal, rate, time);
    });

    let growthChart = null;

    function renderChart(principal, rate, time) {
        const ctx = document.getElementById('growthChart').getContext('2d');
        const labels = [];
        const data = [];

        for (let i = 0; i <= time; i++) {
            labels.push(`Año ${i}`);
            const amount = principal * Math.pow((1 + rate / 100), i);
            data.push(amount);
        }

        if (growthChart) {
            growthChart.destroy();
        }

        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Crecimiento del Capital',
                    data: data,
                    borderColor: '#10b981', // Neon Green / Emerald 500
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#94a3b8' // Text Secondary
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#334155' // Input BG / Darker grid
                        }
                    },
                    y: {
                        ticks: {
                            color: '#94a3b8',
                            callback: function (value) {
                                return 'S/ ' + value;
                            }
                        },
                        grid: {
                            color: '#334155'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
});
