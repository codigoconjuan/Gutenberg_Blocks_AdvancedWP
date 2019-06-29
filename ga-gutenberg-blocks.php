<?php
/*
 Plugin Name: Gourmet Artist Gutenberg Blocks
 Plugin URI: 
 Description: Adds Gutenberg Blocks
 Version: 1.0
 Author: Juan Pablo De la torre
 Author URI: https://www.twitter.com/JuanDevWP
 License: GPL2
 License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

 // Prevent the execution
 if(!defined('ABSPATH')) exit;

 /** Register The Gutenberg blocks and CSS */

 add_action('init', 'ga_register_gutenberg_blocks');

 function ga_register_gutenberg_blocks() {
    // Check if gutenberg is installed

    if( !function_exists('register_block_type')) {
        return;
    }

    // Register the Block editor script
    wp_register_script(
        'ga-editor-script', 
        plugins_url( 'build/index.js', __FILE__ ), // url to file
        array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'), // dependencies
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js') // version
    ); 

    // Gutenberg Editor CSS (Backend)
    wp_register_style(
        'ga-editor-style', // name
        plugins_url( 'build/editor.css', __FILE__ ), // file
        array(), // dependencies
        filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css') // version
    );

    // Front end Stylesheet
    wp_register_style(
        'ga-front-end-styles', // name
        plugins_url( 'build/style.css', __FILE__ ), // file
        array(), // dependencies
        filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css') // version
    );

    // An Array of Blocks
    $blocks = array(
        'ga/testimonial',
        'ga/hero', 
        'ga/imagetext'
    );

    // Add the blocks and register the Stylesheets
    foreach($blocks as $block) {
        register_block_type( $block, array(
            'editor_script' => 'ga-editor-script',
            'editor_style' => 'ga-editor-style', // backend CSS
            'style' => 'ga-front-end-styles', // front end css
        ));
    }


    // Enqueue the Dynamic Block (latest recipes)

    register_block_type('ga/latest', array(
        'editor_script' => 'ga-editor-script',
        'editor_style' => 'ga-editor-style',
        'style' =>  'ga-front-end-styles', 
        'render_callback' => 'ga_latest_recipes_block'
    ));
 }

 /** Custom Categories */
 add_filter('block_categories', 'ga_new_gutenberg_category', 10, 2);
 function ga_new_gutenberg_category( $categories, $post ) {
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'gourmet-artist', 
                'title' => 'Gourmet Artist', 
                'icon' => 'awards'
            ),
        )
    );
 }

 /** Callback that displays the 3 latest recipes */
 function ga_latest_recipes_block() {
     
    global $post;

    // Build a Query
    $recipes = wp_get_recent_posts(array(
        'post_type' => 'recipes',
        'numberposts' => 3, 
        'post_status' => 'publish'
    ));

    // Check if any post are returned
    if( count($recipes) === 0) {
        return "There're no recipes";
    }

    // Response that is going to be rendered
    $body = '';
    $body .= '<h1 class="latest-recipes-heading">Latest Recipes</h1>';
    $body .= '<ul class="latest-recipes container">';

    foreach($recipes as $recipe) {
        // Get the post object
        $post = get_post($recipe['ID']);
        setup_postdata($post);

        // Build the template
        $body .= sprintf(
            '<li>   
                %1$s
                <div class="content">
                    <h2>%2$s</h2>
                    <p>%3$s</p>
                    <a href="%4$s" class="button">Read More</a>
                </div>
            </li>', 
            get_the_post_thumbnail($post), 
            esc_html(get_the_title($post)),
            esc_html( wp_trim_words(get_the_content($post), 30 ) ),
            esc_url( get_the_permalink($post) )
        );
        wp_reset_postdata();
    } // endforeach
    $body .= '</ul>';

    return $body;
 }



 /** Adds the Featured Image URL to the WP REST API Response */

 add_action('rest_api_init', 'ga_rest_api_image');
 function ga_rest_api_image() {
     register_rest_field( 'recipes', 'recipe_image', array(
        'get_callback' => 'ga_get_featured_image', 
        'update_callback' => null,
        'schema' => null
     ) );
 }

 function ga_get_featured_image( $object, $field_name, $request) {
     if($object['featured_media']) {
        $img = wp_get_attachment_image_src( $object['featured_media'], 'medium');
        return $img[0];
     }
     return false;
 }