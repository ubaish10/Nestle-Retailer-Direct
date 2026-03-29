<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Beverages', 'description' => 'Drinks and beverage products'],
            ['name' => 'Breakfast', 'description' => 'Breakfast cereals and products'],
            ['name' => 'Confectionery', 'description' => 'Chocolates and sweets'],
            ['name' => 'Baby Food', 'description' => 'Baby nutrition products'],
            ['name' => 'Dairy', 'description' => 'Dairy and creamer products'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $products = [
            [
                'name' => 'Nestlé Milo Powder 3kg',
                'description' => 'Malted chocolate drink mix rich in iron and calcium',
                'price' => 140.00,
                'image_url' => '/milo.jpeg',
                'category_id' => 1,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Nestlé Pure Life Water 500ml',
                'description' => 'Pure drinking water in convenient 500ml bottles',
                'price' => 100.00,
                'image_url' => '/Nestlé Pure Life Water 500ml.jpg',
                'category_id' => 1,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Nestlé Coffee Mate 1.5kg',
                'description' => 'Original creamer powder for coffee lovers',
                'price' => 160.00,
                'image_url' => '/Nestlé Coffee Mate.jpg',
                'category_id' => 5,
                'stock_quantity' => 8,
            ],
            [
                'name' => 'Nestlé Cerelac Wheat 400g',
                'description' => 'Iron-fortified infant cereal with wheat',
                'price' => 350.00,
                'image_url' => '/Nestlé Cerelac Wheat.jpg',
                'category_id' => 4,
                'stock_quantity' => 45,
            ],
            [
                'name' => 'Nestlé KitKat Bar 45g',
                'description' => 'Crispy wafer fingers covered in milk chocolate',
                'price' => 300.00,
                'image_url' => '/Nestlé KitKat Bar.jpg',
                'category_id' => 3,
                'stock_quantity' => 100,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
