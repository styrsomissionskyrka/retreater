<?php

namespace StyrsoMissionskyrka;

use StyrsoMissionskyrka\Utils\ActionHookSubscriber;
use StyrsoMissionskyrka\Utils\FilterHookSubscriber;

class Core implements ActionHookSubscriber, FilterHookSubscriber
{
    public function get_actions(): array
    {
        return [
            'init' => ['load_theme_textdomain'],
        ];
    }

    public function get_filters(): array
    {
        return [
            'preview_post_link' => ['preview_post_link'],
        ];
    }

    public function load_theme_textdomain()
    {
        \load_theme_textdomain('smk', \get_template_directory() . '/languages');
    }

    public function preview_post_link(string $preview_link)
    {
        $post = \get_post();
        if (!$post) {
            return $preview_link;
        }

        $id = $post->ID;
        $type = \get_post_type($id);
        $slug = \get_permalink($post);
        $parent_id = $post->post_parent;
        $parent_type = \get_post_type($parent_id);
        $parent_slug = \get_permalink($parent_id);

        return \add_query_arg(
            [
                'id' => $id,
                'type' => $type,
                'slug' => $slug,
                'parent_id' => $parent_id,
                'parent_type' => $parent_type,
                'parent_slug' => $parent_slug,
            ],
            \SMK_CLIENT_BASE_URL . '/api/preview'
        );
    }
}
