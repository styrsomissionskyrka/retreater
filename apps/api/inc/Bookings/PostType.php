<?php

namespace StyrsoMissionskyrka\Bookings;

use StyrsoMissionskyrka\Retreats\PostType as RetreatsPostType;
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
class PostType implements ActionHookSubscriber, FilterHookSubscriber
{
    /**
     * @var string
     */
    public static $post_type = 'booking';

    public function get_actions(): array
    {
        return [
            'init' => [['register_post_type', 10], ['register_post_meta', 11], ['register_post_status', 12]],
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
                'name' => __('Bookings', 'smk'),
                'singular_name' => __('Booking', 'smk'),
            ],
            'public' => false,
            'has_archive' => true,
            'show_in_rest' => false,
            'show_ui' => true,
            'show_in_menu' => 'edit.php?post_type=' . RetreatsPostType::$post_type,
            'supports' => ['title', 'editor', 'revisions', 'custom-fields'],
        ]);
    }

    public function register_post_meta()
    {
        $meta_keys = [
            'retreat_id' => [
                'type' => 'integer',
                'single' => true,
            ],
            'stripe_price_id' => [
                'type' => 'string',
                'single' => true,
            ],
            'stripe_discount_id' => [
                'type' => 'string',
                'single' => true,
            ],
            'stripe_session_id' => [
                'type' => 'string',
                'single' => true,
            ],
            'name' => [
                'type' => 'string',
                'single' => true,
            ],
            'email' => [
                'type' => 'string',
                'single' => true,
            ],
            'phone' => [
                'type' => 'string',
                'single' => true,
            ],
            'address' => [
                'type' => 'object',
                'single' => true,
                // street, postal, city
            ],
        ];

        foreach ($meta_keys as $meta_key => $args) {
            register_post_meta(self::$post_type, $meta_key, $args);
        }
    }

    public function register_post_status()
    {
        $statuses = [
            'booking_created' => [
                'label' => __('Created', 'smk'),
                'label_count' => _n_noop(
                    'Created <span class="count">(%s)</span>',
                    'Created <span class="count">(%s)</span>',
                    'smk'
                ),
            ],
            'booking_pending' => [
                'label' => __('Pending', 'smk'),
                'label_count' => _n_noop(
                    'Pending <span class="count">(%s)</span>',
                    'Pending <span class="count">(%s)</span>',
                    'smk'
                ),
            ],
            'booking_confirmed' => [
                'label' => __('Confirmed', 'smk'),
                'label_count' => _n_noop(
                    'Confirmed <span class="count">(%s)</span>',
                    'Confirmed <span class="count">(%s)</span>',
                    'smk'
                ),
            ],
            'booking_cancelled' => [
                'label' => __('Cancelled', 'smk'),
                'label_count' => _n_noop(
                    'Cancelled <span class="count">(%s)</span>',
                    'Cancelled <span class="count">(%s)</span>',
                    'smk'
                ),
            ],
        ];

        foreach ($statuses as $status => $label) {
            register_post_status($status, [
                'label' => $label['label'],
                'label_count' => $label['label_count'],
                'public' => false,
                'internal' => true,
                'private' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
            ]);
        }
    }
}
