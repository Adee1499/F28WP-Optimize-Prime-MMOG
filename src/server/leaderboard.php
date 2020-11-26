<?php

// Establishes connection to the SQL database
$con = mysqli_connect('localhost', 'id15359279_prime', 'YC[AuLan|UHxvi0+', 'id15359279_pacman');

// Prepared statement to get all the names and score from the usertable in the database
$scoreBoard = " SELECT name, score FROM usertable";
$stmt = mysqli_stmt_init($con);
if(!mysqli_stmt_prepare($stmt, $scoreBoard)){
    echo "SQL statement failed";
}
else{
    // Executes the prepared statement
    mysqli_stmt_execute($stmt);
    // Retrieves the result
    $result = mysqli_stmt_get_result($stmt);
    // arrayLength = the amount of rows present in the database that will be compared with.
    $arrayLength = mysqli_num_rows($result);
    $x = 0;     // Used for incrementing for the array
    $scoreList = array("Player1", 0);   // Creates an array with placeholder element

    while($row = mysqli_fetch_assoc($result)){
        // Inserts rows from the database into the scoreList array
        $scoreList[$x] = array($row['name'], $row['score']);
        $x++;
    }
    // Insertion Sort, I'm sorry Rob, this one's got a complexity of O(N²), but at least it's better than bubble :)
    // Will be used to sort all the rows in the scoreList in descending order
    for ($x = 1; $x < $arrayLength; $x++){
        $cur = $scoreList[$x];
        $j = $x - 1;
        while ($j >= 0 && $scoreList[$j][1] < $cur[1]){
            $scoreList[$j+1] = $scoreList[$j--];
            $scoreList[$j+1] = $cur;
        }
    }

    // If statement to have the maximum amount of rows in the leaderboard be 25
    // Prints out whichever one is smaller.
    if(25 > $arrayLength){
        for($x = 0; $x < 25; $x++){
            echo "<br>", $scoreList[$x][0], " with a score of: ", $scoreList[$x][1];
        }
    }
    else{
        for($x = 0; $x < $arrayLength; $x++){
            echo "<br>", $scoreList[$x][0], " with a score of: ", $scoreList[$x][1];
        }
    }
}

?>

