<?php
require_once '../config/db_connect.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$conn = connectDB();

// Get account balance
$stmt = $conn->prepare("SELECT balance FROM accounts WHERE user_id = ? AND account_type = 'checking'");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$account = $result->fetch_assoc();
$balance = $account['balance'];

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkings Account</title>
    <link rel="stylesheet" href="../css/stylesheet.css">
</head>
<body>
    <div class="container">
        <!-- Navigation Bar -->
        <div class="navbar">
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">Accounts</a>
                    <ul class="dropdown-content">
                        <li><a href="checkings.php">Checkings</a></li>
                        <li><a href="savings.php">Savings</a></li>
                    </ul>
                </li>
                <li><a href="Credit-card.php">Credit Card</a></li>
                <li><a href="credit-score.php">Credit Score</a></li>
                <li><a href="transactions.php">Transactions</a></li>
            </ul>
        </div>

        <!-- Checkings Account Section -->
        <div class="account-section">
            <h2>Checkings Account</h2>
            <p>Balance: <span id="checkings-balance">$<?php echo number_format($balance, 2); ?></span></p>

            <label for="checkings-depositAmount">Deposit Amount:</label>
            <input type="number" id="checkings-depositAmount" min="0" step="0.01">
            <button id="checkings-depositButton">Deposit</button>

            <label for="checkings-withdrawAmount">Withdraw Amount:</label>
            <input type="number" id="checkings-withdrawAmount" min="0" step="0.01">
            <button id="checkings-withdrawButton">Withdraw</button>

            <label for="checkings-transferAmount">Transfer to Savings:</label>
            <input type="number" id="checkings-transferAmount" min="0" step="0.01">
            <button id="checkings-transferButton">Transfer</button>

            <p id="checkings-message" style="display: none; margin-top: 20px;"></p>
        </div>
    </div>

    <script>
    document.addEventListener("DOMContentLoaded", () => {
        async function performOperation(action, amount, fromAccount = 'checking', toAccount = null) {
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
                performOperation('transfer', amount, 'checking', 'savings');
            } else {
                showMessage("Please enter a valid amount", false);
            }
        });
    });
    </script>
</body>
</html> 