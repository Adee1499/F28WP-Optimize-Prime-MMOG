<?php

// Connecting to mysql database - host, username, password
$con = mysqli_connect('localhost', 'id15359279_prime', 'YC[AuLan|UHxvi0+');

// Specifically selects a database from the server (could be placed in $con but it's good here)
mysqli_select_db($con, 'id15359279_pacman');

// POST > GET as it doesn't put it in URL
$name = mysqli_real_escape_string($con, $_POST['user']);
$pass = mysqli_real_escape_string($con, $_POST['password']);


// This wilL create a variable of the values of the row if the username is already in it
// mysqli_real_escape_string should remove special characters in the string
$userCheck = " select * from usertable where name ='$name' && password = '$pass'";

$result = mysqli_query($con, $userCheck);

$num = mysqli_num_rows($result);

// $num will be 1 if a user of the name and password exists (both have to be correct)
if ($num == 1){
    $scoreSql = "SELECT * FROM usertable WHERE name = '$name';";
    $result = mysqli_query($con, $scoreSql);
    $resultCheck = mysqli_num_rows($result);
    if($resultCheck > 0){
        while($row = mysqli_fetch_assoc($result)){
            $score = $row['score'];
        }
    }


    include '../client/html/game.html';
    echo "Username: ", $name, "      High Score: ", $score;
}
else{
    include '../client/html/index.html';
    echo "<script type='text/javascript'>alert('Unsuccessful login attempt')</script>";
}



?>