<?php
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/../Controllers/Database/AbstractDatabase.php';
require_once __DIR__ . '/../Controllers/Database/Database.php';


require_once __DIR__ . '/../Controllers/Orders/OrdersInterface.php';
require_once __DIR__ . '/../Controllers/Orders/Orders.php';

require_once __DIR__ . '/../Controllers/Products/Category/AbstractCategory.php';
require_once __DIR__ . '/../Controllers/Products/Category/AllCategory.php';
require_once __DIR__ . '/../Controllers/Products/Category/ClothesCategory.php';
require_once __DIR__ . '/../Controllers/Products/Category/TechCategory.php';
require_once __DIR__ . '/../Controllers/Products/Category/CategoryFactory.php';

require_once __DIR__ . '/../Controllers/Products/Product/ProductBase.php';
require_once __DIR__ . '/../Controllers/Products/Product/Product.php';

require_once __DIR__ . '/../Controllers/Products/CategoryModel/CategoryBase.php';
require_once __DIR__ . '/../Controllers/Products/CategoryModel/Category.php';

require_once __DIR__ . '/../Controllers/Products/Products.php';

require_once __DIR__ . '/../Controllers/Graphql.php';

use GraphQL\GraphQL;

$database = new Database();
$products = new Products($database);
$orders = new Orders($database);
$graphqlSchema = new GraphQLSchema($products, $orders);
$schema = $graphqlSchema->getSchema();

$input = json_decode(file_get_contents('php://input'), true);
$query = $input['query'] ?? '';
$variables = $input['variables'] ?? null;

try {
    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    echo json_encode($result->toArray());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'errors' => [
            ['message' => $e->getMessage()]
        ]
    ]);
}
