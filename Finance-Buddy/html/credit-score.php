<?php
require_once '../config/db_connect.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$conn = connectDB();

// Get latest credit score
$stmt = $conn->prepare("
    SELECT * FROM credit_scores 
    WHERE user_id = ? 
    ORDER BY score_date DESC 
    LIMIT 1
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$latest_score = $result->fetch_assoc();

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credit Score Calculator - Finance Buddy</title>
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

        <h1>Credit Score Calculator</h1>

        <?php if ($latest_score): ?>
        <div class="latest-score">
            <h2>Your Latest Credit Score</h2>
            <p>Score: <?php echo $latest_score['score']; ?></p>
            <p>Calculated on: <?php echo date('M d, Y', strtotime($latest_score['score_date'])); ?></p>
        </div>
        <?php endif; ?>

        <form id="creditScoreForm">
            <label>Payment History (%):
                <input type="number" id="paymentHistory" max="100" min="0" required>
            </label>
            <label>Credit Utilization (%):
                <input type="number" id="creditUtilization" max="100" min="0" required>
            </label>
            <label>Account Age (Years):
                <input type="number" id="accountAge" min="0" required>
            </label>
            <label>Credit Types:
                <input type="number" id="creditTypes" min="0" required>
            </label>
            <label>Credit Inquiries:
                <input type="number" id="creditInquiries" min="0" required>
            </label>
            <button type="button" onclick="calculateScore()">Calculate</button>
        </form>

        <div id="output">
            <h2>Results:</h2>
            <p id="scoreResult"></p>
            <p id="scoreMessage"></p>
            <h3>Improvement Tips:</h3>
            <ul id="improvementTips"></ul>
        </div>
    </div>

    <script>
    async function calculateScore() {
        const data = {
            paymentHistory: parseInt(document.getElementById("paymentHistory").value) || 0,
            creditUtilization: parseInt(document.getElementById("creditUtilization").value) || 0,
            accountAge: parseInt(document.getElementById("accountAge").value) || 0,
            creditTypes: parseInt(document.getElementById("creditTypes").value) || 0,
            creditInquiries: parseInt(document.getElementById("creditInquiries").value) || 0
        };

        try {
            const response = await fetch('../api/credit_score_operations.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Calculation failed');
            }

            displayResults(result.score, result.tips);

        } catch (error) {
            alert(error.message);
        }
    }

    function displayResults(score, tips) {
        const scoreResult = document.getElementById("scoreResult");
        const scoreMessage = document.getElementById("scoreMessage");
        const tipsList = document.getElementById("improvementTips");
        
        scoreResult.textContent = `Your credit score is ${score}`;
        
        if (score >= 750) {
            scoreMessage.textContent = "Excellent credit score!";
            scoreMessage.style.color = "green";
        } else if (score >= 650) {
            scoreMessage.textContent = "Good credit score!";
            scoreMessage.style.color = "blue";
        } else if (score >= 550) {
            scoreMessage.textContent = "Fair credit score!";
            scoreMessage.style.color = "orange";
        } else {
            scoreMessage.textContent = "Poor credit score!";
            scoreMessage.style.color = "red";
        }

        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join("");
    }
    </script>
</body>
</html> 