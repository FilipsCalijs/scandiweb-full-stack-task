<?php

use Dotenv\Dotenv;

class Database extends AbstractDatabase {
    private $pdo;
    private $host;
    private $dbname;
    private $username;
    private $password;

    public function __construct() {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        $this->host = $_ENV["DB_HOST"] ?? $_ENV["db_host"];
        $this->dbname = $_ENV["DB_NAME"] ?? $_ENV["db_name"];
        $this->username = $_ENV["DB_USER"] ?? $_ENV["db_username"];
        $this->password = $_ENV["DB_PASS"] ?? $_ENV["db_password"];
        $port = $_ENV["DB_PORT"] ?? 3306;

        try {
            $this->pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};port={$port}",
                $this->username,
                $this->password
            );
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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
