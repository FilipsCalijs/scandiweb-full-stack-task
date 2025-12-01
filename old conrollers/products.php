<?php

abstract class AbstractCategory {
    abstract public function getQuery(): string;
}

class AllCategory extends AbstractCategory {
    public function getQuery(): string {
        return "SELECT * FROM products";
    }
}

class ClothesCategory extends AbstractCategory {
    public function getQuery(): string {
        return "SELECT * FROM products WHERE category = 'Clothes'";
    }
}

class TechCategory extends AbstractCategory {
    public function getQuery(): string {
        return "SELECT * FROM products WHERE category = 'Tech'";
    }
}

class CategoryFactory {
    public static function create(string $category): AbstractCategory {
        return match (strtolower($category)) {
            "tech" => new TechCategory(),
            "clothes" => new ClothesCategory(),
            default => new AllCategory(),
        };
    }
}

abstract class AbstractProduct {
    protected string $id;
    protected string $name;
    protected bool $inStock;
    protected array $gallery;
    protected string $description;
    protected string $category;
    protected array $attributes;
    protected array $prices;
    protected string $brand;

    public function __construct(array $data) {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->inStock = (bool) $data['inStock'];
        $this->gallery = json_decode($data['gallery'], true);
        $this->description = $data['description'];
        $this->category = $data['category'];
        $this->attributes = json_decode($data['attributes'], true);
        $this->prices = json_decode($data['prices'], true);
        $this->brand = $data['brand'];
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
    public function isInStock(): bool { return $this->inStock; }
    public function getGallery(): array { return $this->gallery; }
    public function getDescription(): string { return $this->description; }
    public function getCategory(): string { return $this->category; }
    public function getAttributes(): array { return $this->attributes; }
    public function getPrices(): array { return $this->prices; }
    public function getBrand(): string { return $this->brand; }
}

class Product extends AbstractProduct {
}

abstract class AbstractCategoryModel {
    protected string $id;
    protected string $name;

    public function __construct(array $data) {
        $this->id = $data['id'];
        $this->name = $data['name'];
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
}

class Category extends AbstractCategoryModel {
}

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
        if ($row) return new Product($row);
        return null;
    }
}