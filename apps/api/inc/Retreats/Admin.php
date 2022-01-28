<?php

namespace StyrsoMissionskyrka\Retreats;

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
            'name' => 'start_date',
            'label' => __('Start date', 'smk'),
            'render' => function (int $post_id) {
                $this->render_column($post_id, 'start_date');
            },
            'sort' => function (\WP_Query $query) {
                $this->sort_column($query, 'start_date');
            },
        ]);

        AdminTable::add_column([
            'post_type' => PostType::$post_type,
            'index' => 3,
            'name' => 'end_date',
            'label' => __('End date', 'smk'),
            'render' => function (int $post_id) {
                $this->render_column($post_id, 'end_date');
            },
            'sort' => function (\WP_Query $query) {
                $this->sort_column($query, 'end_date');
            },
        ]);
    }

    protected function render_column(int $post_id, string $key)
    {
        $format = 'Y-m-d H:i';
        $not_set = __('Date not set', 'smk');
        $date = get_post_meta($post_id, $key, true);
        if (!empty($date)) {
            echo date_i18n($format, strtotime($date));
        } else {
            echo $not_set;
        }
    }

    protected function sort_column(\WP_Query $query, string $column)
    {
        $query->set('meta_query', [
            'relation' => 'OR',
            ['key' => $column, 'compare' => 'NOT EXISTS'],
            ['key' => $column, 'type' => 'DATETIME'],
        ]);
        $query->set('meta_key', $column);
        $query->set('meta_type', 'DATETIME');
        $query->set('orderby', 'meta_value');
    }
}
