document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance"));
    if (isNaN(balance)) {
        balance = 0;
    }

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = balance.toFixed(2);
    }

    // Function to display status messages
    function showMessage(message, type = "success") {
        const messageBox = document.getElementById("message");
        messageBox.textContent = message;
        messageBox.style.color = type === "success" ? "green" : "red";
        messageBox.style.visibility = "visible";

        // Hide the message after 3 seconds
        setTimeout(() => {
            messageBox.style.visibility = "hidden";
        }, 3000);
    }

    // Function to log transactions in localStorage
    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({
            date: new Date().toISOString(),
            type: type,
            fromAccount: fromAccount,
            toAccount: toAccount || null,
            amount: parseFloat(amount).toFixed(2),
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        if (depositAmount > 0) {
            balance += depositAmount;
            updateBalanceDisplay();
            localStorage.setItem("checkingsBalance", balance.toString());

            // Log transaction
            logTransaction("Deposit", "Checkings", null, depositAmount);

            showMessage(`Successfully deposited $${depositAmount.toFixed(2)}.`, "success");
        } else {
            showMessage("Enter a valid deposit amount.", "error");
        }

        depositInput.value = "";
    });

    // Handle withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            updateBalanceDisplay();
            localStorage.setItem("checkingsBalance", balance.toString());

            // Log transaction
            logTransaction("Withdrawal", "Checkings", null, withdrawAmount);

            showMessage(`Successfully withdrew $${withdrawAmount.toFixed(2)}.`, "success");
        } else if (withdrawAmount > balance) {
            showMessage("Insufficient funds.", "error");
        } else {
            showMessage("Enter a valid withdrawal amount.", "error");
        }

        withdrawInput.value = "";
    });

    // Initialize the display
    updateBalanceDisplay();
});
