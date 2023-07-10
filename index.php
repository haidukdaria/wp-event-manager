<?php 
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

	</main><!-- #main -->

<?php
get_footer();