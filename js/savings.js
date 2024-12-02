document.addEventListener("DOMContentLoaded", () => {
    async function performOperation(action, amount, fromAccount = 'savings', toAccount = null) {
        try {
            const response = await fetch('../api/account_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    amount,
                    account_type: fromAccount,
                    from_account: fromAccount,
                    to_account: toAccount
                })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Operation failed');
            }

            // Reload page to show updated balance
            window.location.reload();

        } catch (error) {
            showMessage(error.message, false);
        }
    }

    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("savings-message");
        messageElement.textContent = message;
        messageElement.style.color = isSuccess ? "green" : "red";
        messageElement.style.display = "block";
        messageElement.style.padding = "10px";
        messageElement.style.marginTop = "10px";
        messageElement.style.backgroundColor = isSuccess ? "#e8f5e9" : "#ffebee";
        messageElement.style.borderRadius = "4px";
        
        setTimeout(() => {
            messageElement.style.display = "none";
        }, 3000);
    }

    // Event Listeners
    document.getElementById("savings-depositButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("savings-depositAmount").value);
        if (amount > 0) {
            performOperation('deposit', amount);
        } else {
            showMessage("Please enter a valid amount", false);
        }
    });

    document.getElementById("savings-withdrawButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("savings-withdrawAmount").value);
        if (amount > 0) {
            performOperation('withdraw', amount);
        } else {
            showMessage("Please enter a valid amount", false);
        }
    });

    document.getElementById("savings-transferButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("savings-transferAmount").value);
        if (amount > 0) {
            performOperation('transfer', amount, 'savings', 'checking');
        } else {
            showMessage("Please enter a valid amount", false);
        }
    });
});
