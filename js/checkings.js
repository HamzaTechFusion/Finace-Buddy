document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
    }

    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({ date: new Date().toISOString(), type, fromAccount, toAccount, amount });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    document.getElementById("depositButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("depositAmount").value);
        if (amount > 0) {
            balance += amount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Deposit", "Checkings", "-", amount);
            updateBalanceDisplay();
        }
    });

    document.getElementById("withdrawButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("withdrawAmount").value);
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Withdrawal", "Checkings", "-", amount);
            updateBalanceDisplay();
        }
    });

    document.getElementById("transferButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("transferAmount").value);
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            const savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
            localStorage.setItem("checkingsBalance", balance);
            localStorage.setItem("savingsBalance", savingsBalance + amount);
            logTransaction("Transfer", "Checkings", "Savings", amount);
            updateBalanceDisplay();
        }
    });

    updateBalanceDisplay();
});
