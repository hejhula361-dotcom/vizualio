<?php
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    // jednoduché přihlášení – změň si podle sebe
    $validUser = 'vizualio';
    $validPass = 'vizualio2024!';

    if ($user === $validUser && $pass === $validPass) {
        $_SESSION['vizualio_admin'] = true;
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Špatné jméno nebo heslo.';
    }
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <title>Admin – přihlášení</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background:#0C0C0C; color:#F8F8F5; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
    .box { max-width:360px; width:100%; padding:24px; border-radius:16px; border:1px solid #333; }
    input { width:100%; padding:8px 10px; margin-bottom:10px; border-radius:8px; border:1px solid #444; background:#111; color:#F8F8F5; }
    button { width:100%; padding:10px; border-radius:999px; border:none; background:#C6A67C; color:#0C0C0C; font-weight:600; cursor:pointer; }
    button:hover { background:#d4b682; }
    .error { color:#ff7a7a; margin-bottom:10px; font-size:14px; }
  </style>
</head>
<body>
  <div class="box">
    <h1 style="font-size:20px; margin-bottom:16px;">Vizualio – Admin</h1>
    <?php if ($error): ?>
      <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
    <form method="POST">
      <input type="text" name="username" placeholder="Uživatelské jméno" required>
      <input type="password" name="password" placeholder="Heslo" required>
      <button type="submit">Přihlásit se</button>
    </form>
  </div>
</body>
</html>
