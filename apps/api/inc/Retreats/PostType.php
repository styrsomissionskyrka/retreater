<?php

namespace StyrsoMissionskyrka\Retreats;

use StyrsoMissionskyrka\AssetLoader;
use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use StyrsoMissionskyrka\Utils\FilterHookSubscriber;

class PostType implements ActionHookSubscriber, FilterHookSubscriber
{
    public static $post_type = 'retreat';

    public function get_actions(): array
    {
        return [
            'init' => [['register_post_type', 10], ['register_post_meta', 11]],
        ];
    }

    public function get_filters(): array
    {
        return [];
    }

    public function register_post_type()
    {
        register_post_type(self::$post_type, [
            'labels' => [
                'name' => __('Retreats', 'smk'),
                'singular_name' => __('Retreat', 'smk'),
            ],
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'rest_base' => 'retreats',
            'supports' => ['title', 'editor', 'revisions', 'excerpt', 'thumbnail', 'custom-fields'],
        ]);
    }

    public function register_post_meta()
    {
        $meta_keys = [
            'stripe_price_id' => [
                'type' => 'string',
                'description' => __('Stripe price id related to this retreat', 'smk'),
                'single' => true,
                'show_in_rest' => true,
            ],
        ];

        foreach ($meta_keys as $meta_key => $args) {
            register_post_meta(self::$post_type, $meta_key, $args);
        }
    }
}
