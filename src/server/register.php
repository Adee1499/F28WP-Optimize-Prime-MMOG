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
// Default $num value if SQL statement fails
$num = 0;

// Prepared statement that checks if the username already exists, ? is placeholder for $name
$userCheck = " select name from usertable where name = ?";
$stmt = mysqli_stmt_init($con);
// Fail case if statement
if(!mysqli_stmt_prepare($stmt, $userCheck)){
    echo "SQL statement failed";
}
else{
    mysqli_stmt_bind_param($stmt, "s", $name);  // Binds parameter to the placeholder
    mysqli_stmt_execute($stmt);                             // Execute the prepared statement
    $result = mysqli_stmt_get_result($stmt);                // Retrieves the result from the query
    $num = mysqli_num_rows($result);                        // Will return 1 if username exists in database
}

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
    // Prepared statement for inserting data into the database, series of ? acts as placeholder for
    // $name, the eventual hashed and salted password & $score
    $reg = " INSERT INTO usertable(name, password, score) VALUES (?, ?, ?)";
    $stmt = mysqli_stmt_init($con);

    // Fail case if statement
    if(!mysqli_stmt_prepare($stmt, $reg)){
        echo "SQL statement failed";
    }
    else{
        // Hashing and salting the password being inserted into the database
        $hashedPass = password_hash($pass, PASSWORD_DEFAULT);
        // Binding parameters passed into the database, "ssi" indicates the types of data being passed in order
        // s = string, i = integer and then the $name, $hashedPass
        mysqli_stmt_bind_param($stmt, "ssi", $name, $hashedPass, $score);
        mysqli_stmt_execute($stmt);
        // Tell the user it worked!
        echo "<script type='text/javascript'>alert('Account successfully registered!')</script>";
    }
}

?>