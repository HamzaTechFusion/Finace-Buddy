document.addEventListener("DOMContentLoaded", () => {
    // Initialize the balance from localStorage
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
        console.log("Checkings Balance Updated:", balance); // Debug log
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

    // Deposit event listener
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositAmount = parseFloat(document.getElementById("depositAmount").value);
        if (depositAmount > 0) {
            balance += depositAmount;
            localStorage.setItem("checkingsBalance", balance); // Save updated balance
            logTransaction("Deposit", "Checkings", "-", depositAmount); // Log transaction
            updateBalanceDisplay(); // Update balance display
            document.getElementById("message").textContent = "Deposit successful!";
        } else {
            document.getElementById("message").textContent = "Enter a valid deposit amount.";
        }
        document.getElementById("depositAmount").value = ""; // Clear input field
    });

    // Withdraw event listener
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);
        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("checkingsBalance", balance); // Save updated balance
            logTransaction("Withdraw", "Checkings", "-", withdrawAmount); // Log transaction
            updateBalanceDisplay(); // Update balance display
            document.getElementById("message").textContent = "Withdrawal successful!";
        } else {
            document.getElementById("message").textContent = "Invalid or insufficient funds.";
        }
        document.getElementById("withdrawAmount").value = ""; // Clear input field
    });

    // Transfer event listener
    document.getElementById("transferButton").addEventListener("click", () => {
        const transferAmount = parseFloat(document.getElementById("transferAmount").value);
        if (transferAmount > 0 && transferAmount <= balance) {
            // Deduct from checkings and add to savings
            balance -= transferAmount;
            const savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
            localStorage.setItem("checkingsBalance", balance); // Save updated checkings balance
            localStorage.setItem("savingsBalance", savingsBalance + transferAmount); // Update savings balance
            logTransaction("Transfer", "Checkings", "Savings", transferAmount); // Log transaction
            updateBalanceDisplay(); // Update balance display
            document.getElementById("message").textContent = "Transfer successful!";
        } else {
            document.getElementById("message").textContent = "Invalid or insufficient funds.";
        }
        document.getElementById("transferAmount").value = ""; // Clear input field
    });

    // Initialize balance display on page load
    updateBalanceDisplay();
});
