<?php

namespace App\Traits;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;

trait HasMedia
{
    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function addMediaFromUrl($url, $tag = null, $is_public = false, $uploader = null)
    {
        $content = file_get_contents($url);

        return $this->addMediaFromContent($content, $tag, $is_public, uploader: $uploader);
    }

    public function addMediaFromRequest($name, $tag = null, $is_public = false, $request = null, $uploader = null){
        $request ??= request();

        $uploader ??= $request->user();
        $file = $request->file($name);
        $content = $file->get();
        $extension = $file->getClientOriginalExtension();

        return $this->addMediaFromContent($content, $tag, $is_public, ['file_extension' => $extension]);
    }

    public function addMediaFromContent($content, $tag = null, $is_public = false, $media_data = [], $uploader = null)
    {
        $disk = env('MEDIA_DISK', 'local');
        $name = str()->uuid()->toString();

        $uploader_id = $media_data['uploader_id'] ?? $uploader?->id ?? user()?->id;
        
        $extension = $media_data['file_extension'] ?? getMimeFromBinary($content, true);
        $mime = getMimeFromBinary($content);
        
        $media = Media::create(compact('name', 'extension', 'tag', 'is_public', 'uploader_id', 'disk', 'mime'));
        
        $date_path = date('Y/m/d');

        $relative_path = "{$date_path}/{$media->id}";
        $full_path = "{$relative_path}/{$name}.{$extension}";

        try {
            Storage::disk($disk)->put($full_path, $content, $is_public ? 'public' : []);
            $size_in_bytes = Storage::disk($disk)->size($full_path);
        } catch (\Throwable $th) {
            $media->delete();
            throw $th;
        }

        $media->update([
            'relative_path' => $relative_path,
            'size_in_bytes' => $size_in_bytes,
        ]);

        return $media;
    }
}

