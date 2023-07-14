<?php
/**
 * The default template for all pages
 *
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package event-manager
 */

get_header();
?>

<main id="primary" class="site-main">
  <?php 
  if ( have_posts() ) : ?>
    <?php 
    while ( have_posts() ) : the_post(); 
      get_template_part( 'template-parts/content', 'page' );
    endwhile; 
  else :
    get_template_part( 'template-parts/content', 'none' );
  endif;
  ?>

</main>

<?php
get_footer();