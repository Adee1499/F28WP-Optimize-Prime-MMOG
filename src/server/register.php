<?php

session_start();

// Connecting to mysql database - host, username, password
$con = mysqli_connect('sql2.freesqldatabase.com','sql2375164','gP6%fV4*')


mysqli_select_db($con, 'userregistraton')

$name = $_POST['user'];
$name = $_POST['password'];

$s = " select * from usertable where name ='$name'";

$result = mysqli_query($con,$s);

$num = mysqli_num_rows($result);

if($num == 1){
    echo "username already taken";
}else[
    $reg = " insert into usertable(name, password) values ('$name', '$pass')";
    mysqli_query($con, $reg);
    echo "registration done good job";
]
?>