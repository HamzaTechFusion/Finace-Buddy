// Initialize card balance and transaction history
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

// Handle transaction submission
submitButton.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    const transactionType = transactionTypeSelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (transactionType === 'purchase') {
        // Handle purchase: increase balance
        cardBalance += amount;
        addTransactionToHistory('purchase', amount);
    } else if (transactionType === 'pay') {
        // Handle payment: decrease balance
        if (amount > cardBalance) {
            alert("Insufficient balance to make the payment.");
            return;
        }
        cardBalance -= amount;
        addTransactionToHistory('payment', amount);
    }

    // Update balance on UI
    updateBalance();
    
    // Clear input fields
    amountInput.value = '';
});

// Initialize the balance and transaction history
updateBalance();
