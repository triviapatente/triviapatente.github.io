<?php
$email = $_REQUEST["email"];
$plat = $_REQUEST["platform"];
// $location = fopen("emails.txt", "") or die("Unable to open file!");
// fwrite($location, "\ndahusih");
// fclose($location);
$myfile = file_put_contents('../emails.txt', $email."  ".$plat.PHP_EOL , FILE_APPEND | LOCK_EX);
echo "Done"
?>
