<?php
/**
 * event-manager functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package event-manager
 */

//Setup
function event_manager_setup() {
	add_theme_support( 'post-thumbnails' );

	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'event-manager' ),
		)
	);
}
add_action( 'after_setup_theme', 'event_manager_setup' );

//Enqueue scripts & styles
if ( ! function_exists( 'event_manager_scripts' ) ) {
	function event_manager_scripts() {

		// Enqueue the main stylesheet.
		wp_enqueue_style( 'main-stylesheet', get_template_directory_uri() .'/assets/css/main.css', false, '1.1.1', 'all' );

		// Enqueue the events-admin JS file
		wp_enqueue_script( 'admin-javascript', get_template_directory_uri().'/assets/js/events-admin.js', [], '1.1.1', true );

		// Throw variables from back to front
		$restApiSettings = array(
			'root' => esc_url_raw( rest_url() ),
      'nonce'=> wp_create_nonce( 'wp_rest' ),
		);

		wp_localize_script( 'admin-javascript', 'restApiSettings', $restApiSettings );
	}
	add_action( 'wp_enqueue_scripts', 'event_manager_scripts' );
}


//Create custom post type 
function create_event_post_type() {
  $labels = array(
    'name' => 'Events',
    'singular_name' => 'Event',
  );

  $args = array(
    'labels' => $labels,
    'public' => true,
    'has_archive' => true,
    'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-calendar',
  );

  register_post_type('event', $args);
}
add_action('init', 'create_event_post_type');

// Add custom metabox to post type Event, 1/3
function event_price_meta_box() {
  add_meta_box(
    'event_price',
    'Price',
    'event_price_meta_box_callback',
    'event',
    'normal',
    'default'
  );
}
add_action('add_meta_boxes', 'event_price_meta_box');

// Show metabox, 2/3
function event_price_meta_box_callback($post) {
  $price = get_post_meta($post->ID, 'event_price', true); ?> 
  <span>$</span>
  <input type="number" name="event_price" value="<?php echo esc_attr($price); ?>"><?php
}

// Save metabox, 3/3
function save_event_price_meta($post_id) {
  if (array_key_exists('event_price', $_POST)) {
    update_post_meta(
      $post_id,
      'event_price',
      sanitize_text_field($_POST['event_price'])
    );
  }
}
add_action('save_post_event', 'save_event_price_meta');

// Register metabox 'price' for REST API
$object_type = 'post';
$meta_args = array( 
  'type'         => 'number',
  'description'  => 'Event price meta key',
  'single'       => true,
  'show_in_rest' => true,
  'object_subtype' => 'event',
);
register_meta( $object_type, 'event_price', $meta_args );

// Hide menu items for logged-out users
function hide_menu_items_based_on_role( $items, $menu, $args ) {
  $current_user = wp_get_current_user();
  $role = ( array ) $current_user->roles;
 
  if ( !is_user_logged_in() || !in_array( 'administrator', $role )) {
    foreach ( $items as $key => $item ) {
      if ( in_array( 'logged-in',  $item->classes ) ) {
        unset( $items[$key] );
      }
    }
  }
  return $items;
}
add_filter( 'wp_get_nav_menu_items', 'hide_menu_items_based_on_role', 10, 3 );
