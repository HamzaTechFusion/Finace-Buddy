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
        // Calculate score
        $paymentHistory = intval($data['paymentHistory']);
        $creditUtilization = intval($data['creditUtilization']);
        $accountAge = intval($data['accountAge']);
        $creditTypes = intval($data['creditTypes']);
        $creditInquiries = intval($data['creditInquiries']);

        // Validate inputs
        if ($paymentHistory < 0 || $paymentHistory > 100 || 
            $creditUtilization < 0 || $creditUtilization > 100 ||
            $accountAge < 0 || $creditTypes < 0 || $creditInquiries < 0) {
            throw new Exception('Invalid input values');
        }

        $rawScore = ($paymentHistory * 0.35) +
                   ((100 - $creditUtilization) * 0.30) +
                   (min($accountAge, 15) * 0.15) +
                   (min($creditTypes, 5) * 0.10) +
                   ((10 - min($creditInquiries, 10)) * 0.10);

        $finalScore = round((($rawScore / 68.75) * 550) + 300);

        // Save score to database
        $stmt = $conn->prepare("INSERT INTO credit_scores (
            user_id, score, payment_history, credit_utilization,
            account_age, credit_types, credit_inquiries
        ) VALUES (?, ?, ?, ?, ?, ?, ?)");

        $stmt->bind_param("iiiiiii", 
            $user_id, $finalScore, $paymentHistory, $creditUtilization,
            $accountAge, $creditTypes, $creditInquiries
        );
        $stmt->execute();

        $response['success'] = true;
        $response['score'] = $finalScore;
        $response['tips'] = generateTips($paymentHistory, $creditUtilization, $accountAge, $creditTypes, $creditInquiries);
        
    } catch (Exception $e) {
        http_response_code(400);
        $response['error'] = $e->getMessage();
    }
    
    $conn->close();
}

echo json_encode($response);

function generateTips($paymentHistory, $creditUtilization, $accountAge, $creditTypes, $creditInquiries) {
    $tips = [];
    if ($paymentHistory < 100) $tips[] = "Improve your payment history by paying bills on time.";
    if ($creditUtilization > 30) $tips[] = "Lower your credit utilization to below 30%.";
    if ($accountAge < 15) $tips[] = "Keep older accounts open to improve account age.";
    if ($creditTypes < 5) $tips[] = "Diversify your credit by adding different types.";
    if ($creditInquiries > 2) $tips[] = "Avoid too many recent credit inquiries.";
    return empty($tips) ? ["You're doing great!"] : $tips;
}
?> 