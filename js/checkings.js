document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
        console.log("Checkings Balance Updated:", balance);
    }

    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({
            date: new Date().toISOString(),
            type,
            fromAccount,
            toAccount,
            amount: parseFloat(amount).toFixed(2),
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    document.getElementById("depositButton").addEventListener("click", () => {
        const depositAmount = parseFloat(document.getElementById("depositAmount").value);
        if (depositAmount > 0) {
            balance += depositAmount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Deposit", "Checkings", "-", depositAmount);
            updateBalanceDisplay();
        }
    });

    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);
        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Withdraw", "Checkings", "-", withdrawAmount);
            updateBalanceDisplay();
        }
    });

    document.getElementById("transferButton").addEventListener("click", () => {
        const transferAmount = parseFloat(document.getElementById("transferAmount").value);
        if (transferAmount > 0 && transferAmount <= balance) {
            const savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
            balance -= transferAmount;
            localStorage.setItem("checkingsBalance", balance);
            localStorage.setItem("savingsBalance", savingsBalance + transferAmount);
            logTransaction("Transfer", "Checkings", "Savings", transferAmount);
            updateBalanceDisplay();
        }
    });

    updateBalanceDisplay();
});
