<?php
// Just thrown this together what it might be like


$con = mysqli_connect('localhost','id15359279_prime','YC[AuLan|UHxvi0+', 'id15359279_pacman');

$user = mysqli_real_escape_string($con, $_POST['user']);
$score = mysqli_real_escape_string($con, $_POST['score']);

// Prepared statement that will update the score of the user
$scoreUpdate = "UPDATE usertable SET score = ? WHERE name = ?";
$stmt = mysqli_stmt_init($con);
// Fail case if statement
if(!mysqli_stmt_prepare($stmt, $scoreUpdate)){
    echo "SQL statement failed";
}
else{
    mysqli_stmt_bind_param($stmt, "is", $score, $name);
    mysqli_stmt_execute();
    include "../client/html/gameover.html";
}

?>

