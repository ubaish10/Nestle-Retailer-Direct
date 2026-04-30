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
        // Use raw statements to check and drop indexes safely (MySQL)
        if (Schema::hasTable('survey_responses')) {
            // Check for known index names and drop them if present
            $existing = \Illuminate\Support\Facades\DB::select("SHOW INDEX FROM `survey_responses` WHERE Key_name IN ('survey_responses_survey_id_retailer_id_unique','survey_responses_survey_id_retailer_id_index')");
            foreach ($existing as $idx) {
                $key = $idx->Key_name ?? $idx['Key_name'] ?? null;
                if ($key) {
                    try {
                        \Illuminate\Support\Facades\DB::statement("ALTER TABLE `survey_responses` DROP INDEX `" . $key . "`");
                    } catch (\Exception $e) {
                        // ignore
                    }
                }
            }

            // Create a safe non-unique index if it doesn't exist
            $check = \Illuminate\Support\Facades\DB::select("SHOW INDEX FROM `survey_responses` WHERE Key_name = 'idx_survey_retailer'");
            if (empty($check)) {
                try {
                    \Illuminate\Support\Facades\DB::statement("ALTER TABLE `survey_responses` ADD INDEX `idx_survey_retailer` (`survey_id`,`retailer_id`)");
                } catch (\Exception $e) {
                    // ignore
                }
            }
        }
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
