<?php

namespace StyrsoMissionskyrka;

use Stripe\StripeClient;
use StyrsoMissionskyrka\Utils\HooksManager;

require_once __DIR__ . '/inc/polyfills.php';
require_once __DIR__ . '/vendor/autoload.php';

AssetLoader::prepare();

$validation_has_defined_client_url = defined('SMK_CLIENT_BASE_URL');
Helpers::admin_notice(
    !$validation_has_defined_client_url,
    'The constant <code>SMK_CLIENT_BASE_URL</code> must be defined.',
    'Without it the app will not work as expected.'
);

$validation_has_defined_stripe = defined('STRIPE_SECRET_KEY');
Helpers::admin_notice(
    !$validation_has_defined_stripe,
    'The constant <code>STRIPE_SECRET_KEY</code> must be defined.',
    'Without it the app will not work as expected.'
);

$is_valid = array_every([$validation_has_defined_client_url, $validation_has_defined_stripe], function ($item) {
    return $item == true;
});

$stripe = new StripeClient(\STRIPE_SECRET_KEY);

if ($is_valid) {
    $manager = new HooksManager();
    $manager->register(new Core());
    $manager->register(new ApiBlocks());

    $manager->register(new Retreats\Admin());
    $manager->register(new Retreats\Api($stripe));
    $manager->register(new Retreats\PostType());

    $manager->register(new Bookings\Admin());
    $manager->register(new Bookings\Edit($stripe));
    $manager->register(new Bookings\PostType());
}
