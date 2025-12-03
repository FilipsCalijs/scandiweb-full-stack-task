<?php

class AttributeItem {
    public int $id;
    public string $displayValue;
    public string $value;

    public function __construct(array $data) {
        $this->id = $data['id'];
        $this->displayValue = $data['displayValue'];
        $this->value = $data['value'];
    }
}