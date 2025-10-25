<?php
require_once __DIR__.'/../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->load();

$host = $_ENV["db_host"];
$dbname = $_ENV["db_name"];
$username = $_ENV["db_username"];
$password = $_ENV["db_password"];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $jsonData = file_get_contents(__DIR__."/data.json");
    $data = json_decode($jsonData, true);


    $stmtCat = $pdo->prepare("INSERT INTO categories (name) VALUES (:name) ON DUPLICATE KEY UPDATE name=name");
    foreach ($data['data']['categories'] as $cat) {
        $stmtCat->execute(['name' => $cat['name']]);
    }

    $catIds = [];
    $res = $pdo->query("SELECT id, name FROM categories");
    foreach ($res as $row) {
        $catIds[$row['name']] = $row['id'];
    }


    $stmtProd = $pdo->prepare("
        INSERT INTO products (id, name, brand, description, inStock, category_id)
        VALUES (:id, :name, :brand, :description, :inStock, :category_id)
        ON DUPLICATE KEY UPDATE name=VALUES(name), brand=VALUES(brand), description=VALUES(description), inStock=VALUES(inStock), category_id=VALUES(category_id)
    ");

    $stmtGallery = $pdo->prepare("INSERT INTO product_gallery (product_id, url) VALUES (:product_id, :url)");
    $stmtAttr = $pdo->prepare("INSERT INTO attributes (product_id, name, type) VALUES (:product_id, :name, :type)");
    $stmtAttrItem = $pdo->prepare("INSERT INTO attribute_items (attribute_id, displayValue, value) VALUES (:attribute_id, :displayValue, :value)");
    $stmtPrice = $pdo->prepare("INSERT INTO prices (product_id, amount, currency_label, currency_symbol) VALUES (:product_id, :amount, :label, :symbol)");

    foreach ($data['data']['products'] as $p) {
        $categoryId = $catIds[$p['category']] ?? null;

        $stmtProd->execute([
            'id' => $p['id'],
            'name' => $p['name'],
            'brand' => $p['brand'],
            'description' => $p['description'],
            'inStock' => $p['inStock'] ? 1 : 0,
            'category_id' => $categoryId
        ]);

        foreach ($p['gallery'] as $url) {
            $stmtGallery->execute(['product_id' => $p['id'], 'url' => $url]);
        }

        foreach ($p['attributes'] as $attr) {
            $stmtAttr->execute(['product_id' => $p['id'], 'name' => $attr['name'], 'type' => $attr['type']]);
            $attrId = $pdo->lastInsertId();
            foreach ($attr['items'] as $item) {
                $stmtAttrItem->execute(['attribute_id' => $attrId, 'displayValue' => $item['displayValue'], 'value' => $item['value']]);
            }
        }

        foreach ($p['prices'] as $pr) {
            $stmtPrice->execute([
                'product_id' => $p['id'],
                'amount' => $pr['amount'],
                'label' => $pr['currency']['label'],
                'symbol' => $pr['currency']['symbol']
            ]);
        }
    }

    echo "✅ Data imported successfully!\n";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
