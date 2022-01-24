<?php

namespace StyrsoMissionskyrka;

use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use pQuery;

/**
 * This is more or less the logic from [wp-rest-blocks](https://github.com/spacedmonkey/wp-rest-blocks).
 * With the added revisions.
 */
class ApiBlocks implements ActionHookSubscriber
{
    public function get_actions(): array
    {
        return [
            'rest_api_init' => ['register_block_fields'],
            'rest_prepare_revision' => ['rest_prepare_revision', 10, 2],
        ];
    }

    public function register_block_fields()
    {
        $types = $this->get_post_types_with_editor();
        if (!$types) {
            return;
        }

        register_rest_field($types, 'smk_has_blocks', [
            'get_callback' => [$this, 'has_blocks_get_callback'],
            'update_callback' => null,
            'schema' => [
                'description' => __('Has blocks.', 'smk'),
                'type' => 'boolean',
                'context' => ['embed', 'view', 'edit'],
                'readonly' => true,
            ],
        ]);

        register_rest_field($types, 'smk_blocks', [
            'get_callback' => [$this, 'blocks_get_callback'],
            'update_callback' => null,
            'schema' => [
                'description' => __('Blocks.', 'smk'),
                'type' => 'object',
                'context' => ['embed', 'view', 'edit'],
                'readonly' => true,
            ],
        ]);
    }

    public function rest_prepare_revision(\WP_REST_Response $response, \WP_Post $post)
    {
        $has_blocks = \has_blocks($post);
        $blocks = [];
        if ($has_blocks) {
            $blocks = $this->get_blocks($post->post_content, $post->ID);
        }

        $response->set_data(
            array_merge($response->get_data(), [
                'smk_has_blocks' => $has_blocks,
                'smk_blocks' => $blocks,
            ])
        );

        return $response;
    }

    public function has_blocks_get_callback(array $object): bool
    {
        if (isset($object['content']['raw'])) {
            return has_blocks($object['content']['raw']);
        }
        $id = !empty($object['wp_id']) ? $object['wp_id'] : $object['id'];
        $post = get_post($id);
        if (!$post) {
            return false;
        }

        return has_blocks($post);
    }

    public function blocks_get_callback(array $object): array
    {
        $id = !empty($object['wp_id']) ? $object['wp_id'] : $object['id'];
        if (isset($object['content']['raw'])) {
            return $this->get_blocks($object['content']['raw'], $id);
        }
        $id = !empty($object['wp_id']) ? $object['wp_id'] : $object['id'];
        $post = get_post($id);
        $output = [];
        if (!$post) {
            return $output;
        }

        return $this->get_blocks($post->post_content, $post->ID);
    }

    protected function get_blocks(string $content, $post_id = 0): array
    {
        $output = [];
        $blocks = parse_blocks($content);

        foreach ($blocks as $block) {
            $block_data = $this->do_block($block, $post_id);
            if ($block_data) {
                $output[] = $block_data;
            }
        }

        return $output;
    }

    protected function do_block(array $block, $post_id = 0)
    {
        if (!$block['blockName']) {
            return false;
        }

        $block_object = new \WP_Block($block);
        $attr = $block['attrs'];
        if ($block_object && $block_object->block_type) {
            $attributes = $block_object->block_type->attributes;
            $supports = $block_object->block_type->supports;
            if ($supports && isset($supports['anchor']) && $supports['anchor']) {
                $attributes['anchor'] = [
                    'type' => 'string',
                    'source' => 'attribute',
                    'attribute' => 'id',
                    'selector' => '*',
                    'default' => '',
                ];
            }

            if ($attributes) {
                foreach ($attributes as $key => $attribute) {
                    if (!isset($attr[$key])) {
                        $attr[$key] = $this->get_attribute($attribute, $block_object->inner_html, $post_id);
                    }
                }
            }
        }

        $block['rendered'] = $block_object->render();
        $block['rendered'] = do_shortcode($block['rendered']);
        $block['attrs'] = $attr;
        if (!empty($block['innerBlocks'])) {
            $inner_blocks = $block['innerBlocks'];
            $block['innerBlocks'] = [];
            foreach ($inner_blocks as $_block) {
                $block['innerBlocks'][] = $this->do_block($_block, $post_id);
            }
        }

        return $block;
    }

    protected function get_post_types_with_editor()
    {
        $post_types = get_post_types(['show_in_rest' => true], 'names');
        $post_types = array_values($post_types);

        if (!function_exists('use_block_editor_for_post_type')) {
            require_once ABSPATH . 'wp-admin/includes/post.php';
        }
        $post_types = array_filter($post_types, 'use_block_editor_for_post_type');
        $post_types[] = 'wp_navigation';
        $post_types[] = 'revision';
        $post_types = array_filter($post_types, 'post_type_exists');

        return $post_types;
    }

    protected function get_attribute($attribute, $html, $post_id = 0)
    {
        $value = null;
        if (isset($attribute['source'])) {
            if (isset($attribute['selector'])) {
                $dom = pQuery::parseStr(trim($html));
                if ('attribute' === $attribute['source']) {
                    $value = $dom->query($attribute['selector'])->attr($attribute['attribute']);
                } elseif ('html' === $attribute['source']) {
                    $value = $dom->query($attribute['selector'])->html();
                } elseif ('text' === $attribute['source']) {
                    $value = $dom->query($attribute['selector'])->text();
                } elseif ('query' === $attribute['source'] && isset($attribute['query'])) {
                    $nodes = $dom->query($attribute['selector'])->getIterator();
                    $counter = 0;
                    foreach ($nodes as $node) {
                        foreach ($attribute['query'] as $key => $current_attribute) {
                            $current_value = $this->get_attribute($current_attribute, $node->toString(), $post_id);
                            if (null !== $current_value) {
                                $value[$counter][$key] = $current_value;
                            }
                        }
                        $counter++;
                    }
                }
            } else {
                $dom = pQuery::parseStr(trim($html));
                $node = $dom->query();
                if ('attribute' === $attribute['source']) {
                    $current_value = $node->attr($attribute['attribute']);
                    if (null !== $current_value) {
                        $value = $current_value;
                    }
                } elseif ('html' === $attribute['source']) {
                    $value = $node->html();
                } elseif ('text' === $attribute['source']) {
                    $value = $node->text();
                }
            }

            if ($post_id && 'meta' === $attribute['source'] && isset($attribute['meta'])) {
                $value = get_post_meta($post_id, $attribute['meta'], true);
            }
        }

        if (is_null($value) && isset($attribute['default'])) {
            $value = $attribute['default'];
        }

        if (isset($attribute['type']) && rest_validate_value_from_schema($value, $attribute)) {
            $value = rest_sanitize_value_from_schema($value, $attribute);
        }

        return $value;
    }
}
