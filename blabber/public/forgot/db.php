<?php
//https://www.allphptricks.com/forgot-password-recovery-reset-using-php-and-mysql/
$dbc = new mysqli("localhost","user1","pass","somethingdb");
if (mysqli_connect_errno()){
echo "Failed to connect to MySQL: " . mysqli_connect_error();
die();
}

date_default_timezone_set('America/Chicago');
