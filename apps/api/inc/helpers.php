<?php

namespace StyrsoMissionskyrka;

class Helpers
{
    public static function admin_notice(bool $check, string $title, string $message): bool
    {
        if ($check) {
            \add_action('admin_notices', function () use ($title, $message) {
                echo '<div class="notice notice-error">';
                echo '<p><strong>' . $title . '</strong></p>';
                echo '<p>' . wp_kses($message, ['code' => []]) . '</p>';
                echo '</div>';
            });
        }

        return $check;
    }
}
