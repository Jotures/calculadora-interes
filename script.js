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
    });
});
