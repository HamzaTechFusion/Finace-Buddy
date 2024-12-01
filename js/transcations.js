// Initialize account balances and transactions in localStorage if not already set
if (!localStorage.getItem("checkingsBalance")) {
    localStorage.setItem("checkingsBalance", "0");
}
if (!localStorage.getItem("savingsBalance")) {
    localStorage.setItem("savingsBalance", "0");
}
if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]));
}

// Function to update account balances in localStorage
function updateBalances(account, amount, isDeposit) {
    let currentBalance = parseFloat(localStorage.getItem(account)) || 0;
    currentBalance = isDeposit ? currentBalance + amount : currentBalance - amount;

    // Ensure the balance never goes negative
    if (currentBalance < 0) {
        alert(`Insufficient funds in ${account}.`);
        return null;
    }

    localStorage.setItem(account, currentBalance.toFixed(2));
    return currentBalance;
}

// Function to log a transaction
function logTransaction(type, fromAccount, toAccount, amount) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push({
        date: new Date().toISOString(),
        type: type,
        fromAccount: fromAccount || "-",
        toAccount: toAccount || "-",
        amount: parseFloat(amount).toFixed(2),
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to handle deposits
function handleDeposit(account, amount) {
    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid deposit amount.");
        return;
    }
    const updatedBalance = updateBalances(account, amount, true);
    if (updatedBalance !== null) {
        logTransaction("Deposit", account, null, amount);
        alert(`Successfully deposited $${amount.toFixed(2)} to ${account}.`);
    }
}

// Function to handle withdrawals
function handleWithdrawal(account, amount) {
    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid withdrawal amount.");
        return;
    }
    const updatedBalance = updateBalances(account, amount, false);
    if (updatedBalance !== null) {
        logTransaction("Withdrawal", account, null, amount);
        alert(`Successfully withdrew $${amount.toFixed(2)} from ${account}.`);
    }
}

// Function to handle transfers between accounts
function handleTransfer(fromAccount, toAccount, amount) {
    if (fromAccount === toAccount) {
        alert("Cannot transfer to the same account.");
        return;
    }
    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid transfer amount.");
        return;
    }

    const fromBalance = updateBalances(fromAccount, amount, false);
    if (fromBalance === null) return; // Exit if insufficient funds

    updateBalances(toAccount, amount, true);
    logTransaction("Transfer", fromAccount, toAccount, amount);
    alert(`Successfully transferred $${amount.toFixed(2)} from ${fromAccount} to ${toAccount}.`);
}

// Function to display transaction history
function displayTransactions() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transactionTable = document.getElementById("transactionHistory");
    transactionTable.innerHTML = ""; // Clear the table before populating

    if (transactions.length === 0) {
        transactionTable.innerHTML = `<tr><td colspan="5">No transactions found.</td></tr>`;
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString()}</td>
            <td>${transaction.type}</td>
            <td>${transaction.fromAccount}</td>
            <td>${transaction.toAccount}</td>
            <td>$${transaction.amount}</td>
        `;
        transactionTable.appendChild(row);
    });
}

// Example usage for deposits, withdrawals, and transfers (triggered by UI interactions)
document.getElementById("transactionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fromAccount = document.getElementById("fromAccount").value.trim();
    const toAccount = document.getElementById("toAccount").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    if (!fromAccount || isNaN(amount) || amount <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    if (toAccount) {
        handleTransfer(fromAccount, toAccount, amount);
    } else {
        // If no "toAccount" is specified, assume deposit
        handleDeposit(fromAccount, amount);
    }
    displayTransactions();
});

// Display transactions on page load
document.addEventListener("DOMContentLoaded", displayTransactions);
