document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = balance.toFixed(2);
        console.log("Balance updated:", balance); // Debug log
    }

    // Toggle visibility of the action boxes
    function toggleBox(boxId) {
        const depositBox = document.getElementById("depositBox");
        const withdrawBox = document.getElementById("withdrawBox");

        if (boxId === "depositBox") {
            depositBox.style.display = "block";
            withdrawBox.style.display = "none";
        } else if (boxId === "withdrawBox") {
            withdrawBox.style.display = "block";
            depositBox.style.display = "none";
        }
    }

    // Event listener for showing the deposit box
    document.getElementById("showDepositBox").addEventListener("click", () => {
        toggleBox("depositBox");
    });

    // Event listener for showing the withdraw box
    document.getElementById("showWithdrawBox").addEventListener("click", () => {
        toggleBox("withdrawBox");
    });

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        if (depositAmount > 0) {
            balance += depositAmount; // Add deposit to balance
            updateBalanceDisplay(); // Update displayed balance
            localStorage.setItem("savingsBalance", balance); // Save balance to localStorage

            document.getElementById("message").textContent = "Deposit successful!";
            document.getElementById("message").style.color = "green";
        } else {
            document.getElementById("message").textContent = "Enter a valid deposit amount.";
            document.getElementById("message").style.color = "red";
        }

        depositInput.value = ""; // Clear the input field
        document.getElementById("depositBox").style.display = "none"; // Hide the deposit box
    });

    // Handle withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount; // Subtract withdrawal from balance
            updateBalanceDisplay(); // Update displayed balance
            localStorage.setItem("savingsBalance", balance); // Save balance to localStorage

            document.getElementById("message").textContent = "Withdrawal successful!";
            document.getElementById("message").style.color = "green";
        } else if (withdrawAmount > balance) {
            document.getElementById("message").textContent = "Insufficient funds.";
            document.getElementById("message").style.color = "red";
        } else {
            document.getElementById("message").textContent = "Enter a valid withdrawal amount.";
            document.getElementById("message").style.color = "red";
        }

        withdrawInput.value = ""; // Clear the input field
        document.getElementById("withdrawBox").style.display = "none"; // Hide the withdraw box
    });

    // Initialize the display
    updateBalanceDisplay();
});

