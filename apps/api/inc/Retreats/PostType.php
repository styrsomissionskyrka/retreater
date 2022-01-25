<?php

namespace StyrsoMissionskyrka\Retreats;

use StyrsoMissionskyrka\AssetLoader;
use StyrsoMissionskyrka\Utils\ActionHookSubscriber;

class PostType implements ActionHookSubscriber
{
    /**
     * @var string
     */
    public static $post_type = 'retreat';

    public function get_actions(): array
    {
        return [
            'init' => [['register_post_type', 10], ['register_post_meta', 11]],
            'enqueue_block_editor_assets' => ['enqueue_editor_assets'],
        ];
    }

    public function register_post_type()
    {
        register_post_type(self::$post_type, [
            'labels' => [
                'name' => __('Retreats', 'smk'),
                'singular_name' => __('Retreat', 'smk'),
            ],
            'menu_icon' => 'dashicons-nametag',
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
                'description' => 'Stripe price id related to this retreat',
                'single' => true,
                'show_in_rest' => true,
            ],
            'start_date' => [
                'type' => 'string',
                'description' => 'Start date',
                'single' => true,
                'show_in_rest' => true,
            ],
            'end_date' => [
                'type' => 'string',
                'description' => 'End date',
                'single' => true,
                'show_in_rest' => true,
            ],
            'max_participants' => [
                'type' => 'number',
                'description' => 'Max participants',
                'single' => true,
                'show_in_rest' => true,
            ],
            'leaders' => [
                'type' => 'array',
                'description' => 'Retreat leaders',
                'single' => true,
                'show_in_rest' => [
                    'schema' => [
                        'type' => 'array',
                        'items' => ['type' => 'string'],
                    ],
                ],
            ],
        ];

        foreach ($meta_keys as $meta_key => $args) {
            register_post_meta(self::$post_type, $meta_key, $args);
        }
    }

    public function enqueue_editor_assets()
    {
        AssetLoader::enqueue('edit-retreat');
    }
}
