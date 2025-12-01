<?php

class TechCategory extends AbstractCategory {
    public function getQuery(): string {
        return "SELECT * FROM products WHERE category = 'Tech'";
    }
}
