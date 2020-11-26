<?php

// Connecting to mysql database - host, username, password, database
$con = mysqli_connect('localhost', 'id15359279_prime', 'YC[AuLan|UHxvi0+', 'id15359279_pacman');


// POST > GET as it doesn't put it in URL
// mysqli_real_escape_string should remove special characters in the string
$name = mysqli_real_escape_string($con, $_POST['user']);
$pass = mysqli_real_escape_string($con, $_POST['password']);
$num = 0;

// Prepared statement that will check user actually exists
$userCheck = " select name from usertable where name = ?";
$stmt = mysqli_stmt_init($con);
// Fail case if statement
if(!mysqli_stmt_prepare($stmt, $userCheck)){
    echo "SQL statement failed";
}
else{
    mysqli_stmt_bind_param($stmt, "s", $name);  // Binds parameters to the placeholder
    mysqli_stmt_execute($stmt);                             // Executes the prepared statement
    $result = mysqli_stmt_get_result($stmt);                // Retrieves the result from the query
    $num = mysqli_num_rows($result);                        // Will return 1 if username exists in database.
}

// $num will be 1 if a user of the name exists, next the password will be checked
if ($num == 1){
    // Prepared statement that will retrieves the password associated with the user, ? is placeholder for $name
    $hashedPass = " SELECT * FROM usertable WHERE name = ?";
    $stmt = mysqli_stmt_init($con);
    // Fail case if statement
    if(!mysqli_stmt_prepare($stmt, $hashedPass)){
        echo "SQL statement failed";
        $hashedPw = "failed";
    }
    // Will proceed to retrieve the encrypted value of the password
    else{
        mysqli_stmt_bind_param($stmt, "s", $name);      // Binds parameter to the placeholder
        mysqli_stmt_execute($stmt);                                 // Execute the prepared statement
        $result = mysqli_stmt_get_result($stmt);                    // Retrieves the result from the query

        // I found this while() block of code unnecessary, however, I tried other ways of getting the
        // hashedPw but only this worked from my attempts
        while($row = mysqli_fetch_assoc($result)) {
            $hashedPw = $row['password'];
        }
    }
    // password_verify returns a boolean value if the password matches the hash and salted value from the database
    if(password_verify($pass, $hashedPw)){
        // Prepared statement that will retrieve the user's name and high score, ? is the placeholder for $name
        $scoreSql = "SELECT name, score FROM usertable WHERE name = ?;";
        $stmt = mysqli_stmt_init($con);

        // Fail case if statement
        if(!mysqli_stmt_prepare($stmt, $scoreSql )){
            echo "SQL statement failed";
        }
        else{
            mysqli_stmt_bind_param($stmt, "s", $name);  // Binds parameter to the placeholder
            mysqli_stmt_execute($stmt);                             // Execute the prepared statement
            $result = mysqli_stmt_get_result($stmt);                // Retrieves the result from the query

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
