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

$first_post = $events[0];

wp_reset_postdata();
?>

<main id="primary" class="site-main">
  <div class="container">
    <section class="event-manager">
      <div class="event-manager__left">
        <div class="events-list">
          <h2 class="events-list__title"><?php _e("Events", 'event-manager'); ?></h2>

          <div class="event-list__head">
            <div class="events-list__row events-list__row--head">
              <div class="events-list__row-cell events-list__row-cell--name"><h3><?php _e('Name'); ?></h3></div>
              <div class="events-list__row-cell events-list__row-cell--price"><h3><?php _e('Price'); ?></h3></div>
              <div class="events-list__row-cell events-list__row-cell--operations"><h3><?php _e('Operations'); ?></h3></div>
            </div>
          </div>

          <ul class="events-list__body">
            <?php 
              if ( $events ) {
                foreach ( $events as $post ) {
                  setup_postdata( $post ); ?>
                    <li class="events-list__row" data-event-id="<?php echo $post->ID; ?>">
                      <div class="events-list__row-cell events-list__row-cell--name"><?php the_title(); ?></div>
                      <div class="events-list__row-cell events-list__row-cell--price"><?php echo get_post_meta($post->ID, 'event_price', true); ?>$</div>
                      <div class="events-list__row-cell events-list__row-cell--operations">
                        <button class="events-list__btn"><?php _e('Read more'); ?></button>
                      </div>
                    </li><?php
                  wp_reset_postdata();
                }
              } else {
                echo 'No events yet';
              }            
            ?>
          </ul>
        </div>
      </div>
      
      <div class="event-manager__right">
        <article class="event-manager__event-description event-description">
          <div class="event-description__container">
            <div class="event-description__image">
              <?php
              $post = $first_post;
              setup_postdata( $post );
              the_post_thumbnail('thumbnail'); ?>
            </div>
            <h2>
              <?php the_title(); ?>
            </h2>
            <p><b><?php echo __('Price: '); ?></b><?php echo get_post_meta($post->ID, 'event_price', true); ?>$</p>
            <?php the_content(); ?>

            <?php wp_reset_postdata(); ?>
          </div>
        </article>
      </div>
    </section>
  </div>
</main>

<?php
get_footer();