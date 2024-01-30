<?php
    $inData = getRequestInfo();
    $Login = $inData["Login"];
    $ID = $inData["ID"];

    // Create database connection
    $conn = new mysqli("localhost", "TheApi", "1verygoodPassword", "COP4331");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // Prepare SQL statement with both login and ID conditions
        $stmt = $conn->prepare("DELETE FROM Users WHERE Login = ? AND ID = ?");
        $stmt->bind_param("si", $Login, $ID);
        
        if($stmt->execute())
        {
            echo json_encode(["message" => "User was deleted"]);
        }
        else
        {
            returnWithError($conn->error);
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
