<?php

namespace StyrsoMissionskyrka\Bookings;

use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use StyrsoMissionskyrka\Utils\FilterHookSubscriber;

class Admin implements ActionHookSubscriber, FilterHookSubscriber
{
    public function get_actions(): array
    {
        $type = PostType::$post_type;

        return [
            "manage_${type}_posts_custom_column" => ['print_custom_columns', 10, 2],
            'pre_get_posts' => ['sort_custom_columns'],
            'restrict_manage_posts' => ['add_archive_filters'],
        ];
    }

    public function get_filters(): array
    {
        $type = PostType::$post_type;

        return [
            "manage_${type}_posts_columns" => ['register_custom_columns'],
        ];
    }

    public function register_custom_columns(array $columns): array
    {
        $new_columns = [];

        $new_columns['cb'] = $columns['cb'];
        $new_columns['title'] = $columns['title'];

        $new_columns['status'] = __('Status', 'smk');
        $new_columns['participant'] = __('Participant', 'smk');
        $new_columns['retreat'] = __('Retreat', 'smk');

        $new_columns['date'] = $columns['date'];

        return $new_columns;
    }

    public function print_custom_columns(string $column, int $post_id)
    {
        switch ($column) {
            case 'status':
                $status = get_post_status($post_id);
                $stat = get_post_status_object($status);
                echo $stat->label;
                break;

            case 'participant':
                $email = get_post_meta($post_id, 'email', true);
                $name = get_post_meta($post_id, 'name', true);
                echo ($name ?? '-') . '<br />';

                if (!empty($email)) {
                    echo sprintf('<a href="mailto:%1$s">%1$s</a>', $email);
                } else {
                    echo '-';
                }
                break;

            case 'retreat':
                $retreat_id = get_post_meta($post_id, 'retreat_id', true);
                if (!empty($retreat_id)) {
                    $retreat = get_post($retreat_id);
                    $link = get_edit_post_link($retreat);
                    echo sprintf('<a href="%1$s">%2$s</a>', $link, $retreat->post_title);
                } else {
                    echo '-';
                }
        }
    }

    public function sort_custom_columns(\WP_Query $query)
    {
        $type = $query->get('post_type');

        if ($type !== PostType::$post_type) {
            return;
        }

        if (!$query->is_admin) {
            return;
        }

        if (isset($_GET['retreat_id']) && !empty($_GET['retreat_id'])) {
            $retreat_id = $_GET['retreat_id'];
            $meta_query = $query->get('meta_query', []);
            $meta_query[] = ['key' => 'retreat_id', 'value' => (int) $retreat_id];
            $query->set('meta_query', $meta_query);
        }

        if (isset($_GET['email']) && !empty($_GET['email'])) {
            $email = $_GET['email'];
            $meta_query = $query->get('meta_query', []);
            $meta_query[] = ['key' => 'email', 'value' => $email];
            $query->set('meta_query', $meta_query);
        }
    }

    public function add_archive_filters(string $post_type)
    {
        global $wpdb;

        if ($post_type !== PostType::$post_type) {
            return;
        }

        // Filter by retreat
        $retreat_ids = $wpdb->get_col("SELECT meta_value FROM $wpdb->postmeta WHERE meta_key = 'retreat_id'");
        $selected_id = isset($_GET['retreat_id']) ? (int) $_GET['retreat_id'] : 0;

        echo '<label for="filter-by-retreat_id" class="screen-reader-text">';
        echo __('Filter by retreat', 'smk');
        echo '</label>';

        echo '<select name="retreat_id" id="filter-by-retreat_id" class="postform">';
        echo '<option value="">' . __('All retreats', 'smk') . '</option>';
        foreach ($retreat_ids as $retreat_id) {
            $retreat = get_post($retreat_id);

            echo sprintf(
                '<option value="%1$s"%2$s>%3$s</options>',
                $retreat->ID,
                $selected_id === $retreat->ID ? ' selected="selected"' : '',
                $retreat->post_title
            );
        }
        echo '</select>';

        // Filter by email
        $selected_email = isset($_GET['email']) ? $_GET['email'] : '';
        echo '<label for="filter-by-email" class="screen-reader-text">';
        echo __('Filter by email', 'smk');
        echo '</label>';
        echo '<input type="email" name="email" id="filter-by-email" value="' .
            $selected_email .
            '" style="float: left; margin-right: 6px; max-width: 12.5rem;">';
    }
}
