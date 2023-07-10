<?php
/**
 * event-manager functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package event-manager
 */

function event_manager_setup() {
	add_theme_support( 'post-thumbnails' );

	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'event-manager' ),
		)
	);
}
add_action( 'after_setup_theme', 'event_manager_setup' );