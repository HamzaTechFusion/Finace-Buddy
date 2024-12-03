<?php
require_once '../config/db_connect.php';

header('Content-Type: application/json');

// Ensure user is logged in
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];
$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $conn = connectDB();
    
    try {
        $conn->begin_transaction();
        
        switch ($data['action']) {
            case 'deposit':
                handleDeposit($conn, $user_id, $data);
                break;
                
            case 'withdraw':
                handleWithdraw($conn, $user_id, $data);
                break;
                
            case 'transfer':
                handleTransfer($conn, $user_id, $data);
                break;
                
            default:
                throw new Exception('Invalid action');
        }
        
        $conn->commit();
        $response['success'] = true;
        
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(400);
        $response['error'] = $e->getMessage();
    }
    
    $conn->close();
}

echo json_encode($response);

function handleDeposit($conn, $user_id, $data) {
    // Validate amount
    $amount = floatval($data['amount']);
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Update account balance
    $stmt = $conn->prepare("UPDATE accounts SET balance = balance + ? WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("dis", $amount, $user_id, $data['account_type']);
    $stmt->execute();
    
    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, from_account, amount, type) VALUES (?, ?, ?, 'deposit')");
    $stmt->bind_param("isd", $user_id, $data['account_type'], $amount);
    $stmt->execute();
}

function handleWithdraw($conn, $user_id, $data) {
    $amount = floatval($data['amount']);
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Check balance
    $stmt = $conn->prepare("SELECT balance FROM accounts WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("is", $user_id, $data['account_type']);
    $stmt->execute();
    $result = $stmt->get_result();
    $account = $result->fetch_assoc();
    
    if ($account['balance'] < $amount) {
        throw new Exception('Insufficient funds');
    }
    
    // Update balance
    $stmt = $conn->prepare("UPDATE accounts SET balance = balance - ? WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("dis", $amount, $user_id, $data['account_type']);
    $stmt->execute();
    
    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, from_account, amount, type) VALUES (?, ?, ?, 'withdrawal')");
    $stmt->bind_param("isd", $user_id, $data['account_type'], $amount);
    $stmt->execute();
}

function handleTransfer($conn, $user_id, $data) {
    // Add more detailed debugging
    error_log("Transfer started: " . json_encode($data));
    
    $amount = floatval($data['amount']);
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Fix account type handling
    $from_account = strtolower($data['from_account']);
    $to_account = ($from_account === 'checking') ? 'savings' : 'checking';
    
    error_log("From account: " . $from_account);
    error_log("To account: " . $to_account);
    
    // Check balance in from_account
    $stmt = $conn->prepare("SELECT balance FROM accounts WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("is", $user_id, $from_account);
    $stmt->execute();
    $result = $stmt->get_result();
    $account = $result->fetch_assoc();
    
    if (!$account) {
        error_log("Source account not found: " . $from_account);
        throw new Exception('Source account not found');
    }
    
    if ($account['balance'] < $amount) {
        throw new Exception('Insufficient funds');
    }
    
    // Update from account (deduct amount)
    $stmt = $conn->prepare("UPDATE accounts SET balance = balance - ? WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("dis", $amount, $user_id, $from_account);
    if (!$stmt->execute()) {
        error_log("Failed to update source account: " . $conn->error);
        throw new Exception('Failed to update source account');
    }
    
    // Update to account (add amount)
    $stmt = $conn->prepare("UPDATE accounts SET balance = balance + ? WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("dis", $amount, $user_id, $to_account);
    if (!$stmt->execute()) {
        error_log("Failed to update destination account: " . $conn->error);
        throw new Exception('Failed to update destination account');
    }
    
    // Verify the updates
    $stmt = $conn->prepare("SELECT account_type, balance FROM accounts WHERE user_id = ? AND (account_type = ? OR account_type = ?)");
    $stmt->bind_param("iss", $user_id, $from_account, $to_account);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        error_log("After transfer - Account: " . $row['account_type'] . ", Balance: " . $row['balance']);
    }
    
    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, from_account, to_account, amount, type) VALUES (?, ?, ?, ?, 'transfer')");
    $stmt->bind_param("issd", $user_id, $from_account, $to_account, $amount);
    if (!$stmt->execute()) {
        error_log("Failed to log transaction: " . $conn->error);
        throw new Exception('Failed to log transaction');
    }
}
?> 