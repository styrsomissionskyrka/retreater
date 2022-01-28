<?php

if (!function_exists('\\str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return '' === $needle || false !== strpos($haystack, $needle);
    }
}

if (!function_exists('\\array_some')) {
    function array_some(array $array, callable $callback): bool
    {
        foreach ($array as $item) {
            $value = call_user_func($callback, $item);
            if ($value === true) {
                return true;
            }
        }

        return false;
    }
}

if (!function_exists('\\array_every')) {
    function array_every(array $array, callable $callback): bool
    {
        foreach ($array as $item) {
            $value = call_user_func($callback, $item);
            if ($value === false) {
                return false;
            }
        }

        return true;
    }
}
