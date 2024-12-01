// Initialize account balances in localStorage if not already set
if (!localStorage.getItem("checkingsBalance")) {
    localStorage.setItem("checkingsBalance", "0");
}
if (!localStorage.getItem("savingsBalance")) {
    localStorage.setItem("savingsBalance", "0");
}
if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]));
}

// Function to update balances in localStorage
function updateBalances(account, amount, isDeposit) {
    let currentBalance = parseFloat(localStorage.getItem(account)) || 0;
    currentBalance = isDeposit ? currentBalance + amount : currentBalance - amount;
    localStorage.setItem(account, currentBalance.toFixed(2));
    return currentBalance;
}

// Function to log a transaction
function logTransaction(type, fromAccount, toAccount, amount) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push({
        date: new Date().toISOString(),
        type: type,
        fromAccount: fromAccount || null,
        toAccount: toAccount || null,
        amount: parseFloat(amount).toFixed(2),
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to handle deposits
function handleDeposit(account, amount) {
    if (amount <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
    }
    updateBalances(account, amount, true);
    logTransaction("Deposit", account, null, amount);
    alert(`Successfully deposited $${amount.toFixed(2)} to ${account}.`);
}

// Function to handle withdrawals
function handleWithdrawal(account, amount) {
    const currentBalance = parseFloat(localStorage.getItem(account)) || 0;
    if (amount <= 0 || amount > currentBalance) {
        alert("Insufficient funds or invalid withdrawal amount.");
        return;
    }
    updateBalances(account, amount, false);
    logTransaction("Withdrawal", account, null, amount);
    alert(`Successfully withdrew $${amount.toFixed(2)} from ${account}.`);
}

// Function to handle transfers
function handleTransfer(fromAccount, toAccount, amount) {
    if (fromAccount === toAccount) {
        alert("Cannot transfer to the same account.");
        return;
    }
    const fromBalance = parseFloat(localStorage.getItem(fromAccount)) || 0;
    if (amount <= 0 || amount > fromBalance) {
        alert("Insufficient funds or invalid transfer amount.");
        return;
    }
    updateBalances(fromAccount, amount, false); // Deduct from the source account
    updateBalances(toAccount, amount, true); // Add to the destination account
    logTransaction("Transfer", fromAccount, toAccount, amount);
    alert(`Successfully transferred $${amount.toFixed(2)} from ${fromAccount} to ${toAccount}.`);
}

// Function to display transaction history
function displayTransactions() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const transactionTable = document.getElementById("transactionHistory");
    transactionTable.innerHTML = ""; // Clear the table before populating
    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString()}</td>
            <td>${transaction.type}</td>
            <td>${transaction.fromAccount || "-"}</td>
            <td>${transaction.toAccount || "-"}</td>
            <td>$${transaction.amount}</td>
        `;
        transactionTable.appendChild(row);
    });
}

// Example usage for deposits, withdrawals, and transfers (can be triggered by UI interactions)
document.getElementById("transactionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fromAccount = document.getElementById("fromAccount").value;
    const toAccount = document.getElementById("toAccount").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!fromAccount || !amount || isNaN(amount)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    if (toAccount) {
        handleTransfer(fromAccount, toAccount, amount);
    } else if (fromAccount) {
        handleDeposit(fromAccount, amount);
    }
    displayTransactions();
});

// Display transactions on page load
displayTransactions();
