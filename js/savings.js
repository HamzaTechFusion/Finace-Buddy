document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance")) || 0;

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = balance.toFixed(2);
    }

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value) || 0;

        console.log("Deposit amount entered:", depositAmount); // Debug log

        if (depositAmount > 0) {
            balance += depositAmount; // Add deposit to balance
            updateBalanceDisplay(); // Update displayed balance
            localStorage.setItem("savingsBalance", balance); // Save balance to localStorage

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
    document.getElementById("withdrawButton").addEventLi
