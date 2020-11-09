<?php

session_start();

/*
I've tested this on a website host that comes with an SQL database called 000webhost
freesqldatabase whateveritsfacewascalled, wanted me to pay a years worth of dosh to host on it

You can view it in action with the register form the now at https://pacmanwp.000webhostapp.com/
However, as I logged in with my google account instead of registering separately, you won't be
able to view the database.
*/

// Connecting to mysql database - host, username, password
$con = mysqli_connect('localhost','id15359279_prime','YC[AuLan|UHxvi0+');

// Specifically selects a database from the server (could be placed in $con but it's good here)
mysqli_select_db($con, 'id15359279_pacman');

// POST > GET as it doesn't put it in URL
$name = $_POST['user'];
$pass = $_POST['password'];

// This wilL create a variable of the values of the row if the username is already in it
$s = " select * from usertable where name ='$name'";

$result = mysqli_query($con, $s);

$num = mysqli_num_rows($result);

// Statement checks that there'll be no duplicate usernames
if($num == 1){
    echo "username already taken";
}
// Otherwise, goes ahead with the procedure of creating an account
else {
    $reg = " INSERT into usertable(name, password) values ('$name', '$pass')";
    mysqli_query($con, $reg);
    echo "registration done good";
}

?>