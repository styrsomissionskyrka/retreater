<?php

require_once __DIR__ . '/inc/AssetLoader.php';

\WPBundler\AssetLoader::prepare();

if (!function_exists('\\WP_REST_Blocks\\Data\\get_blocks')) {
    function smk_admin_notice()
    {
        $title = esc_html__(
            'Styrsö Missionskyrka API theme can\'t work properly.',
            'smk'
        );
        $message = esc_html__(
            'The plugin "wp-rest-blocks" is required for this theme to work as expected.',
            'smk'
        );

        echo '<div class="notice notice-error">';
        echo '<p><strong>' . $title . '</strong></p>';
        echo '<p>' . wp_kses($message, ['code' => []]) . '</p>';
        echo '</div>';
    }

    add_action('admin_notices', __NAMESPACE__ . '\\smk_admin_notice');
}

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return '' === $needle || false !== strpos($haystack, $needle);
    }
}
