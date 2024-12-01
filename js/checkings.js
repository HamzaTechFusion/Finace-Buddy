document.addEventListener("DOMContentLoaded", () => {
    // Initialize the balance from localStorage
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
    }

    // Function to display success or error messages
    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("message");
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? "green" : "red";
        messageElement.style.display = "block"; // Ensure the message is visible
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

    // Event listener for deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        if (depositAmount > 0) {
            balance += depositAmount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Deposit", "Checkings", "-", depositAmount);
            updateBalanceDisplay();
            showMessage("Deposit successful!");
        } else {
            showMessage("Enter a valid deposit amount.", false);
        }

        depositInput.value = ""; // Clear the input field
    });

    // Event listener for withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("checkingsBalance", balance);
            logTransaction("Withdraw", "Checkings", "-", withdrawAmount);
            updateBalanceDisplay();
            showMessage("Withdrawal successful!");
        } else {
            showMessage("Invalid or insufficient funds.", false);
        }

        withdrawInput.value = ""; // Clear the input field
    });

    // Event listener for transfers
    document.getElementById("transferButton").addEventListener("click", () => {
        const transferInput = document.getElementById("transferAmount");
        const transferAmount = parseFloat(transferInput.value);

        if (transferAmount > 0 && transferAmount <= balance) {
            const savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
            balance -= transferAmount;
            localStorage.setItem("checkingsBalance", balance);
            localStorage.setItem("savingsBalance", savingsBalance + transferAmount);
            logTransaction("Transfer", "Checkings", "Savings", transferAmount);
            updateBalanceDisplay();
            showMessage("Transfer successful!");
        } else {
            showMessage("Invalid or insufficient funds for transfer.", false);
        }

        transferInput.value = ""; // Clear the input field
    });

    // Initialize balance display
    updateBalanceDisplay();
});
