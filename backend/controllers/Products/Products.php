<?php

class Products {
    private PDO $db;

    public function __construct(Database $db) {
        $this->db = $db->getConnection();
    }

    public function getProducts(AbstractCategory $category): array {
        $query = $category->getQuery();
        $statement = $this->db->prepare($query);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $this->mapProducts($rows);
    }

    private function mapProducts(array $rows): array {
        return array_map(fn($row) => new Product($row), $rows);
    }

    private function mapCategories(array $rows): array {
        return array_map(fn($row) => new Category($row), $rows);
    }

    public function getCategories(): array {
        $statement = $this->db->prepare("SELECT * FROM categories");
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $this->mapCategories($rows);
    }

    public function getProductById(string $id): ?Product {
        $statement = $this->db->prepare("SELECT * FROM products WHERE id = :id");
        $statement->bindParam(':id', $id, PDO::PARAM_STR);
        $statement->execute();
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        return $row ? new Product($row) : null;
    }
}
