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
$backup_dir = __DIR__ . '/private-data';
$csv_file = $backup_dir . '/inscriptions-club.csv';
$notify_email = 'contact@ateliersousleclipse.fr'; // Ton email pour la copie de secours

// Récupération des données JSON ou FormData
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!$data) {
    $data = $_POST;
}

$prenom = isset($data['prenom']) ? trim(strip_tags($data['prenom'])) : '';
$email  = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';

// Validation
if (empty($prenom) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

// -------------------------------------------------------------
// 1. SAUVEGARDE LOCALE SUR OVH (Fichier CSV sécurisé)
// -------------------------------------------------------------
if (!is_dir($backup_dir)) {
    mkdir($backup_dir, 0755, true);
    // Créer un .htaccess pour interdire l'accès web direct au dossier
    file_put_contents($backup_dir . '/.htaccess', "Deny from all\n");
}

$date = date('Y-m-d H:i:s');
$is_new_file = !file_exists($csv_file);

$fp = fopen($csv_file, 'a');
if ($fp) {
    if ($is_new_file) {
        fputcsv($fp, ['Date', 'Prénom', 'Email', 'Statut n8n']);
    }
}

// -------------------------------------------------------------
// 2. TENTATIVE DE TRANSMISSION À N8N
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
        'date' => $date,
        'source' => 'site-ovh-relay'
    ]),
    CURLOPT_CONNECTTIMEOUT => 3, // Ne bloque pas le visiteur si le homelab est down
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
    fputcsv($fp, [$date, $prenom, $email, $n8n_success ? 'SYNCHRONISE' : 'EN_ATTENTE_HOMELAB']);
    fclose($fp);
}

// -------------------------------------------------------------
// 3. SECOURS EMAIL SI N8N ÉTAIT INJOIGNABLE
// -------------------------------------------------------------
if (!$n8n_success && !empty($notify_email)) {
    $subject = "⚠️ Inscription Carnet (Homelab hors ligne) : $prenom";
    $message = "Une nouvelle inscription a été enregistrée sur OVH mais votre n8n n'a pas répondu :\n\n"
             . "Prénom : $prenom\n"
             . "Email  : $email\n"
             . "Date   : $date\n\n"
             . "Pensez à l'ajouter à votre Google Sheet manuellement si besoin.";
    $headers = "From: Atelier sous l'Éclipse <no-reply@ateliersousleclipse.fr>\r\n"
             . "Reply-To: $email\r\n"
             . "Content-Type: text/plain; charset=utf-8";
    @mail($notify_email, $subject, $message, $headers);
}

// Réponse toujours positive au client tant que la sauvegarde OVH a fonctionné
echo json_encode([
    'success' => true,
    'n8n_synced' => $n8n_success
]);