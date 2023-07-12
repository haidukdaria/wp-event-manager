<?php 
/* Template Name: Admin */

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
?>

<?php 
$current_user = wp_get_current_user();
$roles = ( array ) $current_user->roles;

if ( is_user_logged_in() && in_array( 'administrator', $roles ) ) : ?>

  <main id="primary" class="site-main">
    <div class="container">
      <section class="event-manager">
        <div class="event-manager__left">
          <div class="event-manager__title-wrapper">
            <h2><?php _e("Events", 'event-manager'); ?></h2>
            <!-- <button class="events-list__btn events-list__btn--add" id="add-event"><?php //_e('Add event'); ?></button> -->
          </div>

          <div class="events-list">
            <div class="event-list__head">
              <div class="events-list__row events-list__row--head">
                <div class="events-list__row-cell events-list__row-cell--name"><h3><?php _e('Name'); ?></h3></div>
                <div class="events-list__row-cell events-list__row-cell--price"><h3><?php _e('Price'); ?></h3></div>
                <div class="events-list__row-cell events-list__row-cell--operations"><h3><?php _e('Operations'); ?></h3></div>
              </div>
            </div>

            <ul id="event-list-body" class="events-list__body">
              <?php
                if ( $events ) {
                  foreach ( $events as $post ) {
                    setup_postdata( $post ); ?>
                      <li class="events-list__row" data-event-id="<?php echo $post->ID; ?>">
                        <div class="events-list__row-cell events-list__row-cell--name"><?php the_title(); ?></div>
                        <div class="events-list__row-cell events-list__row-cell--price"><?php echo get_post_meta($post->ID, 'event_price', true); ?>$</div>
                        <div class="events-list__row-cell events-list__row-cell--operations">
                          <button class="events-list__btn events-list__btn--edit"><?php _e('Edit'); ?></button>
                          /
                          <button class="events-list__btn events-list__btn--delete"><?php _e('Delete');?></button>
                        </div>
                      </li>

                    <?php
                    wp_reset_postdata();
                  }
                } else {
                  echo __('No events yet');
                }
              ?>
            </ul>
          </div>
        </div>

        <div class="event-manager__right">
          <div class="event-manager__add-form visible">
            <h2><?php _e("Add event", 'event-manager'); ?></h2>
            <form id="admin-add-form" class="event-manager__form events-admin-form">

              <div class="events-admin-form__column events-admin-form__column--40">
                <div class="events-admin-form__control">
                  <input type="text"  id="event-name" name="event-name" required placeholder="Event name" >
                </div>
                <div class="events-admin-form__control">
                  <input type="number"  id="event-price" name="event-price" required placeholder="Price">
                </div>
 
                <div class="events-admin-form__control file">
                  <label for="event-image"><?php _e('Upload image: ', 'event-manager'); ?></label>
                  <input type="file"  id="event-image" name="event-image" required  accept="image/png, image/jpeg, image/webp">
                </div>
              </div>

              <div class="events-admin-form__column events-admin-form__column--60">
                <div class="events-admin-form__control">
                  <textarea id="event-description" required name="event-description" rows="10" placeholder="Description"></textarea>
                </div>

                <div class="events-admin-form__control submit">
                  <input type="submit" value="Add" name="submit">
                </div>
              </div>

            </form>
          </div>

          <div class="event-manager__edit-form">
            <h2><?php _e("Edit event", 'event-manager'); ?></h2>
            <form class="event-manager__form events-admin-form" method="POST">

              <div class="events-admin-form__column events-admin-form__column--40">
                <div class="events-admin-form__control">
                  <input type="text" placeholder="Product name">
                </div>
                <div class="events-admin-form__control">
                  <input type="number" placeholder="Price">
                </div>

                <div class="events-admin-form__control file">
                  <label for="event-image"><?php _e('Upload image: ', 'event-manager'); ?></label>
                  <input type="file" id="event-image" name="event-image" accept="image/png, image/jpeg, image/webp">
                </div>
              </div>

              <div class="events-admin-form__column events-admin-form__column--60">
                <div class="events-admin-form__control">
                  <textarea id="event-image" name="story" rows="10" placeholder="Description"></textarea>
                </div>

                <div class="events-admin-form__control submit">
                  <input type="submit" value="Update">
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  </main>
<?php else : ?>
  <?php _e('Page not found'); ?>
<?php endif; ?>

<?php
get_footer();