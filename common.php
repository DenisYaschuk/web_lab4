<?php

if (!isset($_SESSION)){
    $long = ip2long($_SERVER['REMOTE_ADDR']);
    if($long){
        session_id($long);
        session_start();
    }else{
        session_id("local");
        session_start();
    }
    
}


ini_set('display_errors',1);
error_reporting(E_ALL ^E_NOTICE ^E_WARNING);
//mcC6R5ANrKEW3X7o_
$conn = new mysqli("localhost", "CovidGuy", "mcC6R5ANrKEW3X7o", "web_lab3");
if ($conn->connect_error){
	die("Database connection error: " . $conn->connect_error);
}

?>