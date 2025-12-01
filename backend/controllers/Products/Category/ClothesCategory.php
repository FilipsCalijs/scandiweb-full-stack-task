<?php

class ClothesCategory extends AbstractCategory {
    public function getQuery(): string {
        return "SELECT * FROM products WHERE category = 'Clothes'";
    }
}
