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
    $amount = floatval($data['amount']);
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Check balance
    $stmt = $conn->prepare("SELECT balance FROM accounts WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("is", $user_id, $data['from_account']);
    $stmt->execute();
    $result = $stmt->get_result();
    $account = $result->fetch_assoc();
    
    if ($account['balance'] < $amount) {
        throw new Exception('Insufficient funds');
    }
    
    // Update from account
    $stmt = $conn->prepare("UPDATE accounts SET balance = balance - ? WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("dis", $amount, $user_id, $data['from_account']);
    $stmt->execute();
    
    // Update to account
    $stmt = $conn->prepare("UPDATE accounts SET balance = balance + ? WHERE user_id = ? AND account_type = ?");
    $stmt->bind_param("dis", $amount, $user_id, $data['to_account']);
    $stmt->execute();
    
    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, from_account, to_account, amount, type) VALUES (?, ?, ?, ?, 'transfer')");
    $stmt->bind_param("issd", $user_id, $data['from_account'], $data['to_account'], $amount);
    $stmt->execute();
}
?> 