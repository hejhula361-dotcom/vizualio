<?php
session_start();

if (empty($_SESSION['vizualio_admin'])) {
    header('Location: login.php');
    exit;
}

$dataFile = __DIR__ . '/../data/enquiries.json';
$list = [];

if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    $list = json_decode($json, true);
    if (!is_array($list)) {
        $list = [];
    }
}
?>
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <title>Vizualio – Poptávky</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background:#0C0C0C; color:#F8F8F5; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin:0; }
    header { padding:16px 24px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center; }
    table { width:100%; border-collapse:collapse; }
    th, td { padding:8px 10px; border-bottom:1px solid #333; vertical-align:top; font-size:13px; }
    th { text-align:left; background:#111; }
    a { color:#C6A67C; text-decoration:none; }
    .tag { display:inline-block; padding:2px 6px; border-radius:999px; border:1px solid #555; font-size:11px; }
  </style>
</head>
<body>
  <header>
    <div>Vizualio – Poptávky</div>
    <nav>
      <a href="logout.php">Odhlásit se</a>
    </nav>
  </header>

  <main style="padding:16px 16px 40px;">
    <?php if (empty($list)): ?>
      <p>Zatím nemáte žádné poptávky.</p>
    <?php else: ?>
      <div style="overflow-x:auto;">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Jméno</th>
              <th>E-mail</th>
              <th>Telefon</th>
              <th>Rozpočet</th>
              <th>Co má klient v hlavě</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach (array_reverse($list) as $item): ?>
              <tr>
                <td><?= htmlspecialchars($item['datetime'] ?? '') ?></td>
                <td><?= htmlspecialchars($item['name'] ?? '') ?></td>
                <td><a href="mailto:<?= htmlspecialchars($item['email'] ?? '') ?>">
                  <?= htmlspecialchars($item['email'] ?? '') ?></a></td>
                <td><?= htmlspecialchars($item['phone'] ?? '') ?></td>
                <td><?= htmlspecialchars($item['budget'] ?? '') ?></td>
                <td><?= nl2br(htmlspecialchars($item['idea'] ?? '')) ?></td>
                <td><span class="tag"><?= htmlspecialchars($item['ip'] ?? '') ?></span></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </main>
</body>
</html>
