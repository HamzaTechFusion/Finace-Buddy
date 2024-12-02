<?php
require_once '../config/db_connect.php';

header('Content-Type: application/json');

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
            case 'charge':
                handleCharge($conn, $user_id, $data);
                break;
                
            case 'payment':
                handlePayment($conn, $user_id, $data);
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

function handleCharge($conn, $user_id, $data) {
    $amount = floatval($data['amount']);
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Update credit card balance
    $stmt = $conn->prepare("UPDATE credit_cards SET balance = balance + ? WHERE user_id = ?");
    $stmt->bind_param("di", $amount, $user_id);
    $stmt->execute();
    
    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, from_account, amount, type) VALUES (?, 'credit card', ?, 'charge')");
    $stmt->bind_param("id", $user_id, $amount);
    $stmt->execute();
}

function handlePayment($conn, $user_id, $data) {
    $amount = floatval($data['amount']);
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    // Check if payment is greater than balance
    $stmt = $conn->prepare("SELECT balance FROM credit_cards WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $card = $result->fetch_assoc();
    
    if ($amount > $card['balance']) {
        throw new Exception('Payment amount exceeds balance');
    }
    
    // Update credit card balance
    $stmt = $conn->prepare("UPDATE credit_cards SET balance = balance - ? WHERE user_id = ?");
    $stmt->bind_param("di", $amount, $user_id);
    $stmt->execute();
    
    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, from_account, amount, type) VALUES (?, 'credit card', ?, 'payment')");
    $stmt->bind_param("id", $user_id, $amount);
    $stmt->execute();
}
?> 