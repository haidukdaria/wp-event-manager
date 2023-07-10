<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package event-manager
 */
?>

<footer class="site-footer">
  <span><?php _e('Event Manager', 'event-manager'); ?></span>,
  <?php echo date("Y"); ?>
</footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
