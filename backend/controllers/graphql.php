<?php

use GraphQL\Type\Schema;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;

class GraphQLSchema {
    private $product;
    private $orders;

    public function __construct(Products $products , Orders $orders) {
        $this->product = $products;
        $this->orders = $orders;
    }

    public function getSchema() {
        // ProductType definition
        $productType = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
                'inStock' => Type::boolean(),
                'gallery' => Type::listOf(Type::string()),
                'description' => Type::string(),
                'category' => Type::string(),
                'attributes' => Type::listOf(new ObjectType([
                    'name' => 'AttributeSet',
                    'fields' => [
                        'id' => Type::string(),
                        'items' => Type::listOf(new ObjectType([
                            'name' => 'Attribute',
                            'fields' => [
                                'displayValue' => Type::string(),
                                'value' => Type::string(),
                                'id' => Type::string(),
                            ]
                        ])),
                        'name' => Type::string(),
                        'type' => Type::string(),
                    ]
                ])),
                'prices' => Type::listOf(new ObjectType([
                    'name' => 'Price',
                    'fields' => [
                        'amount' => Type::float(),
                        'currency' => new ObjectType([
                            'name' => 'Currency',
                            'fields' => [
                                'label' => Type::string(),
                                'symbol' => Type::string(),
                            ]
                        ]),
                    ]
                ])),
                'brand' => Type::string(),
            ]
        ]);

        // CategoryType definition
        $categoryType = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'name' => Type::string(),
                '__typename' => Type::string(),
            ]
        ]);

        // Query definition
        $queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'products' => [
                    'type' => Type::listOf($productType),
                    'resolve' => function () {

                        $products = $this->product->getProducts(new AllCategory());
                
                        return array_map(function ($product) {
                            return [
                                'id' => $product->getId(),
                                'name' => $product->getName(),
                                'inStock' => $product->isInStock(),
                                'gallery' => $product->getGallery(),
                                'description' => $product->getDescription(),
                                'category' => $product->getCategory(),
                                'attributes' => $product->getAttributes(),
                                'prices' => $product->getPrices(),
                                'brand' => $product->getBrand(),
                            ];
                        }, $products);
                    }
                ],
                'productsByCategory' => [
                    'type' => Type::listOf($productType),
                    'args' => [
                        'category' => Type::string(),
                    ],
                    'resolve' => function ($root, $args) {
                        $category = $args['category']; 

                        $categoryClass = CategoryFactory::create($category);
                        $products = $this->product->getProducts($categoryClass);

                        return array_map(function ($product) {
                            return [
                                'id' => $product->getId(),
                                'name' => $product->getName(),
                                'inStock' => $product->isInStock(),
                                'gallery' => $product->getGallery(),
                                'description' => $product->getDescription(),
                                'category' => $product->getCategory(),
                                'attributes' => $product->getAttributes(),
                                'prices' => $product->getPrices(),
                                'brand' => $product->getBrand(),
                            ];
                        }, $products);
                        
    
                    }
                ],
                'categories' => [
                    'type' => Type::listOf($categoryType),
                    'resolve' => function () {
                        $categories = $this->product->getCategories();
                        return array_map(function ($category) {
                            return [
                                'id' => $category->getId(),
                                'name' => $category->getName(),
                            ];
                        }, $categories);
                    }
                ],
                'product' => [
                    'type' => $productType,
                    'args' => [
                        'id' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function ($root, $args) {
                        $product = $this->product->getProductById($args['id']); 
                        return [
                            'id' => $product->getId(),
                            'name' => $product->getName(),
                            'inStock' => $product->isInStock(),
                            'gallery' => $product->getGallery(),
                            'description' => $product->getDescription(),
                            'category' => $product->getCategory(),
                            'attributes' => $product->getAttributes(),
                            'prices' => $product->getPrices(),
                            'brand' => $product->getBrand(),
                        ];
                    }
                ],
            ]
        ]);

        // Mutation definition
        $mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'placeOrder' => [
                    'type' => Type::boolean(), 
                    'args' => [
                        'orders' => Type::listOf(new InputObjectType([
                            'name' => 'OrderInput',
                            'fields' => [
                                'id' => Type::nonNull(Type::string()),    
                                'quantity' => Type::nonNull(Type::int()), 
                                'size' => Type::string(),                  
                                'color' => Type::string(),
                                'capacity' => Type::string(),                 
                            ],
                        ])),
                    ],
                    'resolve' => function ($root, $args) {
                        return $this->orders->placeOrder($args['orders']);
                    }
                ],
            ]
        ]);

        return new Schema([
            'query' => $queryType,
            'mutation' => $mutationType
        ]);
    }
}

