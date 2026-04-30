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
        Schema::table('survey_responses', function (Blueprint $table) {
            // Attempt to drop unique constraint if it exists, ignore errors
            try {
                $table->dropUnique(['survey_id', 'retailer_id']);
            } catch (\Exception $e) {}

            // Attempt to drop any existing index on these columns to avoid duplicate name errors
            try {
                $table->dropIndex(['survey_id', 'retailer_id']);
            } catch (\Exception $e) {}

            // Add a non-unique index with a safe name
            try {
                $table->index(['survey_id', 'retailer_id'], 'idx_survey_retailer');
            } catch (\Exception $e) {}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('survey_responses', function (Blueprint $table) {
            // Drop the non-unique index and restore the unique constraint
            $table->dropIndex(['survey_id', 'retailer_id']);
            $table->unique(['survey_id', 'retailer_id']);
        });
    }
};
