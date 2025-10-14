<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function display(Media $media){
        $contents = Storage::disk($media->disk)->get($media->full_path);
        $mime = $media->mime;
        
        return response($contents, 200)->header('Content-Type', $mime);
    }
}
