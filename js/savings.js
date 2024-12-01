document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
        console.log("Savings Balance Updated:", balance);
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
            localStorage.setItem("savingsBalance", balance);
            logTransaction("Deposit", "Savings", "-", depositAmount);
            updateBalanceDisplay();
            document.getElementById("message").textContent = "Deposit successful!";
        } else {
            document.getElementById("message").textContent = "Invalid deposit amount.";
        }
    });

    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);
        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("savingsBalance", balance);
            logTransaction("Withdraw", "Savings", "-", withdrawAmount);
            updateBalanceDisplay();
            document.getElementById("message").textContent = "Withdrawal successful!";
        } else {
            document.getElementById("message").textContent = "Invalid or insufficient funds.";
        }
    });

    document.getElementById("transferButton").addEventListener("click", () => {
        const transferAmount = parseFloat(document.getElementById("transferAmount").value);
        if (transferAmount > 0 && transferAmount <= balance) {
            const checkingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;
            balance -= transferAmount;
            localStorage.setItem("savingsBalance", balance);
            localStorage.setItem("checkingsBalance", checkingsBalance + transferAmount);
            logTransaction("Transfer", "Savings", "Checkings", transferAmount);
            updateBalanceDisplay();
            document.getElementById("message").textContent = "Transfer successful!";
        } else {
            document.getElementById("message").textContent = "Invalid or insufficient funds.";
        }
    });

    updateBalanceDisplay();
});
