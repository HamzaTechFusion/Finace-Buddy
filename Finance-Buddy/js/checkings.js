document.addEventListener("DOMContentLoaded", () => {
    async function performOperation(action, amount, fromAccount = 'checking', toAccount = null) {
        try {
            console.log('Request data:', {
                action,
                amount,
                account_type: fromAccount,
                from_account: fromAccount,
                to_account: toAccount
            });

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
            console.log('Response:', data);

            if (!data.success) {
                throw new Error(data.error || 'Operation failed');
            }

            // Reload page to show updated balance
            window.location.reload();

        } catch (error) {
            console.error('Transfer error:', error);
            showMessage(error.message, false);
        }
    }

    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("checkings-message");
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
    document.getElementById("checkings-depositButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("checkings-depositAmount").value);
        if (amount > 0) {
            performOperation('deposit', amount);
        } else {
            showMessage("Please enter a valid amount", false);
        }
    });

    document.getElementById("checkings-withdrawButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("checkings-withdrawAmount").value);
        if (amount > 0) {
            performOperation('withdraw', amount);
        } else {
            showMessage("Please enter a valid amount", false);
        }
    });

    document.getElementById("checkings-transferButton").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("checkings-transferAmount").value);
        if (amount > 0) {
            console.log('Sending transfer request:', {
                action: 'transfer',
                amount: amount,
                from_account: 'checking',
                to_account: 'savings'
            });

            performOperation('transfer', amount, 'checking', 'savings');
        } else {
            showMessage("Please enter a valid amount", false);
        }
    });
});
