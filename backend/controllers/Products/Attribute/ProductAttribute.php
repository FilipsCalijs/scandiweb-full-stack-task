<?php
class ProductAttribute {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db->getConnection();
    }

    public function getAttributesForProduct($productId) {
        $stmt = $this->db->prepare("SELECT * FROM attributes WHERE product_id = :product_id");
        $stmt->bindParam(':product_id', $productId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAttributeItems($attributeId) {
        $stmt = $this->db->prepare("SELECT * FROM attribute_items WHERE attribute_id = :attribute_id");
        $stmt->bindParam(':attribute_id', $attributeId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
