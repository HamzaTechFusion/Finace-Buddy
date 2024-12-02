<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username'); // Replace 'your_username' with your database username (e.g., root for XAMPP)
define('DB_PASS', 'your_password'); // Replace 'your_password' with your database password (leave empty for XAMPP)
define('DB_NAME', 'finance_buddy'); // Replace 'finance_buddy' with your database name

/**
 * Function to connect to the database
 * 
 * @return mysqli Database connection object
 */
function connectDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check the connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

/**
 * Function to check if user is logged in
 * 
 * @return bool True if user is logged in, false otherwise
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Function to require login
 * Redirects to login page if user is not logged in
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: /login.php");
        exit();
    }
}
?> 
