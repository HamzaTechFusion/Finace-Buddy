document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
        console.log("Savings Balance Updated:", balance); // Debug log
    }

    // Function to show success or error messages
    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("message");
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? "green" : "red";
        messageElement.style.display = "block";
        setTimeout(() => {
            messageElement.style.display = "none";
        }, 3000); // Message disappears after 3 seconds
    }

    // Function to log transactions
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

    // Deposit
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositAmount = parseFloat(document.getElementById("depositAmount").value);

        if (depositAmount > 0) {
            balance += depositAmount;
            localStorage.setItem("savingsBalance", balance); // Update in localStorage
            logTransaction("Deposit", "Savings", "-", depositAmount); // Log transaction
            updateBalanceDisplay();
            showMessage("Deposit successful!");
        } else {
            showMessage("Enter a valid deposit amount.", false);
        }

        document.getElementById("depositAmount").value = ""; // Clear input
    });

    // Withdraw
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("savingsBalance", balance); // Update in localStorage
            logTransaction("Withdraw", "Savings", "-", withdrawAmount); // Log transaction
            updateBalanceDisplay();
            showMessage("Withdrawal successful!");
        } else {
            showMessage("Invalid or insufficient funds.", false);
        }

        document.getElementById("withdrawAmount").value = ""; // Clear input
    });

    // Transfer to Checkings
    document.getElementById("transferButton").addEventListener("click", () => {
        const transferAmount = parseFloat(document.getElementById("transferAmount").value);

        if (transferAmount > 0 && transferAmount <= balance) {
            let checkingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

            balance -= transferAmount;
            checkingsBalance += transferAmount;

            // Update balances in localStorage
            localStorage.setItem("savingsBalance", balance);
            localStorage.setItem("checkingsBalance", checkingsBalance);

            logTransaction("Transfer", "Savings", "Checkings", transferAmount); // Log transaction
            updateBalanceDisplay();
            showMessage("Transfer successful!");
        } else {
            showMessage("Invalid or insufficient funds for transfer.", false);
        }

        document.getElementById("transferAmount").value = ""; // Clear input
    });

    // Initialize balance display
    updateBalanceDisplay();
});
