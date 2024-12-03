<?php
require_once '../config/db_connect.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$conn = connectDB();

// Get transactions
$stmt = $conn->prepare("
    SELECT 
        transaction_date,
        type,
        from_account,
        to_account,
        amount
    FROM transactions 
    WHERE user_id = ?
    ORDER BY transaction_date DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$transactions = $result->fetch_all(MYSQLI_ASSOC);

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction History - Finance Buddy</title>
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

        <h1>Transaction History</h1>
        
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($transactions as $transaction): ?>
                    <tr>
                        <td><?php echo date('M d, Y H:i', strtotime($transaction['transaction_date'])); ?></td>
                        <td><?php echo ucfirst($transaction['type']); ?></td>
                        <td><?php echo ucfirst($transaction['from_account']); ?></td>
                        <td><?php echo $transaction['to_account'] ? ucfirst($transaction['to_account']) : '-'; ?></td>
                        <td>$<?php echo number_format($transaction['amount'], 2); ?></td>
                    </tr>
                <?php endforeach; ?>
                <?php if (empty($transactions)): ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No transactions found.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html> 