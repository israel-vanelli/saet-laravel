<?php

namespace App\Helpers;

use Illuminate\Support\Arr as SupportArr;

class Arr extends SupportArr{
    /**
     * Flatten a multi-dimensional associative array with a separator.
     *
     * @param  iterable  $array
     * @param  string  $separator
     * @param  string  $prepend
     * @return array
     */
    public static function flattenWith($array, $separator , $prepend = '')
    {
        $results = [];

        foreach ($array as $key => $value) {
            if (is_array($value) && ! empty($value)) {
                $results = array_merge($results, static::flattenWith($value, $separator ,$prepend.$key.$separator));
            } else {
                $results[$prepend.$key] = $value;
            }
        }

        return $results;
    }

    /**
     * Flatten a multi-dimensional associative array with a separator.
     *
     * @param  iterable  $array
     * @param  string  $prepend
     * @return array
     */
    public static function arrow($array , $prepend = '')
    {
        return self::flattenWith($array, '->', $prepend);
    }

    /**
     * Returns common values between two arrays
     * 
     * @param array $first_array
     * @param array $second_array
     * @return array
     */
    public static function commonValues(array $first_array, array $second_array){
        return array_intersect($first_array, $second_array);
    }

    /**
     * Returns if two arrays have common values between them
     * 
     * @param array $first_array
     * @param array $second_array
     * @return bool
     */
    public static function commonValuesExist(array $first_array, array $second_array){
        return count(self::commonValues($first_array, $second_array)) > 0;
    }


}