<?php
/**
 * Blog posts file.
 *
 * @package A8C\FSE
 */

namespace A8C\FSE;

define( 'NEWSPACK_BLOCKS__BLOCKS_DIRECTORY', 'dist/' );
define( 'NEWSPACK_BLOCKS__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

// Autogenerated by apps/editing-toolkit/bin/sync-newspack-blocks.sh.
define( 'NEWSPACK_BLOCKS__VERSION', 'v1.75.0-alpha.3' );
// End autogenerated area.

/**
 * Filters block name.
 *
 * @param string $name Block name.
 * @return string
 */
function blog_posts_block_name( $name ) {
	if ( 'newspack-blocks/homepage-articles' === $name ) {
		return 'a8c/blog-posts';
	}

	if ( 'newspack-blocks/carousel' === $name ) {
		return 'a8c/posts-carousel';
	}

	return $name;
}
add_filter( 'newspack_blocks_block_name', __NAMESPACE__ . '\blog_posts_block_name' );

/**
 * Filters block arguments for `register_block_type()`.
 *
 * @param array  $args Arguments to `register_block_type()`.
 * @param string $name Block name.
 * @return array
 */
function newspack_blocks_block_args( $args, $name ) {
	if ( 'homepage-articles' !== $name && 'carousel' !== $name ) {
		return $args;
	}

	$block_prefix = 'homepage-articles' === $name
		? 'blog-posts-block-'
		: 'carousel-block-';

	// Editor script.
	$script_data = require NEWSPACK_BLOCKS__BLOCKS_DIRECTORY . $block_prefix . 'editor.asset.php';
	wp_register_script(
		$block_prefix . 'editor',
		plugins_url( NEWSPACK_BLOCKS__BLOCKS_DIRECTORY . $block_prefix . 'editor.min.js', __FILE__ ),
		$script_data['dependencies'],
		$script_data['version'],
		true
	);

	if ( 'homepage-articles' === $name ) {
		wp_localize_script(
			'blog-posts-block-editor',
			'newspack_blocks_data',
			array(
				'posts_rest_url'          => rest_url( 'newspack-blocks/v1/newspack-blocks-posts' ),
				'specific_posts_rest_url' => rest_url( 'newspack-blocks/v1/newspack-blocks-specific-posts' ),
				// Define URL to core one to make autocomplete working for newspack-blocks installed via ETK.
				'authors_rest_url'        => rest_url() . 'wp/v2/users',
			)
		);
	}

	// Editor style.
	$editor_style = plugins_url( NEWSPACK_BLOCKS__BLOCKS_DIRECTORY . $block_prefix . 'editor.css', __FILE__ );
	wp_register_style( $block_prefix . 'editor', $editor_style, array(), NEWSPACK_BLOCKS__VERSION );

	// View script.
	$script_data = require NEWSPACK_BLOCKS__BLOCKS_DIRECTORY . $block_prefix . 'view.asset.php';
	wp_register_script(
		$block_prefix . 'view',
		plugins_url( NEWSPACK_BLOCKS__BLOCKS_DIRECTORY . $block_prefix . 'view.min.js', __FILE__ ),
		$script_data['dependencies'],
		$script_data['version'],
		true
	);

	// View style.
	$editor_style = plugins_url( NEWSPACK_BLOCKS__BLOCKS_DIRECTORY . $block_prefix . 'view.css', __FILE__ );
	wp_register_style( $block_prefix . 'view', $editor_style, array(), NEWSPACK_BLOCKS__VERSION );

	$args['editor_script'] = $block_prefix . 'editor';
	$args['editor_style']  = $block_prefix . 'editor';

	// This fires from newspack-blocks at render time.
	add_action(
		'newspack_blocks_render_post_carousel',
		function () {
			wp_enqueue_style( 'carousel-block-view' );
			wp_enqueue_script( 'carousel-block-view' );
		}
	);

	// This fires from newspack-blocks at render time.
	add_action(
		'newspack_blocks_render_homepage_articles',
		function () {
			wp_enqueue_style( 'blog-posts-block-view' );
			wp_enqueue_script( 'blog-posts-block-view' );
		}
	);

	wp_set_script_translations( $block_prefix . 'editor', 'full-site-editing' );

	return $args;
}
add_filter( 'newspack_blocks_block_args', __NAMESPACE__ . '\newspack_blocks_block_args', 10, 2 );

/**
 * Filters plugins_url so we can rewrite the path to the AMP JS.
 *
 * @param string $url  The complete URL to the plugins directory including scheme and path.
 * @param string $path Path relative to the URL to the plugins directory. Blank string if no path is specified.
 *
 * @return string The filtered URL.
 */
function newspack_blocks_amp_js_path( $url, $path ) {
	if ( '/newspack-blocks/amp/homepage-articles/view.js' === $path ) {
		return plugins_url( 'synced-newspack-blocks/amp/homepage-articles/view.js', __FILE__ );
	}

	return $url;
}
add_filter( 'plugins_url', __NAMESPACE__ . '\newspack_blocks_amp_js_path', 10, 2 );

require_once __DIR__ . '/synced-newspack-blocks/class-newspack-blocks.php';
require_once __DIR__ . '/synced-newspack-blocks/class-newspack-blocks-api.php';

require_once __DIR__ . '/synced-newspack-blocks/blocks/homepage-articles/view.php';

/**
 * Can be used to disable the Post Carousel Block.
 *
 * @since 1.2
 *
 * @param bool true if Post Carousel Block should be disabled, false otherwise.
 */
if ( ! apply_filters( 'a8c_disable_posts_carousel_block', false ) && ! apply_filters( 'a8c_disable_post_carousel_block', false ) ) {
	require_once __DIR__ . '/synced-newspack-blocks/blocks/carousel/view.php';
}

// REST Controller for Articles Block.
require_once NEWSPACK_BLOCKS__PLUGIN_DIR . 'synced-newspack-blocks/blocks/homepage-articles/class-wp-rest-newspack-articles-controller.php';

/**
 * Registers Articles block routes.
 */
function register_rest_routes() {
	$articles_controller = new \WP_REST_Newspack_Articles_Controller();
	$articles_controller->register_routes();
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_rest_routes' );
