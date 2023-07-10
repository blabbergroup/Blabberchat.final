<?php
$name = $_POST["name"];
$email = $_POST["email"];
$password = $_POST["password"];
$password_encode = hash("sha512", $password);
$userName = $_POST["username"];

# echo $password . ", " . $password_encode . ", " . $userName . ", " . $email . ", " . $name;


$host = NULL;
$port = 3306;
$dbname = 'somethingdb';
$user = 'user1';
$pass = 'pass';
$charset = 'utf8mb4';

$dbc = mysqli_connect($host, $user, $pass, $dbname);

# $sql = "insert into accounts(id, username, password, email, fullname, isAdmin) values(NULL, '$userName', '$password_encode', '$email', '$name', 0)";
# https://www.studentstutorial.com/php/signup-login-form-in-php-mysql
session_start();
$sql = "select * from accounts where email = '$email' and password = '$password_encode'";
$row = mysqli_fetch_array($sql);
if(is_array($row)){
    $_SESSION["Email"]=$row['email'];
}

//WE WERE MISSING SINGLE QUOTES
//THAT IS SO FRUSTRATING



