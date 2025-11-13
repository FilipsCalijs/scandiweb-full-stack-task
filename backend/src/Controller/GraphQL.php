<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use Throwable;

abstract class AbstractGraphQLController {
    abstract static public function handle();
}

class GraphQL extends AbstractGraphQLController {
    static public function handle() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Methods: POST");
        header("Content-Type: application/json; charset=UTF-8");

        try {
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'ping' => [
                        'type' => Type::string(),
                        'resolve' => fn() => '✅ Backend and GraphQL connected!',
                    ],
                ],
            ]);

            $schema = new Schema(['query' => $queryType]);

            $input = json_decode(file_get_contents('php://input'), true);
            $query = $input['query'] ?? '';
            $variables = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variables);
            echo json_encode($result->toArray());
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['errors' => [['message' => $e->getMessage()]]]);
        }
    }
}
