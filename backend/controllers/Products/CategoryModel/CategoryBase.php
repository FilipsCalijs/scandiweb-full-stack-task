<?php

class CategoryBase {
    protected string $id;
    protected string $name;

    public function __construct(array $data) {
        $this->id = $data['id'];
        $this->name = $data['name'];
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
}
