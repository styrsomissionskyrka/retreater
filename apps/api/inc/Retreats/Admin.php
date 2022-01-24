<?php

namespace StyrsoMissionskyrka\Retreats;

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
        ];
    }

    public function get_filters(): array
    {
        $type = PostType::$post_type;

        return [
            "manage_${type}_posts_columns" => ['register_custom_columns'],
            "manage_edit-${type}_sortable_columns" => ['set_custom_sortable_columns'],
        ];
    }

    public function register_custom_columns(array $columns): array
    {
        $new_columns = [];

        $new_columns['cb'] = $columns['cb'];
        $new_columns['title'] = $columns['title'];

        $new_columns['start_date'] = __('Start date', 'smk');
        $new_columns['end_date'] = __('End date', 'smk');

        $new_columns['date'] = $columns['date'];

        return $new_columns;
    }

    public function set_custom_sortable_columns(array $columns): array
    {
        $columns['start_date'] = 'start_date';
        $columns['end_date'] = 'end_date';
        return $columns;
    }

    public function print_custom_columns(string $column, int $post_id)
    {
        $format = 'Y-m-d H:i';
        $not_set = __('Date not set', 'smk');

        switch ($column) {
            case 'start_date':
            case 'end_date':
                $date = get_post_meta($post_id, $column, true);
                if (!empty($date)) {
                    echo date_i18n($format, strtotime($date));
                } else {
                    echo $not_set;
                }
                break;
        }
    }

    public function sort_custom_columns(\WP_Query $query)
    {
        $type = $query->get('post_type');

        if ($type === PostType::$post_type && $query->is_main_query() && $query->is_admin && $query->is_archive) {
            $meta_key = $query->get('orderby');

            switch ($query->get('orderby')) {
                case 'start_date':
                case 'end_date':
                    $query->set('meta_query', [
                        'relation' => 'OR',
                        ['key' => $meta_key, 'compare' => 'NOT EXISTS'],
                        ['key' => $meta_key, 'type' => 'DATETIME'],
                    ]);
                    $query->set('meta_key', $meta_key);
                    $query->set('meta_type', 'DATETIME');
                    $query->set('orderby', 'meta_value');
                    break;
            }
        }
    }
}
