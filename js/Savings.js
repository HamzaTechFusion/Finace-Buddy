// Initialize the savings account balance
let savingsBalance = 0;

// Function to update the displayed balance
function updateSavingsDisplay() {
    document.getElementById("savingsBalance").textContent = savingsBalance.toFixed(2);
}

// Deposit functionality
document.getElementById("depositButton").addEventListener("click", function () {
    const depositAmount = parseFloat(document.getElementById("depositAmount").value) || 0;
    if (depositAmount > 0) {
        savingsBalance += depositAmount;
        updateSavingsDisplay();
        document.getElementById("savingsMessage").textContent = "Deposit successful!";
        document.getElementById("savingsMessage").style.color = "green";
    } else {
        document.getElementById("savingsMessage").textContent = "Enter a valid deposit amount.";
        document.getElementById("savingsMessage").style.color = "red";
    }
});

// Withdrawal functionality
document.getElementById("withdrawButton").addEventListener("click", function () {
    const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value) || 0;
    if (withdrawAmount > 0 && withdrawAmount <= savingsBalance) {
        savingsBalance -= withdrawAmount;
        updateSavingsDisplay();
        document.getElementById("savingsMessage").textContent = "Withdrawal successful!";
        document.getElementById("savingsMessage").style.color = "green";
    } else if (withdrawAmount > savingsBalance) {
        document.getElementById("savingsMessage").textContent = "Insufficient funds.";
        document.getElementById("savingsMessage").style.color = "red";
    } else {
        document.getElementById("savingsMessage").textContent = "Enter a valid withdrawal amount.";
        document.getElementById("savingsMessage").style.color = "red";
    }
});

// Initial display update
updateSavingsDisplay();
