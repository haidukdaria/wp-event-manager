<?php 
/* Template Name: Client */

get_header();
?>

<?php 
 $args = array(
  'post_type' => 'event',
  'posts_per_page' => -1,
  'orderby' => 'date',   
  'order' => 'DESC', 
);

$query = new WP_Query($args);
$events = $query->posts;

wp_reset_postdata();
?>

<main id="primary" class="site-main">
  <div class="container">
    <section class="event-manager">
      <div class="event-manager__left">
        <h1><?php _e("Events", 'event-manager'); ?></h1>
        
        <div class="events-list">
          <div class="event-list__head">
            <div class="events-list__row events-list__row--head">
            <div class="events-list__row-cell events-list__row-cell--name"><?php _e('Name'); ?></div>
              <div class="events-list__row-cell events-list__row-cell--price"><?php _e('Price'); ?></div>
              <div class="events-list__row-cell events-list__row-cell--operations"><?php _e('Operations'); ?></div>
            </div>
          </div>
          <div class="events-list__body">
            <?php 
              if ( $events ) {
                foreach ( $events as $post ) {
                  setup_postdata( $post ); ?>
                    <div class="events-list__row" data-event="<?php echo $post->ID; ?>">
                      <div class="events-list__row-cell events-list__row-cell--name"><?php the_title(); ?></div>
                      <div class="events-list__row-cell events-list__row-cell--price"><?php echo get_post_meta($post->ID, 'event_price', true); ?>$</div>
                      <div class="events-list__row-cell events-list__row-cell--operations">
                        <button class="events-list__btn"><?php _e('Read more'); ?></button>
                      </div>
                    </div><?php
                  wp_reset_postdata();
                }
              } else {
                echo 'No events yet';
              }            
            ?>
          </div>
        </div>

      </div>
      <div class="event-manager__right">

      </div>
    </section>
  </div>
</main>

<?php
get_footer();