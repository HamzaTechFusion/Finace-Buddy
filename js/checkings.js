document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    function updateBalanceDisplay() {
        document.getElementById("checkings-balance").textContent = `$${balance.toFixed(2)}`;
    }

    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("checkings-message");
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? "green" : "red";
        messageElement.style.display = "block";
        messageElement.style.padding = "10px";
        messageElement.style.marginTop = "10px";
        messageElement.style.backgroundColor = isSuccess ? "#e8f5e9" : "#ffebee";
        messageElement.style.borderRadius = "4px";
        
        setTimeout(() => {
            messageElement.style.display = "none";
        }, 3000);
    }

    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({
            date: new Date().toISOString(),
            type,
            fromAccount,
            toAccount,
            amount: parseFloat(amount)
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    document.getElementById("checkings-depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("checkings-depositAmount");
        const depositAmount = parseFloat(depositInput.value);
        depositInput.value = "";

        if (isNaN(depositAmount) || depositAmount <= 0) {
            showMessage("Please enter a valid deposit amount.", false);
            return;
        }

        balance += depositAmount;
        localStorage.setItem("checkingsBalance", balance);
        logTransaction("Deposit", "Checkings", "-", depositAmount);
        updateBalanceDisplay();
        showMessage("Deposit successful!");
    });

    document.getElementById("checkings-withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("checkings-withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);
        withdrawInput.value = ""; // Clear input immediately

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Withdrawal", "Checkings", "-", withdrawAmount);
            updateBalanceDisplay();
            showMessage("Withdrawal successful!");
        } else {
            showMessage("Invalid or insufficient funds.", false);
        }
    });

    document.getElementById("checkings-transferButton").addEventListener("click", () => {
        const transferInput = document.getElementById("checkings-transferAmount");
        const transferAmount = parseFloat(transferInput.value);

        if (transferAmount > 0 && transferAmount <= balance) {
            const savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
            balance -= transferAmount;
            localStorage.setItem("checkingsBalance", balance);
            localStorage.setItem("savingsBalance", savingsBalance + transferAmount);
            logTransaction("Transfer", "Checkings", "Savings", transferAmount);
            updateBalanceDisplay();
            showMessage("Transfer successful!");
            setTimeout(() => {
                window.location.reload(); // Refresh the page after 1 second
            }, 1000);
        } else {
            showMessage("Invalid or insufficient funds for transfer.", false);
        }

        transferInput.value = ""; // Clear the input field
    });

    updateBalanceDisplay(); // Initialize balance display
});
