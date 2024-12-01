document.getElementById("transferButton").addEventListener("click", () => {
    const transferAmount = parseFloat(document.getElementById("transferAmount").value);

    if (isNaN(transferAmount) || transferAmount <= 0) {
        showMessage("Please enter a valid transfer amount.", "error");
        return;
    }

    if (transferAmount > balance) {
        showMessage("Insufficient funds for transfer.", "error");
        return;
    }

    // Deduct from Savings
    console.log("Savings balance before transfer:", balance);
    balance -= transferAmount;
    localStorage.setItem("savingsBalance", balance.toFixed(2));
    updateBalanceDisplay();
    console.log("Savings balance after transfer:", balance);

    // Add to Checkings
    let checkingsBalance = parseFloat(localStorage.getItem("checkingsBalance")) || 0;
    console.log("Checkings balance before transfer:", checkingsBalance);
    checkingsBalance += transferAmount;
    localStorage.setItem("checkingsBalance", checkingsBalance.toFixed(2));
    console.log("Checkings balance after transfer:", checkingsBalance);

    // Log transaction
    logTransaction("Transfer", "Savings", "Checkings", transferAmount);

    showMessage(`Successfully transferred $${transferAmount.toFixed(2)} to Checkings.`, "success");
    document.getElementById("transferAmount").value = "";
});
