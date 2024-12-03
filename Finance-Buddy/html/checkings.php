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
    <title>Checking Account</title>
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

        <!-- Checking Account Section -->
        <div class="account-section">
            <h2>Checking Account</h2>
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

    <script src="../js/checkings.js"></script>
</body>
</html> 