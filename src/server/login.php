<?php

// Connecting to mysql database - host, username, password
$con = mysqli_connect('localhost', 'id15359279_prime', 'YC[AuLan|UHxvi0+');

// Specifically selects a database from the server (could be placed in $con but it's good here)
mysqli_select_db($con, 'id15359279_pacman');

// POST > GET as it doesn't put it in URL
$name = mysqli_real_escape_string($con, $_POST['user']);
$pass = mysqli_real_escape_string($con, $_POST['password']);


// This wilL create a variable of the values of the row if the username is already in it
$userCheck = " select * from usertable where name ='$name' && password = '$pass'";

$result = mysqli_query($con, $userCheck);

$num = mysqli_num_rows($result);

// Statement checks that there'll be no duplicate usernames
if ($num == 1){
    include '../client/html/game.html';
    echo "welcome";
}
else{
    include '../client/html/index.html';
    echo "<script type='text/javascript'>alert('Unsuccessful login attempt')</script>";
}



?>