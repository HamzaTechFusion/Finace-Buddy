document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;

    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
    }

    function showMessage(message, type = "success") {
        const messageBox = document.getElementById("message");
        messageBox.textContent = message;
        messageBox.style.color = type === "success" ? "green" : "red";
        messageBox.style.visibility = "visible";
        setTimeout(() => {
            messageBox.style.visibility = "hidden";
        }, 3000);
    }

    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({
            date: new Date().toLocaleString(),
            type: type,
            fromAccount: fromAccount,
            toAccount: toAccount || "-",
            amount: amount.toFixed(2),
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactionLog();
    }

    function renderTransactionLog() {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        const transactionHistory = document.getElementById("transactionHistory");
        transactionHistory.innerHTML = "";
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
        document.getElementById("depositAmount").value = "";
    });

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
        document.getElementById("withdrawAmount").value = "";
    });

    document.getElementById("transferButton").addEventListener("click", () => {
        const transferAmount = parseFloat(document.getElementById("transferAmount").value);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            showMessage("Enter a valid transfer amount.", "error");
            return;
        }
        if (transferAmount > balance) {
            showMessage("Insufficient funds.", "error");
            return;
        }
        balance -= transferAmount;
        localStorage.setItem("checkingsBalance", balance.toFixed(2));

        let savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
        savingsBalance += transferAmount;
        localStorage.setItem("savingsBalance", savingsBalance.toFixed(2));

        updateBalanceDisplay();
        logTransaction("Transfer", "Checkings", "Savings", transferAmount);
        showMessage(`Transferred $${transferAmount.toFixed(2)} to Savings successfully.`, "success");
        document.getElementById("transferAmount").value = "";
    });

    updateBalanceDisplay();
    renderTransactionLog();
});

