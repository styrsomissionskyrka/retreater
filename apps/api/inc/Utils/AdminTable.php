<?php

namespace StyrsoMissionskyrka\Utils;

class AdminTable
{
    public static function add_column(array $args)
    {
        $post_type = $args['post_type'];

        add_filter(
            "manage_${post_type}_posts_columns",
            function (array $columns) use ($args) {
                $index = $args['index'];
                $iterator = 0;
                $added = false;
                $new_columns = [];
                foreach ($columns as $key => $value) {
                    if ($iterator === $index) {
                        $new_columns[$args['name']] = $args['label'] ?? $args['name'];
                        $added = true;
                    }

                    $new_columns[$key] = $value;
                    $iterator = $iterator + 1;
                }

                if (!$added) {
                    $new_columns[$args['name']] = $args['label'] ?? $args['name'];
                }

                return $new_columns;
            },
            10,
            1
        );

        add_action(
            "manage_${post_type}_posts_custom_column",
            function (string $column, int $post_id) use ($args) {
                if ($column === $args['name']) {
                    call_user_func($args['render'], $post_id);
                }
            },
            10,
            2
        );

        if (isset($args['sort'])) {
            add_filter(
                "manage_edit-${post_type}_sortable_columns",
                function (array $columns) use ($args) {
                    $columns[$args['name']] = $args['name'];
                    return $columns;
                },
                10,
                1
            );

            add_action(
                'pre_get_posts',
                function (\WP_Query $query) use ($args) {
                    $type = $query->get('post_type');

                    if (
                        $type === $args['post_type'] &&
                        $query->is_main_query() &&
                        $query->is_admin &&
                        $query->is_archive
                    ) {
                        $meta_key = $query->get('orderby');
                        if ($meta_key === $args['name']) {
                            call_user_func($args['sort'], $query);
                        }
                    }
                },
                10,
                1
            );
        }
    }

    public static function add_select_filter(array $args)
    {
        self::prepare_filter_query($args);
        add_action(
            'restrict_manage_posts',
            function (string $post_type) use ($args) {
                if ($post_type !== $args['post_type']) {
                    return;
                }

                $name = $args['name'];
                $current_value = isset($_GET[$name]) ? $_GET[$name] : '';
                $options = call_user_func($args['options']);
                $id = 'filter-by-' . $name;

                echo sprintf('<label for="%s" class="screen-reader-text">', $id);
                echo sprintf(__('Filter by %s', 'smk'), strtolower($args['label']));
                echo '</label>';

                echo sprintf('<select name="%1$s" id="%2$s">', $name, $id);
                echo sprintf(
                    '<option value="">%s</option>',
                    sprintf(__('All %s', 'smk'), strtolower($args['label_plural']))
                );

                foreach ($options as $value => $label) {
                    echo sprintf(
                        '<option value="%1$s"%2$s>%3$s</option>',
                        $value,
                        (string) $value === (string) $current_value ? ' selected="selected"' : '',
                        $label
                    );
                }

                echo '</select>';
            },
            10,
            1
        );
    }

    public static function add_input_filter(array $args)
    {
        self::prepare_filter_query($args);
        add_action(
            'restrict_manage_posts',
            function (string $post_type) use ($args) {
                if ($post_type !== $args['post_type']) {
                    return;
                }

                $name = $args['name'];
                $current_value = isset($_GET[$name]) ? $_GET[$name] : '';
                $id = 'filter-by-' . $name;

                echo sprintf('<label for="%s" class="screen-reader-text">', $id);
                echo sprintf(__('Filter by %s', 'smk'), strtolower($args['label']));
                echo '</label>';
                echo sprintf(
                    '<input type="%1$s" name="%2$s" id="%3$s" value="%4$s" style="%5$s">',
                    isset($args['type']) ? $args['type'] : 'text',
                    $name,
                    $id,
                    $current_value,
                    'float: left; margin-right: 6px; max-width: 12.5rem;'
                );
            },
            10,
            1
        );
    }

    private static function prepare_filter_query(array $args)
    {
        add_action(
            'pre_get_posts',
            function (\WP_Query $query) use ($args) {
                $type = $query->get('post_type');

                if ($type !== $args['post_type']) {
                    return;
                }

                if (!$query->is_admin || !$query->is_archive) {
                    return;
                }

                $name = $args['name'];
                if (isset($_GET[$name]) && !empty($_GET[$name])) {
                    $value = $_GET[$name];
                    call_user_func($args['sort'], $query, $value);
                }
            },
            10,
            1
        );
    }
}
