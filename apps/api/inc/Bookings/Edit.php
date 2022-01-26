<?php

namespace StyrsoMissionskyrka\Bookings;

use Hidehalo\Nanoid\Client;
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

    public function get_actions(): array
    {
        return [
            'admin_enqueue_scripts' => ['enqueue_edit_script'],
            'save_post' => ['update_custom_post_meta', 10, 2],
            'smk/register-booking-data' => [['register_booking_meta', 10, 2], ['register_booking_retreat_data', 10, 2]],
        ];
    }

    public function get_filters(): array
    {
        return [
            'use_block_editor_for_post_type' => ['disable_block_editor', 10, 2],
            'default_title' => ['set_default_title'],
        ];
    }

    public function disable_block_editor(bool $status, string $post_type)
    {
        if ($post_type === self::$post_type) {
            return false;
        }

        return $status;
    }

    public function set_default_title(): string
    {
        $client = new Client();
        $id = $client->formattedId('abcdefghijklmnopqrstuvwxyz0123456789', 12);
        return substr($id, 0, 4) . '-' . substr($id, 4, 4) . '-' . substr($id, 8, 4);
    }

    public function update_custom_post_meta(int $post_id, \WP_Post $post)
    {
        if (!current_user_can('edit_post', $post_id)) {
            return $post_id;
        }

        if (isset($_POST['booking_meta'])) {
            $next_meta = $_POST['booking_meta'];
            foreach ($next_meta as $key => $value) {
                $prev = get_post_meta($post_id, $key, true);
                update_post_meta($post_id, $key, $value, $prev);
            }
        }

        if (isset($_POST['post_retreat_id'])) {
            update_post_meta($post_id, 'retreat_id', $_POST['post_retreat_id']);
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
}
