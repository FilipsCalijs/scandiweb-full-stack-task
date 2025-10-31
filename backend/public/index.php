<?php
// ✅ Полная поддержка CORS и preflight
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// ✅ Если это preflight (OPTIONS) — просто ответить 200 OK и выйти
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Контент типа JSON
header("Content-Type: application/json");

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__."/../controllers/orders.php";
require_once __DIR__."/../controllers/database.php";
require_once __DIR__."/../controllers/products.php";
require_once __DIR__."/../controllers/graphql.php";

use GraphQL\GraphQL;


$database = new Database();
$products = new Products($database);
$orders = new Orders($database);
$graphqlSchema = new GraphQLSchema($products , $orders);

$schema = $graphqlSchema->getSchema();


$input = json_decode(file_get_contents('php://input'), true);
$query = $input['query'] ?? '';
$variables = $input['variables'] ?? null;

try {
    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    $output = $result->toArray();
    echo json_encode($output);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'errors' => [
            ['message' => $e->getMessage()]
        ]
    ]);
}
