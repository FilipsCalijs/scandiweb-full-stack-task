<?php

class Products {
    private PDO $db;
    private ProductAttribute $attributeModel;

    public function __construct(Database $db) {
        $this->db = $db->getConnection();
        $this->attributeModel = new ProductAttribute($db);
    }

    public function getProducts(CategoryInterface $category): array {
        $query = $category->getQuery();
        $statement = $this->db->prepare($query);
        $statement->execute();
        $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $this->mapProducts($rows);
    }

    private function mapProducts(array $rows): array {
        return array_map(function($row) {
            $row['attributes'] = $this->loadAttributes($row['id']);
            $row['gallery'] = $this->loadGallery($row['id']);
            $row['prices'] = $this->loadPrices($row['id']);
            return new Product($row);
        }, $rows);
    }

    private function loadAttributes(string $productId): string {
        $attributes = $this->attributeModel->getAttributesForProduct($productId);
        
        $result = [];
        foreach ($attributes as $attr) {
            $items = $this->attributeModel->getAttributeItems((int)$attr['id']);
            $result[] = [
                'id' => $attr['name'],
                'name' => $attr['name'],
                'type' => $attr['type'],
                'items' => $items
            ];
        }
        
        return json_encode($result);
    }

    private function loadGallery(string $productId): string {
        $stmt = $this->db->prepare("SELECT url FROM product_gallery WHERE product_id = :product_id ORDER BY id");
        $stmt->execute([':product_id' => $productId]);
        $images = $stmt->fetchAll(PDO::FETCH_COLUMN);
        return json_encode($images ?: []);
    }

    private function loadPrices(string $productId): string {
        $stmt = $this->db->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = :product_id");
        $stmt->execute([':product_id' => $productId]);
        $prices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = array_map(fn($p) => [
            'amount' => (float)$p['amount'],
            'currency' => [
                'label' => $p['currency_label'],
                'symbol' => $p['currency_symbol']
            ]
        ], $prices);
        
        return json_encode($result);
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
        
        if (!$row) return null;
        
        $row['attributes'] = $this->loadAttributes($row['id']);
        $row['gallery'] = $this->loadGallery($row['id']);
        $row['prices'] = $this->loadPrices($row['id']);
        
        return new Product($row);
    }
}