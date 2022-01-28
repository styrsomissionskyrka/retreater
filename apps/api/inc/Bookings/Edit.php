<?php

namespace StyrsoMissionskyrka\Bookings;

use Hidehalo\Nanoid\Client;
use Stripe\StripeClient;
use StyrsoMissionskyrka\AssetLoader;
use StyrsoMissionskyrka\Retreats\PostType as RetreatPostType;
use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use StyrsoMissionskyrka\Utils\FilterHookSubscriber;

/**
 * The idea is to reuse a custom post type for bookings and let the classic
 * status indicators work as indicators for which state the booking is in:
 *
 * - draft   - in queue since all seats are taken
 * - pending - payment initiated, awaiting successful payment
 * - publish - payment done, all confirmed
 *
 * Setup cron job that checks for bookings that been in pending for too long.
 */
class Edit implements ActionHookSubscriber, FilterHookSubscriber
{
    /**
     * @var string
     */
    public static $post_type = 'booking';

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
            'admin_enqueue_scripts' => ['enqueue_edit_script'],
            'save_post' => ['save_post', 10, 2],
            'smk/register-booking-data' => [
                ['register_booking_meta', 10, 2],
                ['register_booking_retreat_data', 10, 2],
                ['register_booking_price_data', 10, 2],
            ],
        ];
    }

    public function get_filters(): array
    {
        return [
            'use_block_editor_for_post_type' => ['disable_block_editor', 10, 2],
            'default_title' => ['set_default_title', 10, 2],
        ];
    }

    public function disable_block_editor(bool $status, string $post_type)
    {
        if ($post_type === self::$post_type) {
            return false;
        }

        return $status;
    }

    public function set_default_title(string $title, \WP_Post $post): string
    {
        if ($post->post_type !== PostType::$post_type) {
            return $title;
        }

        $client = new Client();
        $id = $client->formattedId('abcdefghijklmnopqrstuvwxyz0123456789', 12);
        return substr($id, 0, 4) . '-' . substr($id, 4, 4) . '-' . substr($id, 8, 4);
    }

    public function save_post(int $post_id, \WP_Post $post)
    {
        if (!current_user_can('edit_post', $post_id)) {
            return $post_id;
        }

        if ($post->post_type !== PostType::$post_type) {
            return $post_id;
        }

        $update_post_data = $_POST;
        foreach ($update_post_data as $key => $data) {
            switch ($key) {
                case 'booking_meta':
                    foreach ($data as $key => $value) {
                        $prev = get_post_meta($post_id, $key, true);
                        update_post_meta($post_id, $key, $value, $prev);
                    }
                    break;

                case 'post_retreat_id':
                    update_post_meta($post_id, 'retreat_id', $data);
                    break;

                case 'booking_price':
                    if ($data['status'] !== 'paid') {
                        $this->update_retreat_price($data, $post_id);
                    }
                    break;
            }
        }

        return $post_id;
    }

    public function enqueue_edit_script(string $hook)
    {
        global $post;

        if (($hook === 'post-new.php' || $hook === 'post.php') && $post->post_type === PostType::$post_type) {
            $handles = AssetLoader::enqueue('edit-booking');
            do_action('smk/register-booking-data', $handles['js'], $post);
        }
    }

    public function register_booking_meta(string $handle, \WP_Post $post)
    {
        $keys = ['name', 'email', 'phone', 'address'];
        $data = [];

        foreach ($keys as $key) {
            $value = get_post_meta($post->ID, $key, true);
            $data[$key] = $value ? $value : null;
        }

        wp_localize_script($handle, 'SMK_BOOKING_META', $data);
    }

    public function register_booking_retreat_data(string $handle, \WP_Post $post)
    {
        $retreat_id = get_post_meta($post->ID, 'retreat_id', true);
        $retreat = null;
        if (!empty($retreat_id)) {
            $related_retreat = get_post($retreat_id);
            if (!empty($related_retreat)) {
                $retreat = [
                    'id' => $related_retreat->ID,
                    'title' => $related_retreat->post_title,
                ];
            }
        }

        $retreats = [];
        $query = new \WP_Query(['post_type' => RetreatPostType::$post_type]);
        foreach ($query->get_posts() as $post) {
            $retreats[] = ['id' => $post->ID, 'title' => $post->post_title];
        }

        wp_localize_script($handle, 'SMK_BOOKING_RELATED_RETREAT', [
            'retreat' => $retreat,
            'retreats' => $retreats,
        ]);
    }

    public function register_booking_price_data(string $handle, \WP_Post $post)
    {
        $booking_price_id = get_post_meta($post->ID, 'stripe_price_id', true);
        $booking_price = null;

        if (!empty($booking_price_id)) {
            $booking_price = $this->retrieve_amount($booking_price_id);
        }

        $retreat_id = get_post_meta($post->ID, 'retreat_id', true);
        $retreat_price_id = get_post_meta($retreat_id, 'stripe_price_id', true);
        $retreat_price = null;

        if (!empty($retreat_price_id)) {
            $retreat_price = $this->retrieve_amount($retreat_price_id);
        }

        $mode = 'no_payment';
        if ($booking_price_id === $retreat_price_id) {
            $mode = 'retreat';
        } elseif (!empty($booking_price)) {
            $mode = 'custom';
        }

        $stripe_session_id = get_post_meta($post->ID, 'stripe_session_id', true);
        $payment_status = 'no_payment_required';
        $payment_intent = null;
        if (!empty($stripe_session_id)) {
            try {
                $session = $this->stripe->checkout->sessions->retrieve($stripe_session_id);
                $payment_status = $session->payment_status;
                $payment_intent = $session->payment_intent;
            } catch (\Stripe\Exception\ApiErrorException $exception) {
            }
        }

        wp_localize_script($handle, 'SMK_BOOKING_RELATED_PRICE', [
            'mode' => $mode,
            'status' => $payment_status,
            'booking_price' => $booking_price,
            'retreat_price' => $retreat_price,
            'payment_intent' => $payment_intent,
        ]);
    }

    protected function update_retreat_price(array $config, int $post_id)
    {
        $mode = $config['mode'];

        switch ($mode) {
            case 'no_payment':
                delete_post_meta($post_id, 'stripe_price_id');
                delete_post_meta($post_id, 'stripe_session_id');
                break;

            case 'retreat':
                $retreat_id = get_post_meta($post_id, 'retreat_id', true);
                if (empty($retreat_id)) {
                    break;
                }

                $retreat_price_id = get_post_meta($retreat_id, 'stripe_price_id', true);
                update_post_meta($post_id, 'stripe_price_id', $retreat_price_id);
                break;

            case 'custom':
                $retreat_id = get_post_meta($post_id, 'retreat_id', true);
                if (empty($retreat_id)) {
                    break;
                }

                $retreat = get_post($retreat_id);

                $current_amount = 0;
                $current_price_id = get_post_meta($post_id, 'stripe_price_id', true);

                if (!empty($current_price_id)) {
                    $current_amount = $this->retrieve_amount($current_price_id);
                }

                if ($current_amount !== (int) $config['amount']) {
                    $data = [
                        'unit_amount' => (int) $config['amount'],
                        'currency' => 'sek',
                        'product_data' => [
                            'name' => $retreat->post_title ?? $retreat_id,
                            'metadata' => ['retreat_id' => $retreat_id],
                        ],
                    ];
                    $price = $this->stripe->prices->create($data);
                    update_post_meta($post_id, 'stripe_price_id', $price->id);
                }

                break;
        }
    }

    protected function retrieve_amount(string $id)
    {
        try {
            $stripe_price = $this->stripe->prices->retrieve($id);
            return $stripe_price->unit_amount;
        } catch (\Stripe\Exception\ApiErrorException $exception) {
            return null;
        }
    }
}
