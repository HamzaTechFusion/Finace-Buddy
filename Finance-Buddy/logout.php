<?php
require_once 'config/db_connect.php';
session_start();
session_destroy();
header("Location: login.php");
exit();
?> 