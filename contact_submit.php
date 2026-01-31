<?php
// contact_submit.php

// jednoduchá ochrana – jen POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$idea   = trim($_POST['idea'] ?? '');
$name   = trim($_POST['name'] ?? '');
$email  = trim($_POST['email'] ?? '');
$phone  = trim($_POST['phone'] ?? '');
$budget = trim($_POST['budget'] ?? '');

// základní validace
if ($idea === '' || $name === '' || $email === '') {
    header('Location: index.html?error=missing');
    exit;
}

// cesta k JSON "databázi"
$dataFile = __DIR__ . '/data/enquiries.json';

// načteme existující data
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

$json = file_get_contents($dataFile);
$list = json_decode($json, true);
if (!is_array($list)) {
    $list = [];
}

// nový záznam
$list[] = [
    'datetime' => date('Y-m-d H:i:s'),
    'idea'     => $idea,
    'name'     => $name,
    'email'    => $email,
    'phone'    => $phone,
    'budget'   => $budget,
    'ip'       => $_SERVER['REMOTE_ADDR'] ?? '',
];

// uložíme zpět
file_put_contents($dataFile, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// jednoduchá "děkujeme" stránka
?>
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <title>Děkujeme – Vizualio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background:#0C0C0C; color:#F8F8F5; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
    .box { max-width:480px; text-align:center; padding:24px; border:1px solid #333; border-radius:16px; }
    a { color:#C6A67C; text-decoration:none; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Děkujeme za poptávku</h1>
    <p>Váš nápad jsme uložili a co nejdříve se vám ozveme s návrhem řešení.</p>
    <p><a href="index.html">Zpět na web Vizualio</a></p>
  </div>
</body>
</html>
