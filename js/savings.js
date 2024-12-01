document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

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
            localStorage.setItem("savingsBalance", balance);
            logTransaction("Deposit", "Savings", "-", amount);
            updateBalanceDisplay();
        }
    });

    document.getElementById("withdrawButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("withdrawAmount").value);
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            localStorage.setItem("savingsBalance", balance);
            logTransaction("Withdrawal", "Savings", "-", amount);
            updateBalanceDisplay();
        }
    });

    document.getElementById("transferButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("transferAmount").value);
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            const checkingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;
            localStorage.setItem("savingsBalance", balance);
            localStorage.setItem("checkingsBalance", checkingsBalance + amount);
            logTransaction("Transfer", "Savings", "Checkings", amount);
            updateBalanceDisplay();
        }
    });

    updateBalanceDisplay();
});

