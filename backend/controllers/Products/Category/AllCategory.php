<?php

class AllCategory extends AbstractCategory {
    public function getQuery(): string {
        return "SELECT * FROM products";
    }
}
