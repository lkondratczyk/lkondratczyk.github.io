<?php
if(isset($_POST['email_entry'])) {
    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_to = "lkondratczyk@yahoo.com";
    $email_subject = "Test form";

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
 
    function died($error) {
 
        // your error code can go here
 
        echo "We are very sorry, but there were error(s) found with the form you submitted. "; 
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
 
    // validation expected data exists
 
    if(!isset($_POST['name_entry']) || 
			!isset($_POST['email_entry']) ||
			!isset($_POST['phone_entry']) ||
			!isset($_POST['item_entry']) ||
			!isset($_POST['month_entry']) ||
			!isset($_POST['day_entry']) ||
			!isset($_POST['year_entry']) ||
			!isset($_POST['time_entry']) ||
			!isset($_POST['payment_entry']) ||
			!isset($_POST['message_entry'])) {
		died('We are sorry, but there appears to be a problem with the form you submitted.');       
 
    }
 
     
 
    $name = $_POST['name_entry']; 
    $email = $_POST['email_entry']; 
    $phone = $_POST['phone_entry']; 
	$item = $_POST['item_entry'];
	$month = $_POST['month_entry'];
	$day = $_POST['day_entry'];
	$year = $_POST['year_entry'];
	$time = $_POST['time_entry'];
	$pp = $_POST['payment_entry'];
    $comments = $_POST['message_entry'];
 
    $error_message = "";
 
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
	
	if(IsInjected($email))
	{
		echo "Bad email value!";
		exit;
	}
 
	if(!preg_match($email_exp,$email)) {
		$error_message .= 'The Email Address you entered does not appear to be valid.<br />';
	}
 
	$string_exp = "/^[A-Za-z .'-]+$/";
	
 	if(!preg_match($string_exp,$name)) {
		$error_message .= 'The Name you entered does not appear to be valid.<br />';
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
    $email_message .= "Telephone: ".clean_string($phone)."\n";
	$email_message .= "Item Reserved: ".clean_string($item)."\n";
	$email_message .= "Reservation Date: $month $day, $year\n"
	$email_message .= "Reservation Time: $time\n";
	$email_message .= "Payment Type: $pp\n";
    $email_message .= "Additional Comments: ".clean_string($comments)."\n\n Please do not respond to this email directly"; 
     
// create email headers
 
$headers = 'From: lyndon@lyndonk.com\r\n'.
 
'Reply-To: lyndon@lyndonk.com\r\n"'.
 
'X-Mailer: PHP/' . phpversion();
 
@mail($email_to, $email_subject, $email_message, $headers);  

if ($method == 'PayPal') {

    // Prepare GET data
    $query = array();
    $query['notify_url'] = 'http://jackeyes.com/ipn';
    $query['cmd'] = '_cart';
    $query['upload'] = '1';
    $query['business'] = 'social@jackeyes.com';
    $query['address_override'] = '1';
    $query['first_name'] = $first_name;
    $query['last_name'] = $last_name;
    $query['email'] = $email;
    $query['address1'] = $ship_to_address;
    $query['city'] = $ship_to_city;
    $query['state'] = $ship_to_state;
    $query['zip'] = $ship_to_zip;
    $query['item_name_'.$i] = $item['description'];
    $query['quantity_'.$i] = $item['quantity'];
    $query['amount_'.$i] = $item['info']['price'];

    // Prepare query string
    $query_string = http_build_query($query);

    header('Location: https://www.paypal.com/cgi-bin/webscr?' . $query_string);
}
 
?>
 
 
 
<!-- include your own success html here -->
 
 
 
Thank you for contacting us. We will be in touch with you very soon.
 
 
 
<?php
 
}
 
?>