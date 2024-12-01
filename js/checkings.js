document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("checkingBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = balance.toFixed(2);
        console.log("Balance updated:", balance); // Debug log
    }

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        console.log("Deposit button clicked"); // Debug log
        console.log("Deposit amount entered:", depositAmount); // Debug log

        if (depositAmount > 0) {
            balance += depositAmount; // Add deposit to balance
            updateBalanceDisplay(); // Update displayed balance
            localStorage.setItem("checkingBalance", balance); // Save balance to localStorage

            document.getElementById("message").textContent = "Deposit successful!";
            document.getElementById("message").style.color = "green";
            console.log("New balance after deposit:", balance); // Debug log
        } else {
            document.getElementById("message").textContent = "Enter a valid deposit amount.";
            document.getElementById("message").style.color = "red";
            console.log("Invalid deposit amount entered"); // Debug log
        }

        depositInput.value = ""; // Clear the input field
    });

    // Handle withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        console.log("Withdraw button clicked"); // Debug log
        console.log("Withdraw amount entered:", withdrawAmount); // Debug log

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount; // Subtract withdrawal from balance
            updateBalanceDisplay(); // Update displayed balance
            localStorage.setItem("checkingBalance", balance); // Save balance to localStorage

            document.getElementById("message").textContent = "Withdrawal successful!";
            document.getElementById("message").style.color = "green";
            console.log("New balance after withdrawal:", balance); // Debug log
        } else if (withdrawAmount > balance) {
            document.getElementById("message").textContent = "Insufficient funds.";
            document.getElementById("message").style.color = "red";
            console.log("Insufficient funds for withdrawal"); // Debug log
        } else {
            document.getElementById("message").textContent = "Enter a valid withdrawal amount.";
            document.getElementById("message").style.color = "red";
            console.log("Invalid withdrawal amount entered"); // Debug log
        }

        withdrawInput.value = ""; // Clear the input field
    });

    // Initialize the display
    updateBalanceDisplay();
});