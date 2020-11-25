<?php

include '../client/html/index.html';

/*
I've tested this on a website host that comes with an SQL database called 000webhost
freesqldatabase whateveritsfacewascalled, wanted me to pay a years worth of dosh to host on it

You can view it in action with the register form the now at https://pacmanwp.000webhostapp.com/
However, as I logged in with my google account instead of registering separately, you won't be
able to view the database.
*/

// Connecting to mysql database - host, username, password
$con = mysqli_connect('localhost','id15359279_prime','YC[AuLan|UHxvi0+', 'id15359279_pacman');


// POST > GET as it doesn't put it in URL
// mysqli_real_escape_string should remove special characters in the string
$name = mysqli_real_escape_string($con, $_POST['user']);
$pass = mysqli_real_escape_string($con, $_POST['password']);
$score = 0;
$num = 0;

// PREPARED STATEMENT FOR CHECKING IF USERNAME ALREADY EXISTS
// This wilL create a variable of the values of the row if the username is already in it
$userCheck = " select name from usertable where name = ?";
$stmt = mysqli_stmt_init($con);
if(!mysqli_stmt_prepare($stmt, $userCheck)){
    echo "SQL statement failed";
}
else{
    mysqli_stmt_bind_param($stmt, "s", $name);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $num = mysqli_num_rows($result);
}

//$result = mysqli_query($con, $userCheck);

//$num = mysqli_num_rows($result);

// Statement checks that there'll be no duplicate usernames
if($num == 1){
    echo "<script type='text/javascript'>alert('Username already registered')</script>";
}
// Two else ifs check if the user is creating too long of an account parameter (for their own sake)
elseif(strlen($name) > 20){
    echo "<script type='text/javascript'>alert('Username too long, please make it 20 or less characters long')</script>";
}
elseif (strlen($pass) > 20){
    echo "<script type='text/javascript'>alert('Password too long, please make it 20 or less characters long')</script>";
}
// Otherwise, goes ahead with the procedure of creating an account
else {

    // PREPARED STATEMENT FOR INSERTING DATA INTO DATABASE
    $reg = " INSERT INTO usertable(name, password, score) VALUES (?, ?, ?)";
    // Creating a prepared statement for handling SQL injection to protect database
    $stmt = mysqli_stmt_init($con);

    // Defining the prepared statement
    if(!mysqli_stmt_prepare($stmt, $reg)){
        echo "SQL statement failed";
    }
    else{
        // Hashing and salting the password being inserted into the database
        $hashedPass = password_hash($pass, PASSWORD_DEFAULT);
        // Binding parameters to the placeholder, types "ssi" indicates type of data being passed in
        mysqli_stmt_bind_param($stmt, "ssi", $name, $hashedPass, $score);
        // Runs the parameters inside the database - will register an account
        mysqli_stmt_execute($stmt);
        // Tell the user it worked!
        echo "<script type='text/javascript'>alert('Account successfully registered!')</script>";
    }
}

?>