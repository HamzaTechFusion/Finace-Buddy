document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById("balance");
        if (balanceElement) {
            balanceElement.textContent = `$${balance.toFixed(2)}`;
            console.log("Updated Checkings balance display:", balance);
        } else {
            console.error("Balance element not found in Checkings HTML.");
        }
    }

    // Function to show messages to the user
    function showMessage(message, type = "success") {
        const messageBox = document.getElementById("message");
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.style.color = type === "success" ? "green" : "red";
            messageBox.style.visibility = "visible";
            setTimeout(() => {
                messageBox.style.visibility = "hidden";
            }, 3000);
        } else {
            console.error("Message element not found in Checkings HTML.");
        }
    }

    // Function to log transactions to localStorage
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
        console.log("Logged transaction:", { type, fromAccount, toAccount, amount });
    }

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositAmount = parseFloat(document.getElementById("depositAmount").value);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            showMessage("Enter a valid deposit amount.", "error");
            return;
        }
        balance += depositAmount;
        localStorage.setItem("checkingsBalance", balance.toFixed(2));
        updateBalanceDisplay();
        logTransaction("Deposit", "Checkings", null, depositAmount);
        showMessage(`Deposited $${depositAmount.toFixed(2)} successfully.`, "success");
        document.getElementById("depositAmount").value = ""; // Clear input
    });

    // Handle withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            showMessage("Enter a valid withdrawal amount.", "error");
            return;
        }
        if (withdrawAmount > balance) {
            showMessage("Insufficient funds.", "error");
            return;
        }
        balance -= withdrawAmount;
        localStorage.setItem("checkingsBalance", balance.toFixed(2));
        updateBalanceDisplay();
        logTransaction("Withdrawal", "Checkings", null, withdrawAmount);
        showMessage(`Withdrew $${withdrawAmount.toFixed(2)} successfully.`, "success");
        document.getElementById("withdrawAmount").value = ""; // Clear input
    });

    // Handle transfers from Savings to Checkings
    document.getElementById("transferButton").addEventListener("click", () => {
        const transferAmount = parseFloat(document.getElementById("transferAmount").value);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            showMessage("Enter a valid transfer amount.", "error");
            return;
        }

        // Deduct from Savings
        let savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
        if (transferAmount > savingsBalance) {
            showMessage("Insufficient funds in Savings.", "error");
            return;
        }
        savingsBalance -= transferAmount;
        localStorage.setItem("savingsBalance", savingsBalance.toFixed(2));

        // Add to Checkings
        balance += transferAmount;
        localStorage.setItem("checkingsBalance", balance.toFixed(2));
        updateBalanceDisplay();

        logTransaction("Transfer", "Savings", "Checkings", transferAmount);
        showMessage(`Transferred $${transferAmount.toFixed(2)} from Savings to Checkings.`, "success");
        document.getElementById("transferAmount").value = ""; // Clear input
    });

    // Initialize balance display on page load
    updateBalanceDisplay();
});

