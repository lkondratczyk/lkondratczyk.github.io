<?php
 

if(isset($_POST['email'])) {
 
     
 
    // EDIT THE 2 LINES BELOW AS REQUIRED
 
    $email_to = "lkondratczyk@yahoo.com";
 
    $email_subject = "New Reservation Request";
 
  
    function died($error) {
 
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
 
    }
 
   
    // validation expected data exists
 
    if(!isset($_POST['name-entry']) ||
		!isset($_POST['email-entry']) ||
		!isset($_POST['phone-entry']) ||
		!isset($_POST['month-entry']) ||
		!isset($_POST['day-entry']) ||
		!isset($_POST['year-entry']) ||
		!isset($_POST['time-entry']) ||
		!isset($_POST['payment-entry']) ||
		!isset($_POST['message-entry'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted.');       

    }
 
	$name = $_POST['name-input'];
	$email = $_POST['email-input'];
	$phone = $_POST['phone-input'];
	$month = $_POST['month-input'];
	$day = $_POST['day-input'];
	$year = $_POST['year-input'];
	$time = $_POST['time-input'];
	$payment = $_POST['payment-input'];
	$message = $_POST['message-input'];

 
    $error_message = "";
 
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
 
  if(!preg_match($email_exp,$email) || IsInjected($email)) {
 
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
 
  }
 
 
  if(strlen($error_message) > 0) {
 
    died($error_message);
 
  }
 
    $email_message = "Form details below.\n\n";
 
     
 
    function clean_string($string) {
 
      $bad = array("content-type","bcc:","to:","cc:","href");
 
      return str_replace($bad,"",$string);
 
    }
 
     
 
    $email_message .= "Name: ".clean_string($name)."\n";
	$email_message .= "Email: ".clean_string($email)."\n";
	$email_message .= "Phone: ".clean_string($phone)."\n";
	$email_message .= "Date: ".clean_string($month)." ".clean_string($day).", ".clean_string($year)."\n";
    $email_message .= "Time: ".clean_string($time)."\n";
    $email_message .= "Payment type: ".clean_string($payment)."\n";
	$email_message .= "Message: ".clean_string($message)."\n";     
 
     
 
// create email headers
 
$headers = 'From: '.$email."\r\n".
 
'Reply-To: '.$email."\r\n" .
 
'X-Mailer: PHP/' . phpversion();
 
@mail($email_to, $email_subject, $email_message, $headers);  
 
?>
