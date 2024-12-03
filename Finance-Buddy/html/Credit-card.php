<?php
require_once '../config/db_connect.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$conn = connectDB();

// Get credit card balance
$stmt = $conn->prepare("SELECT balance, credit_limit FROM credit_cards WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$card = $result->fetch_assoc();

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credit Card - Finance Buddy</title>
    <link rel="stylesheet" href="../css/stylesheet.css">
</head>
<body>
    <div class="container">
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

        <h1>Credit Card</h1>
        
        <div class="credit-card-info">
            <p>Current Balance: $<span id="cardBalance"><?php echo number_format($card['balance'], 2); ?></span></p>
            <p>Credit Limit: $<?php echo number_format($card['credit_limit'], 2); ?></p>
            <p>Available Credit: $<?php echo number_format($card['credit_limit'] - $card['balance'], 2); ?></p>
        </div>

        <div class="credit-card-operations">
            <div class="operation-section">
                <h2>Make a Purchase</h2>
                <input type="number" id="purchaseAmount" min="0" step="0.01" placeholder="Enter amount">
                <button onclick="handleCharge()">Charge Card</button>
            </div>

            <div class="operation-section">
                <h2>Make a Payment</h2>
                <input type="number" id="paymentAmount" min="0" step="0.01" placeholder="Enter amount">
                <button onclick="handlePayment()">Make Payment</button>
            </div>
        </div>

        <p id="message" style="display: none;"></p>
    </div>

    <script>
    async function performOperation(action, amount) {
        try {
            const response = await fetch('../api/credit_card_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, amount })
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Operation failed');
            }

            window.location.reload();

        } catch (error) {
            showMessage(error.message, false);
        }
    }

    function showMessage(message, isSuccess = true) {
        const messageElement = document.getElementById("message");
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

    function handleCharge() {
        const amount = parseFloat(document.getElementById("purchaseAmount").value);
        if (amount > 0) {
            performOperation('charge', amount);
        } else {
            showMessage("Please enter a valid amount", false);
        }
    }

    function handlePayment() {
        const amount = parseFloat(document.getElementById("paymentAmount").value);
        if (amount > 0) {
            performOperation('payment', amount);
        } else {
            showMessage("Please enter a valid amount", false);
        }
    }
    </script>
</body>
</html> 