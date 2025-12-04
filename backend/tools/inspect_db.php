<?php
require __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
$host = $_ENV['db_host'];
$dbname = $_ENV['db_name'];
$user = $_ENV['db_username'];
$pass = $_ENV['db_password'];
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $tables = ['products','product_gallery','attributes','attribute_items','prices'];
    foreach ($tables as $t) {
        try {
            $stmt = $pdo->query("SHOW CREATE TABLE `{$t}`");
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "--- {$t} ---\n" . ($row['Create Table'] ?? $row['Create View'] ?? json_encode($row)) . "\n\n";
        } catch (Exception $e) {
            echo "Cannot show {$t}: " . $e->getMessage() . "\n\n";
        }
    }
} catch (Exception $e) {
    echo "DB connection error: " . $e->getMessage() . "\n";
}
