<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'uploader_id',
        'model_id',
        'model_type',
        'tag',

        'disk',
        'relative_path',
        'name',
        'extension',

        'size_in_bytes',
        'mime',
        'is_public',
    ];

    protected $appends = [
        'url',
        'human_size'
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean'
        ];
    }

    #region Relationships
    public function model()
    {
        return $this->morphTo();
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    #region Getters and Setters
    public function getUrlAttribute()
    {
        return route('api.media.display', $this->id);
    }

    public function getHumanSizeAttribute()
    {
        return humanFileSize($this->size_in_bytes);
    }

    public function getFullPathAttribute(){
        return "{$this->relative_path}/{$this->name}.{$this->extension}";
    }
}
