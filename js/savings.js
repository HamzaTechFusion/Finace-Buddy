document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
    }

    // Function to log transactions in localStorage
    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({
            date: new Date().toLocaleString(),
            type: type,
            fromAccount: fromAccount,
            toAccount: toAccount || "-",
            amount: parseFloat(amount).toFixed(2),
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Function to display messages
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

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        if (isNaN(depositAmount) || depositAmount <= 0) {
            showMessage("Please enter a valid deposit amount.", "error");
            return;
        }

        balance += depositAmount;
        localStorage.setItem("savingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        // Log transaction
        logTransaction("Deposit", "Savings", null, depositAmount);

        showMessage(`Successfully deposited $${depositAmount.toFixed(2)}.`, "success");
        depositInput.value = "";
    });

    // Handle withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            showMessage("Please enter a valid withdrawal amount.", "error");
            return;
        }

        if (withdrawAmount > balance) {
            showMessage("Insufficient funds.", "error");
            return;
        }

        balance -= withdrawAmount;
        localStorage.setItem("savingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        // Log transaction
        logTransaction("Withdrawal", "Savings", null, withdrawAmount);

        showMessage(`Successfully withdrew $${withdrawAmount.toFixed(2)}.`, "success");
        withdrawInput.value = "";
    });

    // Handle transfers to Checkings
    document.getElementById("transferButton").addEventListener("click", () => {
        const transferInput = document.getElementById("transferAmount");
        const transferAmount = parseFloat(transferInput.value);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            showMessage("Please enter a valid transfer amount.", "error");
            return;
        }

        if (transferAmount > balance) {
            showMessage("Insufficient funds for transfer.", "error");
            return;
        }

        // Deduct from Savings
        balance -= transferAmount;
        localStorage.setItem("savingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        // Add to Checkings
        let checkingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;
        checkingsBalance += transferAmount;
        localStorage.setItem("checkingsBalance", checkingsBalance.toFixed(2));

        // Log transaction
        logTransaction("Transfer", "Savings", "Checkings", transferAmount);

        showMessage(`Successfully transferred $${transferAmount.toFixed(2)} to Checkings.`, "success");
        transferInput.value = "";
    });

    // Initialize the page
    updateBalanceDisplay();
});
