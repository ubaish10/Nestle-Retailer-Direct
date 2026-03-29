<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\RetailerInventory;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        $retailerId = auth()->id();

        // Get retailer's personal inventory quantities
        $products = Product::all()->map(function ($product) use ($retailerId) {
            $retailerInventory = RetailerInventory::where('user_id', $retailerId)
                ->where('product_id', $product->id)
                ->first();

            $retailerQuantity = $retailerInventory ? $retailerInventory->stock_quantity : 0;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'image' => $product->image_url ?? '/images/placeholder-product.png',
                'stock_status' => $retailerQuantity > 20 ? 'in_stock' : ($retailerQuantity > 0 ? 'low_stock' : 'out_of_stock'),
                'stock_quantity' => $retailerQuantity,
            ];
        });

        return inertia('stock/index', [
            'products' => $products,
            'categories' => [],
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $retailerId = auth()->id();

        $validated = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        // Update retailer's inventory
        $retailerInventory = RetailerInventory::where('user_id', $retailerId)
            ->where('product_id', $product->id)
            ->first();

        if ($retailerInventory) {
            $retailerInventory->update([
                'stock_quantity' => $validated['stock_quantity'],
            ]);
        } else {
            RetailerInventory::create([
                'user_id' => $retailerId,
                'product_id' => $product->id,
                'stock_quantity' => $validated['stock_quantity'],
            ]);
        }

        return back()->with('success', 'Stock quantity updated successfully.');
    }
}
