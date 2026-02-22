<?php
// ─── Заголовки CORS и безопасности ────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ─── Читаем тело запроса ──────────────────────────────────────────────────────
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// ─── Санитизация ──────────────────────────────────────────────────────────────
function clean($val) {
    return htmlspecialchars(strip_tags(trim((string)($val ?? ''))), ENT_QUOTES, 'UTF-8');
}

$name    = clean($data['name']    ?? '');
$company = clean($data['company'] ?? '');
$phone   = clean($data['phone']   ?? '');
$email   = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$product = clean($data['product'] ?? '');
$comment = clean($data['comment'] ?? '');
$date    = date('d.m.Y H:i', time() + 3 * 3600); // МСК UTC+3

// ─── Валидация ────────────────────────────────────────────────────────────────
if (!$phone) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Phone required']);
    exit;
}
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Valid email required']);
    exit;
}

// ─── Конфиг адресов ───────────────────────────────────────────────────────────
$managerEmail = 'Uniseller.io@yandex.ru';
$fromAddress  = 'noreply@uniseller.io';
$fromName     = 'Uniseller';

function makeHeaders($fromName, $fromAddress) {
    return implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        "From: {$fromName} <{$fromAddress}>",
        "Reply-To: {$fromAddress}",
        'X-Mailer: PHP/' . phpversion(),
    ]);
}

function buildManagerEmail($name, $company, $phone, $email, $product, $comment, $date) {
    $companyRow = $company
        ? "<tr><td style='padding:10px 0;width:140px;vertical-align:top;'><span style='font-size:13px;color:rgba(255,255,255,0.35);'>Компания</span></td><td style='padding:10px 0;'><span style='font-size:15px;color:rgba(255,255,255,0.88);font-weight:500;'>{$company}</span></td></tr>"
        : '';
    $productRow = $product
        ? "<tr><td style='padding:10px 0;width:140px;vertical-align:top;'><span style='font-size:13px;color:rgba(255,255,255,0.35);'>Продукт</span></td><td style='padding:10px 0;'><span style='font-size:15px;color:rgba(255,255,255,0.88);font-weight:500;'>{$product}</span></td></tr>"
        : '';
    $commentBlock = $comment
        ? "<tr><td colspan='2' style='padding-top:8px;'>
              <div style='background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px 24px;'>
                <div style='font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,169,44,0.7);margin-bottom:12px;'>Комментарий</div>
                <div style='font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;'>{$comment}</div>
              </div>
           </td></tr>"
        : '';
    $nameDisplay = $name ?: '—';

    return "<!DOCTYPE html>
<html lang='ru'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Новая заявка — Uniseller</title></head>
<body style='margin:0;padding:0;background:#0f0f0f;font-family:\"Helvetica Neue\",Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#0f0f0f;padding:40px 20px;'>
    <tr><td align='center'>
      <table width='600' cellpadding='0' cellspacing='0' style='background:#191919;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);max-width:600px;'>

        <!-- Header -->
        <tr>
          <td style='background:linear-gradient(135deg,#1a1400 0%,#2a1e00 100%);padding:36px 40px 32px;border-bottom:1px solid rgba(255,213,138,0.15);'>
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td><div style='font-size:24px;font-weight:700;color:#FFD58A;letter-spacing:-0.5px;'>Uniseller</div>
                    <div style='font-size:13px;color:rgba(255,213,138,0.5);margin-top:4px;'>Новая заявка с сайта</div></td>
                <td align='right'><div style='font-size:12px;font-weight:600;color:rgba(255,169,44,0.8);background:rgba(255,169,44,0.1);padding:6px 14px;border-radius:20px;border:1px solid rgba(255,169,44,0.2);'>🔔 Требует обработки</div></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style='padding:36px 40px;'>
            <table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom:8px;'>
              <tr><td colspan='2' style='padding-bottom:16px;'>
                <div style='font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,169,44,0.7);'>Контактные данные</div>
              </td></tr>
              <tr>
                <td style='padding:10px 0;width:140px;vertical-align:top;'><span style='font-size:13px;color:rgba(255,255,255,0.35);'>Имя</span></td>
                <td style='padding:10px 0;'><span style='font-size:15px;color:rgba(255,255,255,0.88);font-weight:500;'>{$nameDisplay}</span></td>
              </tr>
              {$companyRow}
              <tr>
                <td style='padding:10px 0;width:140px;vertical-align:top;'><span style='font-size:13px;color:rgba(255,255,255,0.35);'>Телефон</span></td>
                <td style='padding:10px 0;'><a href='tel:{$phone}' style='font-size:15px;color:#FFD58A;font-weight:600;text-decoration:none;'>{$phone}</a></td>
              </tr>
              <tr>
                <td style='padding:10px 0;width:140px;vertical-align:top;'><span style='font-size:13px;color:rgba(255,255,255,0.35);'>Email</span></td>
                <td style='padding:10px 0;'><a href='mailto:{$email}' style='font-size:15px;color:#FFD58A;text-decoration:none;'>{$email}</a></td>
              </tr>
              {$productRow}
              {$commentBlock}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style='padding:0 40px 36px;'>
            <a href='tel:{$phone}' style='display:inline-block;background:linear-gradient(90deg,#FFD58A,#FFA92C);color:#191919;font-weight:700;font-size:15px;padding:14px 32px;border-radius:48px;text-decoration:none;'>
              Позвонить клиенту
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style='background:rgba(255,255,255,0.02);padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);'>
            <div style='font-size:12px;color:rgba(255,255,255,0.25);line-height:1.5;'>Письмо сгенерировано автоматически · {$date} МСК</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>";
}

// ─── Письмо подтверждения отправителю ─────────────────────────────────────────
function buildConfirmationEmail($name, $phone, $product, $date) {
    $nameDisplay    = $name    ?: 'друг';
    $phoneBlock     = $phone   ? "<div style='font-size:14px;color:rgba(255,255,255,0.55);margin-bottom:8px;'>Телефон: <span style='color:rgba(255,255,255,0.85);font-weight:500;'>{$phone}</span></div>" : '';
    $productBlock   = $product ? "<div style='font-size:14px;color:rgba(255,255,255,0.55);'>Интерес: <span style='color:rgba(255,255,255,0.85);font-weight:500;'>{$product}</span></div>" : '';

    return "<!DOCTYPE html>
<html lang='ru'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Заявка принята — Uniseller</title></head>
<body style='margin:0;padding:0;background:#0f0f0f;font-family:\"Helvetica Neue\",Arial,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#0f0f0f;padding:40px 20px;'>
    <tr><td align='center'>
      <table width='600' cellpadding='0' cellspacing='0' style='background:#191919;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);max-width:600px;'>

        <!-- Header -->
        <tr>
          <td align='center' style='background:linear-gradient(135deg,#1a1400 0%,#2a1e00 100%);padding:48px 40px 44px;border-bottom:1px solid rgba(255,213,138,0.15);'>
            <div style='font-size:26px;font-weight:700;color:#FFD58A;letter-spacing:-0.5px;margin-bottom:24px;'>Uniseller</div>
            <div style='display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,169,44,0.12);border:1.5px solid rgba(255,169,44,0.3);border-radius:50%;margin-bottom:20px;'>
              <span style='font-size:26px;line-height:1;'>✓</span>
            </div>
            <div style='font-size:22px;font-weight:700;color:rgba(255,255,255,0.92);letter-spacing:-0.3px;'>Ваша заявка принята!</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style='padding:36px 40px;'>
            <p style='font-size:16px;color:rgba(255,255,255,0.7);line-height:1.65;margin:0 0 24px;'>
              Привет, <strong style='color:rgba(255,255,255,0.9);'>{$nameDisplay}</strong>!<br>
              Мы получили вашу заявку и свяжемся с вами в ближайшее время.
            </p>

            <div style='background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px 28px;margin-bottom:28px;'>
              <div style='font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,169,44,0.7);margin-bottom:16px;'>Ваши данные</div>
              {$phoneBlock}
              {$productBlock}
            </div>

            <p style='font-size:14px;color:rgba(255,255,255,0.4);line-height:1.6;margin:0;'>
              Среднее время ответа — <strong style='color:rgba(255,213,138,0.75);'>1–2 рабочих дня</strong>.<br>
              Если срочно — звоните: <a href='tel:+79162178516' style='color:#FFD58A;text-decoration:none;font-weight:600;'>+7 916 217-85-16</a>
            </p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td align='center' style='padding:0 40px 40px;'>
            <a href='https://uniseller.io' style='display:inline-block;background:linear-gradient(90deg,#FFD58A,#FFA92C);color:#191919;font-weight:700;font-size:15px;padding:14px 36px;border-radius:48px;text-decoration:none;'>
              Посетить сайт
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align='center' style='background:rgba(255,255,255,0.02);padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);'>
            <div style='font-size:12px;color:rgba(255,255,255,0.2);'>© {$date} · Uniseller · uniseller.io</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>";
}

// ─── Отправляем письма ────────────────────────────────────────────────────────
$subjectManager      = mb_encode_mimeheader("Новая заявка от {$name} | Uniseller", 'UTF-8', 'B') ;
$subjectConfirmation = mb_encode_mimeheader('Ваша заявка принята — Uniseller', 'UTF-8', 'B');

$managerHtml      = buildManagerEmail($name, $company, $phone, $email, $product, $comment, $date);
$confirmationHtml = buildConfirmationEmail($name, $phone, $product, $date);

$headers = makeHeaders($fromName, $fromAddress);

// Тело в base64, чтобы почтовый клиент однозначно рендерил HTML, а не показывал исходник
$sentManager = mail($managerEmail, $subjectManager, chunk_split(base64_encode($managerHtml)), $headers);
$sentConfirm = mail($email,        $subjectConfirmation, chunk_split(base64_encode($confirmationHtml)), $headers);

// ─── Ответ ────────────────────────────────────────────────────────────────────
if ($sentManager) {
    echo json_encode(['success' => true, 'message' => 'OK']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mail error']);
}
