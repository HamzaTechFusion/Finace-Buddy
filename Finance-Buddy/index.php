<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config/db_connect.php';

// Check if user is logged in
if (!isLoggedIn()) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$conn = connectDB();

// Get user's account information
$stmt = $conn->prepare("
    SELECT username, created_at 
    FROM users 
    WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Get account balances
$stmt = $conn->prepare("
    SELECT account_type, balance 
    FROM accounts 
    WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$accounts = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get latest credit score
$stmt = $conn->prepare("
    SELECT score, score_date 
    FROM credit_scores 
    WHERE user_id = ? 
    ORDER BY score_date DESC 
    LIMIT 1
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$credit_score = $stmt->get_result()->fetch_assoc();

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Buddy</title>
    <link rel="stylesheet" href="./css/stylesheet.css">
</head>
<body>
    <div class="container">
        <div class="navbar">
            <ul>
                <li><a href="index.php">Home</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">Accounts</a>
                    <ul class="dropdown-content">
                        <li><a href="html/checkings.php">Checkings</a></li>
                        <li><a href="html/savings.php">Savings</a></li>
                    </ul>
                </li>
                <li><a href="html/Credit-card.php">Credit Card</a></li>
                <li><a href="html/credit-score.php">Credit Score</a></li>
                <li><a href="html/transactions.php">Transactions</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </div>

        <div class="welcome-section">
            <h2>Welcome, <?php echo htmlspecialchars($user['username']); ?>!</h2>
            <p>Member since: <?php echo date('F j, Y', strtotime($user['created_at'])); ?></p>
            
            <div class="welcome-image">
                <img src="assets/IMG_0094.jpg" alt="Finance Buddy Welcome" class="hero-image">
            </div>
        </div>

        <div class="account-summary">
            <h3>Account Summary</h3>
            <?php foreach ($accounts as $account): ?>
                <div class="account-card">
                    <h4><?php echo ucfirst($account['account_type']); ?> Account</h4>
                    <p>Balance: $<?php echo number_format($account['balance'], 2); ?></p>
                    <a href="html/<?php echo $account['account_type']; ?>.php" class="view-details">View Details</a>
                </div>
            <?php endforeach; ?>
        </div>

        <?php if ($credit_score): ?>
        <div class="credit-summary">
            <h3>Credit Score Overview</h3>
            <div class="score-card">
                <h4>Current Score: <?php echo $credit_score['score']; ?></h4>
                <p>Last Updated: <?php echo date('M d, Y', strtotime($credit_score['score_date'])); ?></p>
                <a href="html/credit-score.php" class="view-details">View Details</a>
            </div>
        </div>
        <?php endif; ?>

        <div class="recent-transactions">
            <h3>Recent Transactions</h3>
            <?php
            $conn = connectDB();
            $stmt = $conn->prepare("
                SELECT * FROM transactions 
                WHERE user_id = ? 
                ORDER BY transaction_date DESC 
                LIMIT 5
            ");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $recent_transactions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $conn->close();
            ?>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Account</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_transactions as $transaction): ?>
                        <tr>
                            <td><?php echo date('M d, Y', strtotime($transaction['transaction_date'])); ?></td>
                            <td><?php echo ucfirst($transaction['type']); ?></td>
                            <td>$<?php echo number_format($transaction['amount'], 2); ?></td>
                            <td><?php echo ucfirst($transaction['from_account']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <a href="html/transactions.php" class="view-all">View All Transactions</a>
        </div>
    </div>
</body>
</html> 