<?php

class Attribute {
    public int $id;
    public string $name;
    public string $type;
    public array $items = [];

    public function __construct(array $data) {
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->type = $data['type'];
    }

    public function loadItems(PDO $db): void {
        $stmt = $db->prepare("SELECT * FROM attribute_items WHERE attribute_id = :aid");
        $stmt->bindParam(':aid', $this->id, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $this->items = array_map(fn($row) => new AttributeItem($row), $rows);
    }
}
