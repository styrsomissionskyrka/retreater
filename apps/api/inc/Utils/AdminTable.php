<?php

namespace StyrsoMissionskyrka\Utils;

class AdminTable
{
    /**
     * Add a new column to a post types admin archive page.
     *
     * @param array $args {
     *   Parameters to use to setup the new column.
     *
     *   @type string   $post_type Post type archive.
     *   @type int      $index     Index to place the column in.
     *   @type string   $name      Name (id) of column.
     *   @type string   $label     Optional. Label (title) of column.
     *   @type callable $render    Callback to render the column. Receives current int $post_id as argument.
     *   @type callable $sort      Optional. Callback to modify the current query if currently sorted upon.
     * }
     * @return void
     */
    public static function add_column(array $args): void
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
                        $order_by = $query->get('orderby');
                        if ($order_by === $args['name']) {
                            call_user_func($args['sort'], $query);
                        }
                    }
                },
                10,
                1
            );
        }
    }

    /**
     * Edit an existing column. You can update the title and/or make it sortable/non-sortable.
     *
     * @param array $args {
     *   Parameters to edit the column.
     *
     *   @type string $post_type Post type in which to edit the column.
     *   @type string $label     Optional. New title label to use for column.
     *   @type bool   $sortable  Optional. Boolean to change if column is sortable or not.
     * }
     * @return void
     */
    public static function edit_column(array $args): void
    {
        $post_type = $args['post_type'];

        if (isset($args['name'])) {
            add_filter(
                "manage_${post_type}_posts_columns",
                function (array $columns) use ($args) {
                    foreach ($columns as $key => $_) {
                        if ($key === $args['name']) {
                            $columns[$key] = $args['label'];
                        }
                    }
                    return $columns;
                },
                10,
                1
            );
        }

        if (isset($args['sortable'])) {
            add_filter(
                "manage_edit-${post_type}_sortable_columns",
                function (array $columns) use ($args) {
                    $new_columns = [];
                    foreach ($columns as $key => $value) {
                        if ($key !== $args['name']) {
                            $new_columns[$key] = $value;
                        }

                        if ($args['sortable']) {
                            $new_columns[$args['name']] = $args['name'];
                        }
                    }

                    return $new_columns;
                },
                10,
                1
            );
        }
    }

    /**
     * Remove a column from a post type's admin archive page.
     *
     * @param array $args {
     *   Argument to indicate which column and post type to edit.
     *
     *   @type string $post_type Post type from which to remove the column.
     *   @type string $name      Name of column to remove.
     * }
     * @return void
     */
    public static function remove_column(array $args): void
    {
        $post_type = $args['post_type'];
        add_filter(
            "manage_${post_type}_posts_columns",
            function (array $columns) use ($args) {
                $new_columns = [];
                foreach ($columns as $key => $value) {
                    if ($key !== $args['name']) {
                        $new_columns[$key] = $value;
                    }
                }
                return $new_columns;
            },
            10,
            1
        );

        add_filter(
            "manage_edit-${post_type}_sortable_columns",
            function (array $columns) use ($args) {
                $new_columns = [];
                foreach ($columns as $key => $value) {
                    if ($key !== $args['name']) {
                        $new_columns[$key] = $value;
                    }
                }

                return $new_columns;
            },
            10,
            1
        );
    }

    /**
     * Add a new select filter to a post types admin archive page.
     *
     * @param array $args {
     *   Configuration for the new select filter.
     *
     *   @type string   $post_type    Post type to which to add the new filter.
     *   @type string   $name         Name (id) of the new filter.
     *   @type string   $label        Singular label of the entity.
     *   @type string   $label_plural Plural label of entity.
     *   @type callable $options      Callback that gives back all available options. Should return an array with
     *                                [$value => $label]. These will be transformed into <option value="">label</option>.
     *   @type callable $sort         Optional. Callback used to modify the query to enable filtering. Receives the
     *                                current WP_Query and the $value (string) as parameters.
     * }
     * @return void
     */
    public static function add_select_filter(array $args): void
    {
        if (isset($args['sort'])) {
            self::prepare_filter_query($args);
        }

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

    /**
     * Add a new input filter to a post types admin archive page.
     *
     * @param array $args {
     *   Configuration for the new input filter.
     *
     *   @type string   $post_type    Post type to which to add the new filter.
     *   @type string   $name         Name (id) of the new filter.
     *   @type string   $label        Singular label of the entity.
     *   @type callable $sort         Optional. Callback used to modify the query to enable filtering. Receives the
     *                                current WP_Query and the $value (string) as parameters.
     * }
     * @return void
     */
    public static function add_input_filter(array $args)
    {
        if (isset($args['sort'])) {
            self::prepare_filter_query($args);
        }

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
