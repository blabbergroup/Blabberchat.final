<?php
$name = $_POST["name"];
$email = $_POST["email"];
$password = $_POST["password"];
$password_encode = hash("sha512", $password);
$userName = $_POST["username"];

# echo $password . ", " . $password_encode . ", " . $userName . ", " . $email . ", " . $name;


$host = NULL;
$port = 3306;
$dbname = 'eventdb';
$user = 'Mathen';
$pass = 'SackMathen_0';
$charset = 'utf8mb4';

$dbc = mysqli_connect($host, $user, $pass, $dbname);

$sql = "insert into accounts(id, username, password, email, fullname, isAdmin, uuid) 
values(NULL, '$userName', '$password_encode', '$email', '$name', 0, null)";
//WE WERE MISSING SINGLE QUOTES
//THAT IS SO FRUSTRATING


if (mysqli_query($dbc, $sql)) {
    echo "New record created successfully";
    header("Location: http://blabberchat.asuscomm.com:3000");
} else {
    echo "Error: " . $sql . "<br/>" . $dbc->error;
}
mysqli_close($dbc);
