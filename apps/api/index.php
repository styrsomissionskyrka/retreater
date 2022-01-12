<?php
// if (wp_redirect(admin_url(''))) {
//     exit();
// }
?>

<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Styrsö Missionskyrka</title>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>
  <div><?php echo get_rest_url(); ?></div>

  <pre><?php var_dump(get_theme_support('editor-color-palette')); ?></pre>
  <?php wp_footer(); ?>
</body>
</html>