<?php

class CategoryFactory {
    public static function create(string $category): AbstractCategory {
        return match (strtolower($category)) {
            "tech" => new TechCategory(),
            "clothes" => new ClothesCategory(),
            default => new AllCategory(),
        };
    }
}
