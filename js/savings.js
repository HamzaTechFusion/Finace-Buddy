// Handle deposits
document.getElementById("depositButton").addEventListener("click", () => {
    const depositInput = document.getElementById("depositAmount");
    const depositAmount = parseFloat(depositInput.value) || 0;
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
    depositInput.value = ""; // Clear the text box
});

// Handle withdrawals
document.getElementById("withdrawButton").addEventListener("click", () => {
    const withdrawInput = document.getElementById("withdrawAmount");
    const withdrawAmount = parseFloat(withdrawInput.value) || 0;
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
    withdrawInput.value = ""; // Clear the text box
});
