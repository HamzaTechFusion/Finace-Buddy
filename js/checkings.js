document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

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
        renderTransactionLog();
    }

    // Function to render the transaction log
    function renderTransactionLog() {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        const transactionHistory = document.getElementById("transactionHistory");
        transactionHistory.innerHTML = ""; // Clear existing rows
        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.type}</td>
                <td>${transaction.fromAccount}</td>
                <td>${transaction.toAccount}</td>
                <td>${transaction.amount}</td>
            `;
            transactionHistory.appendChild(row);
        });
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

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        if (isNaN(depositAmount) || depositAmount <= 0) {
            showMessage("Please enter a valid deposit amount.", "error");
            return;
        }

        balance += depositAmount;
        localStorage.setItem("checkingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        // Log transaction
        logTransaction("Deposit", "Checkings", null, depositAmount);

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
        localStorage.setItem("checkingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        // Log transaction
        logTransaction("Withdrawal", "Checkings", null, withdrawAmount);

        showMessage(`Successfully withdrew $${withdrawAmount.toFixed(2)}.`, "success");
        withdrawInput.value = "";
    });

    // Handle transfers to Savings
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

        // Deduct from Checkings
        balance -= transferAmount;
        localStorage.setItem("checkingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        // Add to Savings
        let savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
        savingsBalance += transferAmount;
        localStorage.setItem("savingsBalance", savingsBalance.toFixed(2));

        // Log transaction
        logTransaction("Transfer", "Checkings", "Savings", transferAmount);

        showMessage(`Successfully transferred $${transferAmount.toFixed(2)} to Savings.`, "success");
        transferInput.value = "";
    });

    // Initialize the display
    updateBalanceDisplay();
    renderTransactionLog();
});
