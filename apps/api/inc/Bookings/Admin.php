<?php

namespace StyrsoMissionskyrka\Bookings;

use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use StyrsoMissionskyrka\Utils\AdminTable;

class Admin implements ActionHookSubscriber
{
    public function get_actions(): array
    {
        return [
            'init' => ['setup_table'],
        ];
    }

    public function setup_table()
    {
        AdminTable::add_column([
            'post_type' => PostType::$post_type,
            'index' => 2,
            'name' => 'status',
            'label' => __('Status', 'smk'),
            'render' => function (int $post_id) {
                $status = get_post_status($post_id);
                $stat = get_post_status_object($status);
                echo $stat->label;
            },
        ]);

        AdminTable::add_column([
            'post_type' => PostType::$post_type,
            'index' => 3,
            'name' => 'participant',
            'label' => __('Participant', 'smk'),
            'render' => function (int $post_id) {
                $email = get_post_meta($post_id, 'email', true);
                $name = get_post_meta($post_id, 'name', true);
                echo ($name ?? '-') . '<br />';

                if (!empty($email)) {
                    echo sprintf('<a href="mailto:%1$s">%1$s</a>', $email);
                } else {
                    echo '-';
                }
            },
        ]);

        AdminTable::add_column([
            'post_type' => PostType::$post_type,
            'index' => 4,
            'name' => 'retreat',
            'label' => __('Retreat', 'smk'),
            'render' => function (int $post_id) {
                $retreat_id = get_post_meta($post_id, 'retreat_id', true);
                if (!empty($retreat_id)) {
                    $retreat = get_post($retreat_id);
                    $link = get_edit_post_link($retreat);
                    echo sprintf('<a href="%1$s">%2$s</a>', $link, $retreat->post_title);
                } else {
                    echo '-';
                }
            },
        ]);

        AdminTable::add_select_filter([
            'post_type' => PostType::$post_type,
            'name' => 'post_status',
            'label' => __('Status', 'smk'),
            'label_plural' => __('Statuses', 'smk'),
            'options' => function () {
                $statuses = [];
                foreach (get_post_stati([], 'objects') as $status => $args) {
                    if (str_contains($status, 'booking_')) {
                        $statuses[$status] = $args->label;
                    }
                }
                return $statuses;
            },
        ]);

        AdminTable::add_select_filter([
            'post_type' => PostType::$post_type,
            'name' => 'retreat_id',
            'label' => __('Retreat', 'smk'),
            'label_plural' => __('Retreats', 'smk'),
            'options' => function () {
                global $wpdb;
                $retreat_ids = $wpdb->get_col("SELECT meta_value FROM $wpdb->postmeta WHERE meta_key = 'retreat_id'");
                $retreats = [];
                foreach ($retreat_ids as $id) {
                    $retreat = get_post($id);
                    $retreats[(string) $id] = $retreat->post_title;
                }

                return $retreats;
            },
            'sort' => function (\WP_Query $query, string $value) {
                $meta_query = $query->get('meta_query', []);
                $meta_query[] = ['key' => 'retreat_id', 'value' => (int) $value];
                $query->set('meta_query', $meta_query);
            },
        ]);

        AdminTable::add_input_filter([
            'post_type' => PostType::$post_type,
            'name' => 'email',
            'label' => __('E-mail', 'smk'),
            'type' => 'email',
            'sort' => function (\WP_Query $query, string $value) {
                $meta_query = $query->get('meta_query', []);
                $meta_query[] = ['key' => 'email', 'value' => $value];
                $query->set('meta_query', $meta_query);
            },
        ]);
    }
}
