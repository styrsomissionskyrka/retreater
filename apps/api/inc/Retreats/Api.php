<?php

namespace StyrsoMissionskyrka\Retreats;

use Stripe\StripeClient;
use StyrsoMissionskyrka\Utils\ActionHookSubscriber;

class Api implements ActionHookSubscriber
{
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
            'rest_api_init' => ['register_rest_field'],
        ];
    }

    public function register_rest_field()
    {
        register_rest_field(PostType::$post_type, 'stripe_price', [
            'get_callback' => [$this, 'get_stripe_price'],
            'update_callback' => [$this, 'set_stripe_price'],
            'schema' => [
                'description' =>
                    'Stripe price, fetched based on the posts meta key `stripe_price_id`. Returns 0 if no price is previously defined',
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
}
