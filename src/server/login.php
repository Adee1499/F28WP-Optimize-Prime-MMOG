<?php

// Connecting to mysql database - host, username, password, database
$con = mysqli_connect('localhost', 'id15359279_prime', 'YC[AuLan|UHxvi0+', 'id15359279_pacman');


// POST > GET as it doesn't put it in URL
// mysqli_real_escape_string should remove special characters in the string
$name = mysqli_real_escape_string($con, $_POST['user']);
$pass = mysqli_real_escape_string($con, $_POST['password']);
$num = 0;

// This wilL create a variable of the values of the row if the username is already in it
// mysqli_real_escape_string should remove special characters in the string
// PREPARED STATEMENT THAT WILL CHECK USER EXISTS
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

// $num will be 1 if a user of the name and password exists (both have to be correct)
if ($num == 1){
    $hashedPass = " SELECT * FROM usertable WHERE name = ?";
    $stmt = mysqli_stmt_init($con);
    if(!mysqli_stmt_prepare($stmt, $hashedPass)){
        echo "SQL statement failed";
        $hashedPw = "failed";
    }
    else{
        mysqli_stmt_bind_param($stmt, "s", $name);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)) {
            $hashedPw = $row['password'];
        }
    }
    if(password_verify($pass, $hashedPw)){
        // name = ? acts as a placeholder as the statement is prepared
        $scoreSql = "SELECT * FROM usertable WHERE name = ?;";
        // Creating a prepared statement for handling SQL injection to protect database
        $stmt = mysqli_stmt_init($con);

        // Defining the prepared statement
        if(!mysqli_stmt_prepare($stmt, $scoreSql )){
            echo "SQL statement failed";
        }
        else{
            // Bind parameters to the placeholder
            mysqli_stmt_bind_param($stmt, "s", $name);
            // Runs parameters inside the database
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            while($row = mysqli_fetch_assoc($result)){
                // Retrieves the values from the database
                $username = $row['name'];
                $score = $row['score'];

                // Will load up the game page and display the username and their high score together
                include '../client/html/game.html';
                echo "Username: ", $username, "      High Score: ", $score;
            }

        }
    }




}
else{
    include '../client/html/index.html';
    echo "<script type='text/javascript'>alert('Unsuccessful login attempt')</script>";
}



?>