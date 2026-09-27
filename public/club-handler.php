<?php
// Empêcher l'accès direct sans POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Configuration
$n8n_webhook_url = 'https://n8n.yahncloud.fr/webhook/rejoindre-club';
$backup_dir = dirname(__DIR__) . '/carnet-data';
$csv_file = $backup_dir . '/inscriptions-club.csv';
$notify_email = 'contact@ateliersousleclipse.fr';

// Récupération des données JSON ou FormData
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!$data) {
    $data = $_POST;
}

$prenom = isset($data['prenom']) ? trim(strip_tags($data['prenom'])) : '';
$email  = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
// Détection et sécurisation de la langue (fr ou en)
$lang   = (isset($data['lang']) && strtolower(trim($data['lang'])) === 'en') ? 'en' : 'fr';

// Validation
if (empty($prenom) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

// -------------------------------------------------------------
// 1. SAUVEGARDE LOCALE SUR OVH (CSV avec colonne Langue)
// -------------------------------------------------------------
if (!is_dir($backup_dir)) {
    mkdir($backup_dir, 0755, true);
    file_put_contents($backup_dir . '/.htaccess', "Deny from all\n");
}

$date = date('Y-m-d H:i:s');
$is_new_file = !file_exists($csv_file);

$fp = fopen($csv_file, 'a');
if ($fp) {
    if ($is_new_file) {
        fputcsv($fp, ['Date', 'Prénom', 'Email', 'Langue', 'Statut n8n']);
    }
}

// -------------------------------------------------------------
// 2. TRANSMISSION À N8N AVEC LA LANGUE
// -------------------------------------------------------------
$n8n_success = false;

$ch = curl_init($n8n_webhook_url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'prenom' => $prenom,
        'email' => $email,
        'lang' => $lang,
        'date' => $date,
        'source' => 'site-ovh-relay'
    ]),
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 4,
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code >= 200 && $http_code < 300) {
    $n8n_success = true;
}

// Écriture dans le CSV
if ($fp) {
    fputcsv($fp, [$date, $prenom, $email, strtoupper($lang), $n8n_success ? 'SYNCHRONISE' : 'EN_ATTENTE_HOMELAB']);
    fclose($fp);
}

// -------------------------------------------------------------
// 3. SECOURS EMAIL SI N8N ÉTAIT INJOIGNABLE
// -------------------------------------------------------------
if (!$n8n_success && !empty($notify_email)) {
    $raw_subject = "⚠️ Inscription Carnet [" . strtoupper($lang) . "] (Homelab hors ligne) : $prenom";
    $subject = mb_encode_mimeheader($raw_subject, 'UTF-8', 'B', "\r\n");

    $message = "Une nouvelle inscription a été enregistrée sur OVH mais votre n8n n'a pas répondu :\n\n"
             . "Prénom : $prenom\n"
             . "Email  : $email\n"
             . "Langue : " . strtoupper($lang) . "\n"
             . "Date   : $date\n\n"
             . "Pensez à l'ajouter à votre Google Sheet manuellement si besoin.";
    $headers = "From: Atelier sous l'Éclipse <no-reply@ateliersousleclipse.fr>\r\n"
             . "Reply-To: $email\r\n"
             . "Content-Type: text/plain; charset=utf-8";
    @mail($notify_email, $subject, $message, $headers);
}

// Réponse au navigateur
echo json_encode([
    'success' => true,
    'n8n_synced' => $n8n_success,
    'lang' => $lang
]);