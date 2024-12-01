let cardBalance = 500.00; // Starting balance
const transactionHistory = [];

// Get references to DOM elements
const balanceElement = document.getElementById('balance');
const amountInput = document.getElementById('amount');
const transactionTypeSelect = document.getElementById('transaction-type');
const submitButton = document.getElementById('submit-transaction');
const historyList = document.getElementById('history-list');

// Update the displayed balance
function updateBalance() {
    balanceElement.innerHTML = `$${cardBalance.toFixed(2)}`;
}

// Add a new transaction to the history list
function addTransactionToHistory(type, amount) {
    const transactionItem = document.createElement('li');
    transactionItem.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)}: $${amount.toFixed(2)}`;
    historyList.appendChild(transactionItem);
}
