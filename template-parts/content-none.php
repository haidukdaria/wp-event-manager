<section class="no-results not-found container">
	<header class="page-header">
		<h1 class="page-title"><?php esc_html_e( 'Nothing Found', 'event-manager' ); ?></h1>
	</header>

	<div class="page-content">
		<?php if ( is_search() ) : ?>

			<p><?php esc_html_e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'event-manager' ); ?></p>
			<?php get_search_form(); ?>

		<?php else : ?>

			<p><?php esc_html_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'event-manager' ); ?></p>
			<?php get_search_form(); ?>

		<?php endif;?>
	</div>
</section>
