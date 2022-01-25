<?php

namespace StyrsoMissionskyrka\Bookings;

use Hidehalo\Nanoid\Client;
use StyrsoMissionskyrka\AssetLoader;
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

    public function enqueue_edit_script(string $hook)
    {
        global $post;

        if (($hook === 'post-new.php' || $hook === 'post.php') && $post->post_type === PostType::$post_type) {
            AssetLoader::enqueue('edit-booking');
        }
    }
}
