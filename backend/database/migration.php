<?php

require_once __DIR__.'/../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->load();

$host = $_ENV["db_host"];
$dbname = $_ENV["db_name"];
$username = $_ENV["db_username"];
$password = $_ENV["db_password"];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connect to database: {$dbname}\n";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            brand VARCHAR(255),
            description TEXT,
            inStock BOOLEAN DEFAULT 1,
            category_id INT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");


    $pdo->exec("
        CREATE TABLE IF NOT EXISTS product_gallery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id VARCHAR(255),
            url TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS attributes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");


    $pdo->exec("
        CREATE TABLE IF NOT EXISTS attribute_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            attribute_id INT,
            displayValue VARCHAR(255),
            value VARCHAR(255),
            FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id VARCHAR(255),
            amount DECIMAL(10,2),
            currency_label VARCHAR(10),
            currency_symbol VARCHAR(5),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    echo "Migration completed successfully XD.\n\n";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo " Tables in '{$dbname}':\n" . implode("\n", $tables) . "\n";

} catch (PDOException $e) {
    echo " Error: " . $e->getMessage() . "\n";
    exit(1);
}
