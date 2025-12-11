<?php

require_once __DIR__ . '/AbstractDatabase.php';

use Dotenv\Dotenv;

class Database extends AbstractDatabase {
    private $pdo;
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $charset = 'utf8mb4';

    public function __construct() {
        
        $envPath = __DIR__ . '/../../';
        if (file_exists($envPath . '.env')) {
            require_once $envPath . 'vendor/autoload.php'; 
            $dotenv = Dotenv::createImmutable($envPath);
            $dotenv->load();
        }


        $this->host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'sql100.infinityfree.com');
        $this->dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'if0_40454816_react_ecommerce');
        $this->username = getenv('DB_USERNAME') ?: ($_ENV['DB_USERNAME'] ?? 'if0_40454816');
        $this->password = getenv('DB_PASSWORD') ?: ($_ENV['DB_PASSWORD'] ?? 'jZIUca1TPR6obVr');

        
        error_log("Database connection attempt: host={$this->host}, dbname={$this->dbname}, user={$this->username}");

       
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo json_encode([
                'errors' => [
                    ['message' => $e->getMessage()]
                ]
            ]);
            http_response_code(500);
            die;
        }
    }

    public function getConnection() {
        return $this->pdo;
    }
}
