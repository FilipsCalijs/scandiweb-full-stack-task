<?php

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->load();

class Database {
    private $pdo;
    private $host;
    private $dbname;
    private $username;
    private $password;

    public function __construct() {
        $this->host = $_ENV["db_host"];
        $this->dbname = $_ENV["db_name"];
        $this->username = $_ENV["db_username"]; 
        $this->password = $_ENV["db_password"];
        
        try {
            $this->pdo = new PDO(
            "mysql:host=$this->host;dbname=$this->dbname",
            $this->username,
            $this->password);
    
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
