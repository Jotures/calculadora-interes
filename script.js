document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result');
    const finalAmountEl = document.getElementById('final-amount');
    const totalProfitEl = document.getElementById('total-profit');
    const errorMessageEl = document.getElementById('error-message');
    const inputs = document.querySelectorAll('input');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // Load data from LocalStorage
    const loadData = () => {
        const savedPrincipal = localStorage.getItem('principal');
        const savedRate = localStorage.getItem('rate');
        const savedTime = localStorage.getItem('time');

        if (savedPrincipal && savedRate && savedTime) {
            document.getElementById('principal').value = savedPrincipal;
            document.getElementById('rate').value = savedRate;
            document.getElementById('time').value = savedTime;

            // Auto-calculate
            calculateBtn.click();
        }
    };

    calculateBtn.addEventListener('click', () => {
        // Reset errors
        errorMessageEl.classList.add('hidden');
        errorMessageEl.textContent = '';
        inputs.forEach(input => input.classList.remove('input-error'));
        resultContainer.classList.add('hidden');

        const principalInput = document.getElementById('principal');
        const rateInput = document.getElementById('rate');
        const timeInput = document.getElementById('time');

        const principal = parseFloat(principalInput.value);
        const rate = parseFloat(rateInput.value);
        const time = parseFloat(timeInput.value);

        let isValid = true;
        let errorMsg = '';

        if (isNaN(principal) || principal < 0) {
            principalInput.classList.add('input-error');
            isValid = false;
            errorMsg = 'El capital inicial no puede ser negativo.';
        }

        if (isNaN(rate) || rate < 0) {
            rateInput.classList.add('input-error');
            isValid = false;
            errorMsg = errorMsg || 'La tasa de interés no puede ser negativa.';
        }

        if (isNaN(time) || time <= 0) {
            timeInput.classList.add('input-error');
            isValid = false;
            errorMsg = errorMsg || 'El tiempo de inversión debe ser mayor a 0.';
        }

        if (!isValid) {
            errorMessageEl.textContent = errorMsg;
            errorMessageEl.classList.remove('hidden');
            return;
        }

        // Save to LocalStorage
        localStorage.setItem('principal', principal);
        localStorage.setItem('rate', rate);
        localStorage.setItem('time', time);

        // Formula: A = P(1 + r/100)^t
        // Assuming annual compounding (n=1)
        const amount = principal * Math.pow((1 + rate / 100), time);
        const profit = amount - principal;

        finalAmountEl.textContent = formatCurrency(amount);
        totalProfitEl.textContent = `+ ${formatCurrency(profit)}`;

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
                                    label += formatCurrency(context.parsed.y);
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
                                return formatCurrency(value);
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

    // Initialize
    loadData();

    // Reset Logic
    const resetBtn = document.getElementById('reset-btn');
    const toast = document.getElementById('toast');

    resetBtn.addEventListener('click', () => {
        // Clear inputs
        document.getElementById('principal').value = '';
        document.getElementById('rate').value = '';
        document.getElementById('time').value = '';

        // Clear LocalStorage
        localStorage.clear();

        // Hide results
        resultContainer.classList.add('hidden');

        // Destroy Chart
        if (growthChart) {
            growthChart.destroy();
            growthChart = null;
        }

        // Reset errors
        errorMessageEl.classList.add('hidden');
        inputs.forEach(input => input.classList.remove('input-error'));

        // Show Toast
        showToast();
    });

    function showToast() {
        toast.classList.remove('hidden');
        // Trigger reflow
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    // Tab Switching Logic
    const tabBtnCompound = document.getElementById('tab-btn-compound');
    const tabBtnAmortization = document.getElementById('tab-btn-amortization');
    const sectionInteres = document.getElementById('seccion-interes');
    const sectionAmortization = document.getElementById('seccion-amortizacion');

    function switchTab(tabId) {
        // Update Buttons
        if (tabId === 'compound') {
            tabBtnCompound.classList.add('active');
            tabBtnAmortization.classList.remove('active');

            sectionInteres.classList.add('active');
            sectionInteres.classList.remove('hidden');

            sectionAmortization.classList.remove('active');
            sectionAmortization.classList.add('hidden');
        } else {
            tabBtnAmortization.classList.add('active');
            tabBtnCompound.classList.remove('active');

            sectionAmortization.classList.add('active');
            sectionAmortization.classList.remove('hidden');

            sectionInteres.classList.remove('active');
            sectionInteres.classList.add('hidden');
        }
    }

    tabBtnCompound.addEventListener('click', () => switchTab('compound'));
    tabBtnAmortization.addEventListener('click', () => switchTab('amortization'));
});
