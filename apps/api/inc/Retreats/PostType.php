<?php

namespace StyrsoMissionskyrka\Retreats;

use Stripe\StripeClient;
use StyrsoMissionskyrka\AssetLoader;
use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use StyrsoMissionskyrka\Utils\FilterHookSubscriber;

class PostType implements ActionHookSubscriber, FilterHookSubscriber
{
    /**
     * @var string
     */
    public static $post_type = 'retreat';

    /**
     * @var StripeClient
     */
    protected $stripe;

    public function __construct(StripeClient $stripe)
    {
        $this->stripe = $stripe;
    }

    public function get_actions(): array
    {
        return [
            'init' => [['register_post_type', 10], ['register_post_meta', 11]],
            'rest_api_init' => ['register_rest_field'],
            'enqueue_block_editor_assets' => ['enqueue_editor_assets'],
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
            'menu_icon' => 'nametag',
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
            'start_date' => [
                'type' => 'string',
                'description' => __('Start date', 'smk'),
                'single' => true,
                'show_in_rest' => true,
            ],
            'end_date' => [
                'type' => 'string',
                'description' => __('End date', 'smk'),
                'single' => true,
                'show_in_rest' => true,
            ],
            'max_participants' => [
                'type' => 'number',
                'description' => __('Max participants', 'smk'),
                'single' => true,
                'show_in_rest' => true,
            ],
        ];

        foreach ($meta_keys as $meta_key => $args) {
            register_post_meta(self::$post_type, $meta_key, $args);
        }
    }

    public function register_rest_field()
    {
        register_rest_field(self::$post_type, 'stripe_price', [
            'get_callback' => [$this, 'get_stripe_price'],
            'update_callback' => [$this, 'set_stripe_price'],
            'schema' => [
                'description' => __(
                    'Stripe price, fetched based on the posts meta key `stripe_price_id`. Returns 0 if no price is previously defined',
                    'smk'
                ),
                'type' => 'number',
                'required' => true,
            ],
        ]);
    }

    public function get_stripe_price(array $post)
    {
        $price_id = get_post_meta($post['id'], 'stripe_price_id', true);

        if (empty($price_id)) {
            return 0;
        }

        $price = $this->stripe->prices->retrieve($price_id);
        return $price->unit_amount;
    }

    public function set_stripe_price(int $amount, \WP_Post $post)
    {
        if ($amount == 0) {
            return $amount;
        }

        $price_id = get_post_meta($post->ID, 'stripe_price_id', true);

        $previous_product = '';
        if (!empty($price_id)) {
            $previous_price = $this->stripe->prices->retrieve($price_id);
            $previous_product = $previous_price->product;
        }

        $data = [
            'unit_amount' => $amount,
            'currency' => 'sek',
        ];

        if (empty($previous_product)) {
            $data['product_data'] = [
                'name' => $post->post_title ?? $post->ID,
                'metadata' => ['retreat_id' => $post->ID],
            ];
        } else {
            $data['product'] = $previous_product;
        }

        $price = $this->stripe->prices->create($data);

        update_post_meta($post->ID, 'stripe_price_id', $price->id);

        if (!empty($price_id)) {
            $this->stripe->prices->update($price_id, ['active' => false]);
        }

        return $amount;
    }

    public function enqueue_editor_assets()
    {
        AssetLoader::enqueue('edit-retreat');
    }
}
