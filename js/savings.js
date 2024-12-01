document.addEventListener("DOMContentLoaded", () => {
    let balance = parseFloat(localStorage.getItem("savingsBalance"));
    if (isNaN(balance)) {
        balance = 0;
    }

    // Function to update the displayed balance
    function updateBalanceDisplay() {
        document.getElementById("balance").textContent = balance.toFixed(2);
        console.log("Balance updated:", balance); // Debug log
    }

    // Function to log transactions in localStorage
    function logTransaction(type, fromAccount, toAccount, amount) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({
            date: new Date().toISOString(),
            type: type,
            fromAccount: fromAccount,
            toAccount: toAccount || null,
            amount: parseFloat(amount).toFixed(2),
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // Handle deposits
    document.getElementById("depositButton").addEventListener("click", () => {
        const depositInput = document.getElementById("depositAmount");
        const depositAmount = parseFloat(depositInput.value);

        console.log("Deposit button clicked"); // Debug log
        console.log("Deposit amount entered:", depositAmount); // Debug log

        if (depositAmount > 0) {
            balance += depositAmount;
            updateBalanceDisplay();
            localStorage.setItem("savingsBalance", balance.toString());

            // Log transaction
            logTransaction("Deposit", "Savings", null, depositAmount);

            document.getElementById("message").textContent = "Deposit successful!";
            document.getElementById("message").style.color = "green";
            console.log("New balance after deposit:", balance); // Debug log
        } else {
            document.getElementById("message").textContent = "Enter a valid deposit amount.";
            document.getElementById("message").style.color = "red";
            console.log("Invalid deposit amount entered"); // Debug log
        }

        depositInput.value = "";
    });

    // Handle withdrawals
    document.getElementById("withdrawButton").addEventListener("click", () => {
        const withdrawInput = document.getElementById("withdrawAmount");
        const withdrawAmount = parseFloat(withdrawInput.value);

        console.log("Withdraw button clicked"); // Debug log
        console.log("Withdraw amount entered:", withdrawAmount); // Debug log
        console.log("Current balance before withdrawal:", balance); // Debug log

        if (withdrawAmount > 0 && withdrawAmount <= balance) {
            balance -= withdrawAmount;
            updateBalanceDisplay();
            localStorage.setItem("savingsBalance", balance.toString());

            // Log transaction
            logTransaction("Withdrawal", "Savings", null, withdrawAmount);

            document.getElementById("message").textContent = "Withdrawal successful!";
            document.getElementById("message").style.color = "green";
            console.log("New balance after withdrawal:", balance); // Debug log
        } else if (withdrawAmount > balance) {
            document.getElementById("message").textContent = "Insufficient funds.";
            document.getElementById("message").style.color = "red";
            console.log("Insufficient funds for withdrawal."); // Debug log
        } else {
            document.getElementById("message").textContent = "Enter a valid withdrawal amount.";
            document.getElementById("message").style.color = "red";
            console.log("Invalid withdrawal amount entered."); // Debug log
        }

        withdrawInput.value = "";
    });

    // Handle transfers to Checkings
    document.getElementById("transferButton").addEventListener("click", () => {
        const transferInput = document.getElementById("transferAmount");
        const transferAmount = parseFloat(transferInput.value);

        console.log("Transfer button clicked"); // Debug log
        console.log("Transfer amount entered:", transferAmount); // Debug log

        if (transferAmount > 0 && transferAmount <= balance) {
            // Deduct from Savings
            balance -= transferAmount;
            localStorage.setItem("savingsBalance", balance.toString());
            updateBalanceDisplay();

            // Add to Checkings
            let checkingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;
            checkingsBalance += transferAmount;
            localStorage.setItem("checkingsBalance", checkingsBalance.toFixed(2));

            // Log transaction
            logTransaction("Transfer", "Savings", "Checkings", transferAmount);

            document.getElementById("message").textContent = "Transfer to Checkings successful!";
            document.getElementById("message").style.color = "green";
            console.log("New Savings balance:", balance); // Debug log
            console.log("New Checkings balance:", checkingsBalance); // Debug log
        } else if (transferAmount > balance) {
            document.getElementById("message").textContent = "Insufficient funds.";
            document.getElementById("message").style.color = "red";
            console.log("Insufficient funds for transfer."); // Debug log
        } else {
            document.getElementById("message").textContent = "Enter a valid transfer amount.";
            document.getElementById("message").style.color = "red";
            console.log("Invalid transfer amount entered."); // Debug log
        }

        transferInput.value = "";
    });

    // Initialize the display
    updateBalanceDisplay();
});
