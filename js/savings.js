document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
    }

    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("message");
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? "green" : "red";
        messageElement.style.display = "block"; // Ensure the message is visible
        setTimeout(() => {
            messageElement.style.display = "none"; // Automatically hide message after 3 seconds
        }, 3000); // Message will disappear after 3 seconds
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
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        if (depositAmount > 0) {
            balance += depositAmount;
            localStorage.setItem("savingsBalance", balance);
            logTransaction("Deposit", "Savings", "-", depositAmount);
            updateBalanceDisplay();
            showMessage("Deposit successful!");
        } else {
            showMessage("Enter a valid deposit amount.", false);
        }

        depositInput.value = ""; // Clear the input field
    });

    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            localStorage.setItem("SavingsBalance", balance);
            logTransaction("Withdraw", "Savings", "-", withdrawAmount);
            updateBalanceDisplay();
            showMessage("Withdrawal successful!");
        } else {
            showMessage("Invalid or insufficient funds.", false);
        }

        withdrawInput.value = ""; // Clear the input field
    });

    document.getElementById("transferButton").addEventListener("click", () => {
        const transferInput = document.getElementById("transferAmount");
        const transferAmount = parseFloat(transferInput.value);

        if (transferAmount > 0 && transferAmount <= balance) {
            const savingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;
            balance -= transferAmount;
            localStorage.setItem("savingsBalance", balance);
            localStorage.setItem("checkingsBalance", checkingdBalance + transferAmount);
            logTransaction("Transfer", "Savings", "Checkings", transferAmount);
            updateBalanceDisplay();
            showMessage("Transfer successful!");
        } else {
            showMessage("Invalid or insufficient funds for transfer.", false);
        }

        transferInput.value = ""; // Clear the input field
    });

    updateBalanceDisplay(); // Initialize balance display
});
