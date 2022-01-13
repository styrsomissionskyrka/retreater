<?php

namespace StyrsoMissionskyrka;

require_once __DIR__ . '/inc/polyfills.php';
require_once __DIR__ . '/inc/helpers.php';
require_once __DIR__ . '/inc/AssetLoader.php';

\WPBundler\AssetLoader::prepare();

Helpers\admin_notice(
    !function_exists('\\WP_REST_Blocks\\Data\\get_blocks'),
    __('Styrsö Missionskyrka API theme can\'t work properly.', 'smk'),
    __(
        'The plugin "wp-rest-blocks" is required for this theme to work as expected.',
        'smk'
    )
);

Helpers\admin_notice(
    !defined('SMK_CLIENT_BASE_URL'),
    __('The constant <code>SMK_CLIENT_BASE_URL</code> must be defined.', 'smk'),
    __('Without it the app will not work as expected.', 'smk')
);

\add_action('init', function () {
    \load_theme_textdomain('smk', \get_template_directory() . '/languages');
});

\add_filter('preview_post_link', function (string $preview_link) {
    $post = \get_post();
    if (!$post) {
        return $preview_link;
    }

    $id = $post->ID;
    $type = \get_post_type($id);
    $slug = \get_permalink($post); // $post->post_name;
    $parent_id = $post->post_parent;
    $parent_type = \get_post_type($parent_id);
    $parent_slug = \get_permalink($parent_id); // \get_post_field('post_name', $parent_id);

    return \add_query_arg(
        [
            'id' => $id,
            'type' => $type,
            'slug' => $slug,
            'parent_id' => $parent_id,
            'parent_type' => $parent_type,
            'parent_slug' => $parent_slug,
        ],
        \SMK_CLIENT_BASE_URL . '/api/preview'
    );
});

\add_filter(
    'rest_prepare_revision',
    function (\WP_REST_Response $response, \WP_Post $post) {
        $has_blocks = \has_blocks($post);
        $blocks = [];
        if ($has_blocks) {
            $blocks = \WP_REST_Blocks\Data\get_blocks(
                $post->post_content,
                $post->ID
            );
        }

        $response->set_data(
            array_merge($response->get_data(), [
                'has_blocks' => $has_blocks,
                'blocks' => $blocks,
            ])
        );

        return $response;
    },
    10,
    2
);
