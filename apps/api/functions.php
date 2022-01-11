<?php

require_once __DIR__ . '/inc/AssetLoader.php';
\WPBundler\AssetLoader::prepare();

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return '' === $needle || false !== strpos($haystack, $needle);
    }
}
