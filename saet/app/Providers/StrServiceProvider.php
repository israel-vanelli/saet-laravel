<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

class StrServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Str::macro('removePrefix', function($string, $prefixes){
            $prefixes = (array) $prefixes;

            foreach($prefixes as $prefix){
                if(Str::startsWith($string, $prefix)){
                    return Str::replaceFirst($prefix, '' , $string);
                }
            }
            return $string;
        });

        Stringable::macro('removePrefix', function($prefix){
            return str(Str::removePrefix($this->value, $prefix));
        });

        Str::macro('removeSuffix', function($string, $suffixes){
            $suffixes = (array) $suffixes;

            foreach($suffixes as $suffix){
                if(Str::endsWith($string, $suffix)){
                    return Str::replaceLast($suffix, '' , $string);
                }
            }
            return $string;
        });

        Stringable::macro('removeSuffix', function($suffix){
            return str(Str::removeSuffix($this->value, $suffix));
        });
        
        Str::macro('unnaccent', function($string) {

            // It looks bad, I know. But at least it was ChatGPT who wrote it manually
            // Explicitly map each accented character to its unaccented version, for both cases.
            $map = [
                'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a',
                'Á' => 'A', 'À' => 'A', 'Ã' => 'A', 'Â' => 'A', 'Ä' => 'A',
                'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
                'É' => 'E', 'È' => 'E', 'Ê' => 'E', 'Ë' => 'E',
                'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
                'Í' => 'I', 'Ì' => 'I', 'Î' => 'I', 'Ï' => 'I',
                'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
                'Ó' => 'O', 'Ò' => 'O', 'Õ' => 'O', 'Ô' => 'O', 'Ö' => 'O',
                'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
                'Ú' => 'U', 'Ù' => 'U', 'Û' => 'U', 'Ü' => 'U',
                'ç' => 'c', 'Ç' => 'C',
                'ñ' => 'n', 'Ñ' => 'N',
            ];

            // Iterate over each character in the string and replace it if it exists in the map.
            return strtr($string, $map);
        });

        Stringable::macro('unnaccent', function() {
            return str(Str::unnaccent($this->value));
        });

        Str::macro('removeSpecialCharacters', function($string) {
            return preg_replace('/[^\w-]/', '', $string);
        });

        Stringable::macro('removeSpecialCharacters', function() {
            return str(Str::removeSpecialCharacters($this->value));
        });
    }
}
