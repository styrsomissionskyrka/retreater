<?php

namespace StyrsoMissionskyrka\Helpers;

function admin_notice(bool $check, string $title, string $message)
{
    if ($check) {
        \add_action('admin_notices', function () use ($title, $message) {
            echo '<div class="notice notice-error">';
            echo '<p><strong>' . $title . '</strong></p>';
            echo '<p>' . wp_kses($message, ['code' => []]) . '</p>';
            echo '</div>';
        });
    }
}
