let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0; // Initialize balance

// Function to update the displayed balance
function updateBalanceDisplay() {
    document.getElementById("balance").textContent = balance.toFixed(2);
}

// Handle deposits
document.getElementById("depositButton").addEventListener("click", () => {
    const depositAmount = parseFloat(document.getElementById("depositAmount").value) || 0;
    if (depositAmount > 0) {
        balance += depositAmount;
        updateBalanceDisplay();
        localStorage.setItem("savingsBalance", balance); // Save to localStorage
        document.getElementById("message").textContent = "Deposit successful!";
        document.getElementById("message").style.color = "green";
    } else {
        document.getElementById("message").textContent = "Enter a valid deposit amount.";
        document.getElementById("message").style.color = "red";
    }
});

// Handle withdrawals
document.getElementById("withdrawButton").addEventListener("click", () => {
    const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value) || 0;
    if (withdrawAmount > 0 && withdrawAmount <= balance) {
        balance -= withdrawAmount;
        updateBalanceDisplay();
        localStorage.setItem("savingsBalance", balance); // Save to localStorage
        document.getElementById("message").textContent = "Withdrawal successful!";
        document.getElementById("message").style.color = "green";
    } else if (withdrawAmount > balance) {
        document.getElementById("message").textContent = "Insufficient funds.";
        document.getElementById("message").style.color = "red";
    } else {
        document.getElementById("message").textContent = "Enter a valid withdrawal amount.";
        document.getElementById("message").style.color = "red";
    }
});

// Initialize display
updateBalanceDisplay();
