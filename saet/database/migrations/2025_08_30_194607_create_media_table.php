<?php

use App\Models\User;
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
        Schema::create('media', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(User::class, 'uploader_id')->nullable()->index()->constrained('users')->nullOnDelete();
            $table->nullableMorphs('model');
            $table->string('tag')->nullable();

            $table->string("disk");
            $table->string("relative_path")->nullable();
            $table->string("name");
            $table->string('extension');
            
            $table->unsignedBigInteger('size_in_bytes')->nullable();
            $table->string('mime')->nullable();
            $table->boolean('is_public')->default(false);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
