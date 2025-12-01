<?php

class Orders implements OrdersInterface {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db->getConnection();
    }

    public function placeOrder($orders) {
        $this->db->beginTransaction();
        try {
            foreach ($orders as &$order) {
                $statement = $this->db->prepare("
                    INSERT INTO orders (product_id, quantity, size, color, capacity)
                    VALUES (:product_id, :quantity, :size, :color, :capacity)
                ");

                $statement->bindParam(':product_id', $order['id'], PDO::PARAM_STR);
                $statement->bindParam(':quantity', $order['quantity'], PDO::PARAM_INT);
                $statement->bindParam(':size', $order['size'], PDO::PARAM_STR);
                $statement->bindParam(':color', $order['color'], PDO::PARAM_STR);
                $statement->bindParam(':capacity', $order['capacity'], PDO::PARAM_STR);

                $statement->execute();
            }

            $this->db->commit();
            return true;

        } catch (Exception $e) {
            $this->db->rollBack();
            throw new Exception($e->getMessage());
        }
    }
}
