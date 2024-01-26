<?php
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $Phone = $inData["Phone"];
    $Email = $inData["Email"];

    // Create database connection
    $conn = new mysqli("localhost", "TheApi", "1verygoodPassword", "COP4331");

    // Check connection
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // Use UPDATE query with Email as the condition
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=? WHERE Email=?");
        $stmt->bind_param("ssss", $firstName, $lastName, $Phone, $Email);

        if($stmt->execute())
        {
            echo json_encode(["message" => "Contact Record was updated"]);
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
