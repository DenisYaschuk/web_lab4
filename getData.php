<?php
include_once("common.php");  
    $results = mysqli_query($conn, "SELECT * FROM canvas_options") or die(mysqli_error($conn));
    $cavasDataArr = array();
    foreach($results as $value){
        $cavasDataArr[$value['name']] = $value['value'];
    }
    echo json_encode($cavasDataArr);
    
?>