<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailerException;

// Disable raw error output to prevent breaking JSON response
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');

// Include PHPMailer files
try {
    $basePath = __DIR__ . '/PHPMailer/src/';
    require_once $basePath . 'Exception.php';
    require_once $basePath . 'PHPMailer.php';
    require_once $basePath . 'SMTP.php';
} catch (Throwable $t) {
    echo json_encode(['ok' => false, 'error' => "Fatal error loading PHPMailer: " . $t->getMessage()]);
    exit;
}

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Get form data
        $name     = isset($_POST['name']) ? $_POST['name'] : 'Not provided';
        $email    = isset($_POST['email']) ? $_POST['email'] : 'Not provided';
        $phone    = isset($_POST['phone']) ? $_POST['phone'] : 'Not provided';
        $service  = isset($_POST['service']) ? $_POST['service'] : 'Not provided';
        $timeline = isset($_POST['timeline']) ? $_POST['timeline'] : 'Not provided';
        $message  = isset($_POST['message']) ? $_POST['message'] : 'No message';
        
        $subject = "New Project Inquiry from " . $name;

        $mail = new PHPMailer(true);

        // SMTP Settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'example@gmail.com';
        $mail->Password   = 'past your password'; // User's app password
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        // Recipients
        $mail->setFrom('example@gmail.com', 'Darshan Constraction');
        $mail->addAddress('example@gmail.com');
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = "
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <h2 style='color: #E65100;'>New Project Inquiry</h2>
                <p><b>Name:</b> $name</p>
                <p><b>Email:</b> $email</p>
                <p><b>Phone:</b> $phone</p>
                <p><b>Service Type:</b> $service</p>
                <p><b>Expected Timeline:</b> $timeline</p>
                <hr>
                <p><b>Message/Snapshot:</b><br>" . nl2br(htmlspecialchars($message)) . "</p>
            </div>
        ";

        $mail->send();
        echo json_encode(['ok' => true, 'message' => 'Your message has been sent successfully.']);

    } else {
        echo json_encode(['ok' => false, 'error' => 'Invalid request method.']);
    }

} catch (MailerException $e) {
    echo json_encode(['ok' => false, 'error' => "Mailer Error: " . $mail->ErrorInfo]);
} catch (Throwable $e) {
    echo json_encode(['ok' => false, 'error' => "System Error: " . $e->getMessage()]);
}
