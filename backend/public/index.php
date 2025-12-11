<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$logFile = __DIR__ . '/../logs/graphql.log';
$logDir = dirname($logFile);
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

function logMessage($type, $data) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] [$type]\n" . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n" . str_repeat('=', 80) . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}


logMessage('INCOMING REQUEST', [
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI'],
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'N/A',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'N/A',
    'query_string' => $_SERVER['QUERY_STRING'] ?? 'N/A',
]);
// ==================================


$allowedOrigins = [
    'http://localhost:5173',
    'https://tesk-task.xo.je'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    logMessage('CORS', ['allowed_origin' => $origin]);
} else {
    logMessage('CORS', ['rejected_origin' => $origin, 'allowed' => $allowedOrigins]);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    logMessage('OPTIONS', ['preflight_request' => true]);
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/../controllers/Database/AbstractDatabase.php';
require_once __DIR__ . '/../controllers/Database/Database.php';


require_once __DIR__ . '/../controllers/Orders/OrdersInterface.php';
require_once __DIR__ . '/../controllers/Orders/Orders.php';

require_once __DIR__ . '/../controllers/Products/Category/AbstractCategory.php';
require_once __DIR__ . '/../controllers/Products/Category/AllCategory.php';
require_once __DIR__ . '/../controllers/Products/Category/ClothesCategory.php';
require_once __DIR__ . '/../controllers/Products/Category/TechCategory.php';
require_once __DIR__ . '/../controllers/Products/Category/CategoryFactory.php';

require_once __DIR__ . '/../controllers/Products/Attribute/ProductAttribute.php';

require_once __DIR__ . '/../controllers/Products/Product/ProductBase.php';
require_once __DIR__ . '/../controllers/Products/Product/Product.php';

require_once __DIR__ . '/../controllers/Products/CategoryModel/CategoryBase.php';
require_once __DIR__ . '/../controllers/Products/CategoryModel/Category.php';

require_once __DIR__ . '/../controllers/Products/Products.php';

require_once __DIR__ . '/../controllers/graphql.php';

use GraphQL\GraphQL;

$database = new Database();
$products = new Products($database);
$orders = new Orders($database);
$graphqlSchema = new GraphQLSchema($products, $orders);
$schema = $graphqlSchema->getSchema();

$input = json_decode(file_get_contents('php://input'), true);
$query = $input['query'] ?? '';
$variables = $input['variables'] ?? null;


logMessage('GRAPHQL REQUEST', [
    'query' => $query,
    'variables' => $variables,
    'raw_input' => file_get_contents('php://input')
]);

try {
    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    $output = $result->toArray();
    

    logMessage('GRAPHQL RESPONSE SUCCESS', [
        'has_data' => isset($output['data']),
        'data_keys' => isset($output['data']) ? array_keys($output['data']) : [],
        'has_errors' => isset($output['errors']),
        'response_size' => strlen(json_encode($output))
    ]);
    
    echo json_encode($output);
} catch (Exception $e) {

    logMessage('GRAPHQL ERROR', [
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
    
    http_response_code(500);
    echo json_encode([
        'errors' => [
            ['message' => $e->getMessage()]
        ]
    ]);
}
