<?php
 /** Handles form emailing for reservation forms **/
 
if(isset($_POST['email_entry'])) {
 
	//this is where the email is going
    $email_to = "ron@divecatalina.net";
 
	//this is where the email is going
    $email_subject = "Snorkelling Reservation Request";
 
    //standard check for harmful injections
	function IsInjected($str)
	{
		$injections = array('(\n+)',
			   '(\r+)',
			   '(\t+)',
			   '(%0A+)',
			   '(%0D+)',
			   '(%08+)',
			   '(%09+)'
			   );	
		$inject = join('|', $injections);
		$inject = "/$inject/i";
		if(preg_match($inject,$str))
		{
		  return true;
		}
		else
		{
		  return false;
		}
	}
 
	//sends message in case of error
    function died($error) { 
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
 
    //validation expected data exists 
    if(!isset($_POST['name_entry']) || 
			!isset($_POST['email_entry']) ||
			!isset($_POST['phone_entry']) ||
			!isset($_POST['item_entry']) ||
			!isset($_POST['datepicker']) ||
			!isset($_POST['time_entry']) ||
			!isset($_POST['payment_entry']) ||
			!isset($_POST['message_entry'])) {
		died('We are sorry, but there appears to be a problem with the form you submitted.');       

    }
 
     
	//assignment of data fields
    $name = $_POST['name_entry']; 
    $email = $_POST['email_entry']; 
    $phone = $_POST['phone_entry']; 
	$item = $_POST['item_entry'];
	$date = $_POST['datepicker'];
	$time = $_POST['time_entry'];
	$pp = $_POST['payment_entry'];
    $comments = $_POST['message_entry'];
    $error_message = "";
	
	//check email for injections
	if(IsInjected($email))
	{
		echo "Bad email value!";
		exit;
	}
 
	//checks for invalid email addresses
	$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
	if(!preg_match($email_exp,$email)) {
		$error_message .= 'The Email Address you entered does not appear to be valid.<br />';
	}
 
	//checks for name validity
	$string_exp = "/^[A-Za-z .'-]+$/";
 	if(!preg_match($string_exp,$name)) {
		$error_message .= 'The Name you entered does not appear to be valid.<br />';
	}
	
	//checks for error messages
	if(strlen($error_message) > 0) {
		died($error_message);
	}
 
	//compose message
	$email_message = "Reservation details below.\n\n";  
    function clean_string($string) {
		$bad = array("content-type","bcc:","to:","cc:","href");
		return str_replace($bad,"",$string);
    }
 
	//message body
    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email)."\n";
    $email_message .= "Telephone: ".clean_string($phone)."\n";
	$email_message .= "Item Reserved: ".clean_string($item)."\n";
	$email_message .= "Reservation Date: $date\n";
	$email_message .= "Reservation Time: $time\n";
	$email_message .= "Payment Type: $pp\n";
    $email_message .= "Additional Comments: ".clean_string($comments)."\n\n Please do not respond to this email directly";
 
// create email headers
$headers = 'From: ron@divecatalina.net\r\n'.
'Reply-To: ron@divecatalina.net\r\n"'.
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);  
?>
 
 <!--LOOK INTO SMTP authentication submussion -->
 
<!-- include your own success html here -->
 
 
 
Thank you for contacting us. We will be in touch with you very soon.
 
 
 
<?php
 
}
 
?>