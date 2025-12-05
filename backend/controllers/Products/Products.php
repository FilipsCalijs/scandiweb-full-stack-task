<?php

class Products {
    private PDO $db;
    private ProductAttribute $attributeModel;

    public function __construct(Database $db) {
        $this->db = $db->getConnection();
        $this->attributeModel = new ProductAttribute($db);
    }

    public function getProducts(AbstractCategory $category): array {
        $query = $category->getQuery();
        $statement = $this->db->prepare($query);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($rows as &$row) {
            $row['attributes'] = $this->loadAttributes($row['id']);
            $row['gallery'] = $this->loadGallery($row['id']);
            $row['prices'] = $this->loadPrices($row['id']);
        }
        
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
        
        if (!$row) {
            return null;
        }
        
        $row['attributes'] = $this->loadAttributes($row['id']);
        $row['gallery'] = $this->loadGallery($row['id']);
        $row['prices'] = $this->loadPrices($row['id']);
        
        return new Product($row);
    }

    private function loadAttributes(string $productId): array {
        $attributes = $this->attributeModel->getAttributesForProduct($productId);
        
        foreach ($attributes as &$attr) {
            $attr['items'] = $this->attributeModel->getAttributeItems($attr['id']);
        }
        
        return $attributes;
    }

    private function loadGallery(string $productId): array {
        $stmt = $this->db->prepare("SELECT url FROM product_gallery WHERE product_id = :product_id");
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        
        return array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'url');
    }

    private function loadPrices(string $productId): array {
        $stmt = $this->db->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = :product_id");
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(function($price) {
            return [
                'amount' => (float)$price['amount'],
                'currency' => [
                    'label' => $price['currency_label'],
                    'symbol' => $price['currency_symbol']
                ]
            ];
        }, $prices);
    }
}