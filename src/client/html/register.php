<?php

session_start();

// Connecting to mysql database - host, username, password
$con = mysqli_connect('sql2.freesqldatabase.com','sql2375164','gP6%fV4*');


mysqli_select_db($con, 'sql2375164');

$name = $_POST['user'];
$pass = $_POST['password'];

$s = " SELECT * FROM usertable WHERE name ='$name'";

$result = mysqli_query($con, $s);

$num = mysqli_num_rows($result);

// If statement checks that there'll be no duplicate usernames
if($num == 1){
    echo "username already taken";

}
// Otherwise, goes ahead with the procedure
else {
    $reg = " INSERT into usertable(name, password) values ('$name', '$pass')";
    mysqli_query($con, $reg);
    echo "registration done good job";
}
?>