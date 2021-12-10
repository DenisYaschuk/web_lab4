<?php
include_once("common.php");
    if(isset($_POST['ajax'])){     
        
        $result = mysqli_query($conn, "UPDATE `canvas_options` SET `value`='".mysqli_real_escape_string($conn,$_POST['value'])."'
        WHERE  `name` = '".mysqli_real_escape_string($conn,$_POST['name'])."' ") or die(mysqli_error($conn));
        

        echo json_encode(['error'=>0,'name'=>'success']);
    }
    else{
        echo json_encode(['error' => 1, 'name' => "Something went wrong."]);
    }
    
?>