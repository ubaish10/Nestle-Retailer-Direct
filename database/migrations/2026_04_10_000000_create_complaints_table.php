<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Retailer
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->string('product_name');
            $table->string('product_image')->nullable();
            $table->integer('quantity');
            $table->text('description');
            $table->string('image_path')->nullable(); // Proof image
            $table->string('complaint_id')->unique(); // Unique complaint ID
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('distributor_response')->nullable(); // Reason for rejection
            $table->foreignId('distributor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
