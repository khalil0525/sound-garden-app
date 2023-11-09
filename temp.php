<?php

/**
 * Plugin Name:       Lego Art
 * Plugin URI:        http://shapevo.io/
 * Description:       Lego Art is a product type for Image Frames
 * Version:           1.8.5
 * Author:            Sultan Gillani
 * Author URI:        http://shapevo.io/
 * Text Domain:       lego_art
*/

/*######### Required Steps #########*/

// - https://stackoverflow.com/questions/51786132/how-to-save-pdf-file-from-jspdf-on-a-server-in-javascript

/*######### End of Required Steps #########*/


$wp_path_directory = WP_PLUGIN_DIR . '/lego_art';
$wp_path_directory_app = $wp_path_directory . '/lego-art-remix-master/app/';

$plugin_dir_url = plugin_dir_url(__FILE__);
$plugin_dir_url_app = plugin_dir_url(__FILE__) . '/lego-art-remix-master/app/' ;

define('LEGO_DIRECTORY',$wp_path_directory);
define('LEGO_DIRECTORY_URL',$plugin_dir_url);
define('LEGO_DIRECTORY_APP',$wp_path_directory_app);
define('LEGO_DIRECTORY_URL_APP',$plugin_dir_url_app);



if(!class_exists('LegoArt')){
    class LegoArt{
        public function __construct() {
            //global $current_user, $wpdb, $wp,$woocommerce;
            add_shortcode( 'gb_lego_art', array($this,'gb_lego_art_ui_shortcode') );
            add_action( 'init', array($this,'gb_lego_product_type') );
            add_action('woocommerce_before_main_content', array($this,'lego_art_single_product_template') );
            //WC()->cart->add_to_cart( 130,1,245 );
            
            //add_shortcode( 'gb_lego_art_ui', array($this,'gb_ui_start_up_for_legoart') );
            
        }

        public function gb_lego_art_ui_shortcode($atts){
            global $current_user, $wpdb, $wp,$woocommerce;
            $atts = shortcode_atts( array(
                'post_slug' => '',
                'user_roles' => ''
            ), $atts, 'gb_lego_art' );
            
            //WC()->cart->add_to_cart( 130,1);
            
            ob_start();
            
            $order_id = 359;
            //$lego_product_details = gb_get_lego_product_details($order_id);
            //echo '<pre>';
                //var_dump($lego_product_details);
            //echo '</pre>';
            //Actions Before Lego Art
            //add_action( 'wp_enqueue_scripts', array($this,'gb_lego_art_enqueue') );
            
            require LEGO_DIRECTORY . '/inc/require_files/lego_art_app_head.php';
            //add_action( 'wp_head', array($this,'gb_lego_art_head') );
            
            get_product_and_plates_info();
            
            gb_ui_start_up_for_legoart();
            echo '<div style="display: none;">';
                require LEGO_DIRECTORY . '/inc/lego_art_app.php';
            echo '</div>';    
            //echo do_shortcode('[gb_lego_art_ui]');
            //$this->gb_ui_start_up_for_legoart();
            add_action( 'wp_footer', array($this,'gb_lego_art_footer') );
            
            
            //echo LEGO_DIRECTORY . '/inc/require_files/lego_art_app_head.php';
            
            $output_string = ob_get_contents();
            ob_end_clean();
            return $output_string;
        }
        
        public function gb_lego_art_enqueue(){
            
        }
        
        public function gb_lego_art_head(){
            require LEGO_DIRECTORY . '/inc/require_files/lego_art_app_head.php';
        }
        
        public function gb_lego_art_footer(){
            require LEGO_DIRECTORY . '/inc/require_files/lego_art_app_footer.php';
        }
        
        public function gb_lego_product_type(){
            global $product;
            //require LEGO_DIRECTORY . '/inc/admin/lego_product_type_new.php';
            
            require LEGO_DIRECTORY . '/inc/admin/lego_product_type.php';
        }
        
        public function add_lego_product_to_cart($product_id='', $quantity=1, $variation_id=''){
            $product_validation_arr = [];
            
            if($product_id != ''){
                //WC()->cart->empty_cart();
                if($variation_id != ''){
                    WC()->cart->add_to_cart( $product_id, $quantity, $variation_id ); 
                }else{
                    WC()->cart->add_to_cart( $product_id, $quantity);
                }
                //
            }
            
        }
        
        public function lego_art_single_product_template(){
            //https://quadlayers.com/customize-woocommerce-templates-programmatically/
            if( is_single() && get_post_type() == 'product' ){
                $product_id = get_the_ID();
                $product = wc_get_product( $product_id );
                
                if( 'legoart' == $product->get_type() ){
                    echo '<pre>';
                        var_dump($product->get_type());
                    echo '</pre>';
                }
                
                var_dump($product->get_type());
                /*$terms = get_terms([
                    'taxonomy' => 'product_type',
                    'hide_empty' => false,
                ]);
                
                echo '<pre>';
                    var_dump($terms);
                echo '</pre>';*/
                //echo $product_id;
                //require LEGO_DIRECTORY . '/templates/lego_art_app_product_page.php';
                //https://www.youtube.com/watch?v=-1bGk66dYOQ&ab_channel=VicodeMedia
            }
        }
        
        
    }
    
    new LegoArt();
}

function custom_cart_item_removed($cart_item_key, $cart) {

    $cart_item = $cart->cart_contents[$cart_item_key];

    // Check if 'lego_product_details' exists in the cart item data
    if (isset($cart_item['lego_product_details'])) {
        // Extract the 'pdf-database-id' from 'lego_product_details'
        $pdf_database_id = $cart_item['lego_product_details']['pdf_database_id'];

        // Make an API request to your Node.js server
        $api_url = 'https://brickpie.co/api/cart-item/' . $pdf_database_id;
        
        $response = wp_safe_remote_request($api_url, array(
            'method' => 'DELETE',
        ));

        if (!is_wp_error($response)) {
            // Request was successful
            $response_code = wp_remote_retrieve_response_code($response);
            error_log('API request response code: ' . $response_code);

            if ($response_code === 204) {
                // Success message received, you can implement your custom code here
                // The regular deletion process will still occur as a part of the default WooCommerce behavior
                error_log('Custom logic executed');
            } else {
                error_log('API request failed with response code: ' . $response_code);
            }
        } else {
            error_log('API request error: ' . $response->get_error_message());
        }
    }
}


add_action('woocommerce_remove_cart_item', 'custom_cart_item_removed', 10, 2);

function gb_ui_start_up_for_legoart(){
    global $current_user, $wpdb, $wp;
    
    $lego_condtion_table =  $wpdb->prefix . 'postmeta';
    $results = $wpdb->get_results( "SELECT * FROM {$lego_condtion_table} WHERE `meta_key`='is_legoart_product' AND `meta_value`='yes'", OBJECT );
    
    if( is_array($results) ){
        if(count($results) > 0){
            require_once LEGO_DIRECTORY . '/templates/lego_product_ui.php';
        }else{
            echo 'No Products Available for LegoArt.';
        }
    }else{
        echo 'No Products Available for LegoArt.';
    }
}


function save_canvas_file() {
	global $wpdb, $current_user; // this is how you get access to the database
    $uid = $current_user->ID;
    if($uid == 0 || !$uid || $uid == '' || $uid == null){
        $uid = 1;
    }
    $result = [];
	$whatever = 10;
    $result['w'] = $_POST;
    
    $dir = wp_upload_dir();
    $url = $dir['url'];
    $dir = $dir['path'];
    
    $result['d'] = $dir;
    $now = date("U");
    $imgstring = $_POST['dataURL'];
    $imgstring = base64_decode($imgstring);
    
    $success = file_put_contents("$dir/image-$now.png", $imgstring);
    
    $guid = $url . '/image-' . $now . '.png';
    $post_name = 'image-' . $now . '.png';
    
    $result['post_name'] = $post_name;
    $result['url'] = $guid;
    
    if($success) {
        // $filename should be the path to a file in the upload directory.
        $file_path = $dir . '/image-' . $now . '.png';
        
        $filename = $file_path;
        
        // The ID of the post this attachment is for.
        $parent_post_id = 0;
        
        // Check the type of tile. We'll use this as the 'post_mime_type'.
        $filetype = wp_check_filetype( basename( $filename ), null );
        
        // Get the path to the upload directory.
        $wp_upload_dir = wp_upload_dir();
        
        // Prepare an array of post data for the attachment.
        $attachment = array(
            'guid' => $wp_upload_dir['url'] . '/' . basename( $filename ),
            'post_mime_type' => $filetype['type'],
            'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
            'post_content' => '',
            'post_status' => 'inherit'
        );
        
        // Insert the attachment.
        $attach_id = wp_insert_attachment( $attachment, $filename, $parent_post_id );
        
        // Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        
        // Generate the metadata for the attachment, and update the database record.
        $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
        wp_update_attachment_metadata( $attach_id, $attach_data );

    }
    $result['success'] = 'no';
    
    if($attach_id){
        $result['attach_id'] = $attach_id;
        $result['success'] = 'yes'; 
    }
      // Insert the post into the database
      //wp_insert_post( $my_post );
      
     // get the current working directory
    /*$now = date("U");  // create a timestamp to append to the filename*/
    echo json_encode($result);

	wp_die(); // this is required to terminate immediately and return a proper response
}
add_action( 'wp_ajax_nopriv_save_canvas_file', 'save_canvas_file' );
add_action( 'wp_ajax_save_canvas_file', 'save_canvas_file' );

function save_pdf_to_server(){
// 	list_scheduled_cron_jobs_to_error_log();
    global $wpdb, $current_user;
	
    $attach_id = 0;
    
    $uid = $current_user->ID;
    if ($uid == 0 || !$uid || $uid == '' || $uid == null) {
        $uid = 1;
    }
		

// 		$step3CanvasDataUrl = $_POST['step3CanvasDataUrl'];
// 		$targetResolution = $_POST['targetResolution'];
// 		$overridePixelArray = $_POST['overridePixelArray'];
// 		$step2CanvasDataUrl = $_POST['step2CanvasDataUrl'];


	
		
// 	$nodeServerURL = 'http://brickpie.co/api/add-to-cart';
// // 	// Create the data to send as a JSON object
// 	$request_data = array(
// 		'targetResolution' => $targetResolution,
// 		'step3CanvasDataUrl' => $step3CanvasDataUrl,
// 		'step2CanvasDataUrl' => $step2CanvasDataUrl,
// 		'overridePixelArray' => $overridePixelArray,
// 	);

// 	// Set the request headers
// 	$headers = array(
// 		'Content-Type' => 'application/json',
// 	);

// 	// Make the POST request

//                 $response = wp_remote_request($nodeServerURL, array(
//                     'method' => 'POST',
//                     'headers' => $headers,
//                     'body' => json_encode($request_data), // Encode the JSON data
// 					'timeout' => 120,
               
//                 ));
// if (is_wp_error($response)) {
//     // Handle the error
//     echo 'Error: ' . $response->get_error_message();
// } else {
//     // Request was successful
//     $response_body = wp_remote_retrieve_body($response);
    
//     // Log the response body to the server's error log
//     error_log('Response Body: ' . $response_body);

//     $response_data = json_decode($response_body, true); // Parse the JSON response

//     if (isset($response_data['sessionId'])) {
//         $sessionId = $response_data['sessionId'];

//         // Log the decoded sessionId to the server's error log
//         error_log('Decoded Session ID: ' . $sessionId);
//     }
// }

//     $result = [];
//     $whatever = 10;
//     $result['w'] = $_POST;

//     $dir = wp_upload_dir();
//     $url = $dir['url'];
//     $dir = $dir['path'];

//     $result['d'] = $dir;
//     $result['d'] = $dir;
//     $now = date("U");
	
//     $imgstring = $_POST['dataURL'];
//     $imgstring = base64_decode($imgstring);
//     $success = file_put_contents("$dir/image-$now.png", $imgstring);
	
//     $guid = $url . '/image-' . $now . '.png';
//     $post_name = 'image-' . $now . '.png';
    
//     $result['post_name'] = $post_name;
//     $result['url'] = $guid;
	

//     if($success) {
//         // $filename should be the path to a file in the upload directory.
//         $file_path = $dir . '/image-' . $now . '.png';
        
//         $filename = $file_path;
        
//         // The ID of the post this attachment is for.
//         $parent_post_id = 0;
        
//         // Check the type of tile. We'll use this as the 'post_mime_type'.
//         $filetype = wp_check_filetype( basename( $filename ), null );
        
//         // Get the path to the upload directory.
//         $wp_upload_dir = wp_upload_dir();
        
//         // Prepare an array of post data for the attachment.
//         $attachment = array(
//             'guid' => $wp_upload_dir['url'] . '/' . basename( $filename ),
//             'post_mime_type' => $filetype['type'],
//             'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
//             'post_content' => '',
//             'post_status' => 'inherit'
//         );
        
//         // Insert the attachment.
//         $attach_id = wp_insert_attachment( $attachment, $filename, $parent_post_id );
        
//         // Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
//         require_once( ABSPATH . 'wp-admin/includes/image.php' );
        
//         // Generate the metadata for the attachment, and update the database record.
//         $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
//         wp_update_attachment_metadata( $attach_id, $attach_data );

//     }
    
    
    $result = [];
    $result['success'] = 'yes';
    $result['data'] = $_POST;
    // CheckOut Criteria Goes Here
    
    $lego_product_details = $_POST;
//     $lego_product_details['canvas_image_id'] = $attach_id;
    $lego_product_details['pdf_database_id'] = $_POST['sessionId'];
    $cart = WC()->cart;
    $gb_variation_id = 0;
	
    if( isset( $_POST['gb_variation_id'] ) ){
        $gb_variation_id = $_POST['gb_variation_id'];    
    }
    
    

    
    if( isset( $_POST['gb_product_id'] ) ){
        $product_id = $_POST['gb_product_id'];
        
        // Add the item to the cart
        WC()->cart->add_to_cart( $product_id ,1, $gb_variation_id,array(), array('lego_product_details' =>  $lego_product_details));
	}
    

//         $canvas_details['success'] = 'yes';

//         // CheckOut Criteria Goes Here
        
//         $canvas_details['canvas_image_id'] = $attach_id;
//         $canvas_details['pdf_database_id'] = $pdf_database_id;
    	echo json_encode($result);

    
    wp_die();
}

add_action( 'wp_ajax_nopriv_save_pdf_to_server', 'save_pdf_to_server' );
add_action( 'wp_ajax_save_pdf_to_server', 'save_pdf_to_server' );
// function retrieve_cart_item_data($user_id) {
//     global $wpdb;
    
//     $table_name = $wpdb->prefix . 'lego_cart_data';
//     $session_id = WC()->session->get_customer_unique_id();
    
//     if ($session_id) {
//         // Get the gzcompressed data from the database
//         $results = $wpdb->get_results(
//             $wpdb->prepare(
//                 "SELECT json_data FROM $table_name WHERE user_id = %d AND session_id = %s",
//                 $user_id,
//                 $session_id
//             )
//         );
        
//         if ($results) {
//             // Loop through the results (there may be multiple rows) and decode the gzcompressed data
//             foreach ($results as $result) {
//                 $gzcompressed_data = $result->json_data;
//                 // Decompress the gzcompressed data
//                 $original_data = gzuncompress($gzcompressed_data);
                
//                 // Decode the JSON data
//                 $decoded_data = json_decode($original_data, true); // true for associative array
                
//                 // Log the decoded data to the error log
//                 error_log("Decoded JSON data: " . print_r($decoded_data, true));
//             }
//         } else {
//             // No data found for the user and session
//             echo "No data found.";
//         }
//     }
// }

// function store_cart_item_data($user_id, $attach_id) {
//     global $wpdb;
// 	error_log("Store cart item");
//     $table_name = $wpdb->prefix . 'lego_cart_data';
//     $session_id = 1;
	
//     if ($session_id) {
//         $insert_result = $wpdb->insert(
//             $table_name,
//             array(
//                 'user_id' => $user_id,
//                 'session_id' => $session_id,
//                 'json_data_id' => $attach_id,
//             ),
//             array('%d', '%s', '%s') // Data types: 'user_id' is integer, 'session_id' and 'json_data_id' are strings
//         );
// 		error_log("PDF DATABASE ID:  " . $insert_result);

//         if ($insert_result !== false) {
//             // The insertion was successful, and $insert_result contains the inserted row's ID
//             $inserted_id = $wpdb->insert_id;
//             $log_messages[] = "Data inserted successfully. Inserted ID: " . $inserted_id;

//             // Now, you can return the inserted ID
//             return $inserted_id;
//         } else {
//             // The insertion failed
//             $log_messages[] = "Failed to insert data into the database.";
//         }

//         error_log(implode(PHP_EOL, $log_messages));
//         return false;
//     }
// }

// function save_colors_to_server(){
//     global $wpdb, $current_user;
    
//     $result = [];
//     $result['success'] = 'yes';
//     $result['data'] = $_POST;
//     // CheckOut Criteria Goes Here
    
//     $lego_product_details = $_POST;
    
//     //WC()->cart->add_to_cart( $product_id ,1,  0,array(), array('lego_product_details' =>  $lego_product_details);
//     $cart = WC()->cart;
//     $gb_variation_id = 0;
//     if( isset( $_POST['gb_variation_id'] ) ){
//         $gb_variation_id = $_POST['gb_variation_id'];    
//     }
    
    

    
//     if( isset( $_POST['gb_product_id'] ) ){
//         $product_id = $_POST['gb_product_id'];
        
//         // Add the item to the cart
//         WC()->cart->add_to_cart( $product_id ,1, $gb_variation_id,array(), array('lego_product_details' =>  $lego_product_details));
// 	}
    
//     echo json_encode($result);
    
//     wp_die();
// }

add_action( 'wp_ajax_nopriv_save_colors_to_server', 'save_colors_to_server' );
add_action( 'wp_ajax_save_colors_to_server', 'save_colors_to_server' );
// add_action('woocommerce_order_status_completed', 'trigger_pdf_generation_on_order_completion');

// Assuming you have your form data in $_POST, you can call the function like this:
// function trigger_pdf_generation_on_order_completion($order_id) {
//     // Retrieve order data (e.g., order items, customer information)
//     $order = wc_get_order($order_id);

//     // Get order items
//     $order_items = $order->get_items();

//     // Loop through order items to find and process relevant ones
//     foreach ($order_items as $order_item) {
//         // Check if the order item contains 'lego_product_details' data
//         if (isset($order_item['lego_product_details'])) {
//             // Retrieve the pdf_database_id from 'lego_product_details'
//             // 
//             $pdf_database_id = isset($order_item['lego_product_details']['pdf_database_id']) ? $order_item['lego_product_details']['pdf_database_id'] : null;

// if ($pdf_database_id) {

//  				if ( !is_wp_error($response)) {
//                         // Get the PDF content from the response body
//                         $pdf_content = wp_remote_retrieve_body($response);

//                         // Check if the PDF content is not empty
//                         if (!empty($pdf_content)) {
//                             // Generate a unique file name for the PDF
//                             $pdf_name = uniqid('pdf_') . '.pdf';

//                             // Define the upload directory
// 							$upload_dir = wp_upload_dir();
// 							$upload_path = $upload_dir['path'] . '/' . $pdf_name;

// 							// Save the PDF content to the file
// 							file_put_contents($upload_path, $pdf_content, FILE_BINARY);
    

//                             // Store the PDF content in a file
//         				$attachment_id = gb_media_by_file(array(
// 									'name' => $pdf_name, // Use the filename
// 									'tmp_name' => $upload_path, // Use the full path to the saved file
// 								), $post_id = null, $pdf_name);
							
//                                 // Assuming you have access to the order and order item data
//                                 $order_item_id = $order_item->get_id();
//                                 $lego_product_details = $order_item->get_meta('lego_product_details', true);
//                                 $lego_product_details['pdf_id'] = $attachment_id;
//                                 $order_item->update_meta_data('lego_product_details', $lego_product_details);
//                                 $order_item->save();

//                                 // Handle success
//                                 error_log('PDF saved as attachment with ID ' . $attachment_id);
//                             } else {
//                                 // Handle PDF file saving error
//                                 error_log('Error saving PDF file');
//                             }
//             } else {
//                 // Handle JSON parsing error
//                 error_log('Failed to parse JSON data');
//             }
//         }


// }
//add_filter( 'woocommerce_get_item_data', 'display_cart_item_custom_meta_data', 10, 2 );
function display_cart_item_custom_meta_data( $item_data, $cart_item ) {
    
    if ( isset($cart_item['lego_product_details']) ) {
        $lego_product_details = $cart_item['lego_product_details'];
        if( is_array($lego_product_details) ){
            foreach($lego_product_details as $lpd_key => $lpd_value ){
                if( is_array($lpd_value) ){
                    $item_data[] = array(
                        'key'       => $lpd_key,
                        'value'     => $lpd_value,
                    );
                }else{
                    $item_data[] = array(
                        'key'       => $lpd_key,
                        'value'     => $lpd_value,
                    );
                }
            }
        }
    }
    return $item_data;
}

// Save cart item custom meta as order item meta data and display it everywhere on orders and email notifications.
add_action( 'woocommerce_checkout_create_order_line_item', 'save_cart_item_custom_meta_as_order_item_meta', 10, 4 );
function save_cart_item_custom_meta_as_order_item_meta( $item, $cart_item_key, $values, $order ) {    
    if ( isset($values['lego_product_details']) ) {
        $item->update_meta_data( 'lego_product_details', $values['lego_product_details'] );
    }
}

function gb_media_by_file($file,$pid=null,$filename){

    //$filename = $file['name'];
    $wp_filetype = wp_check_filetype( basename($filename), null );
    $wp_upload_dir = wp_upload_dir();
	error_log("File Content:\n" . $file);
    // Move the uploaded file into the WordPress uploads directory
    move_uploaded_file( $file['tmp_name'], $wp_upload_dir['path']  . '/' . $filename );

    $attachment = array(
        'guid' => $wp_upload_dir['url'] . '/' . basename( $filename ), 
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
        'post_content' => '',
        'post_status' => 'inherit'
    );

    $filename = $wp_upload_dir['path']  . '/' . $filename;

    $attach_id = wp_insert_attachment( $attachment, $filename, $pid );
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
    wp_update_attachment_metadata( $attach_id, $attach_data );
    
    return $attach_id;
}

function wp_insert_attachment_from_url( $url, $parent_post_id = null ) {

	if ( ! class_exists( 'WP_Http' ) ) {
		require_once ABSPATH . WPINC . '/class-http.php';
	}

	$http     = new WP_Http();
	$response = $http->request( $url );
	if ( 200 !== $response['response']['code'] ) {
		return false;
	}

	$upload = wp_upload_bits( basename( $url ), null, $response['body'] );
	if ( ! empty( $upload['error'] ) ) {
		return false;
	}

	$file_path        = $upload['file'];
	$file_name        = basename( $file_path );
	$file_type        = wp_check_filetype( $file_name, null );
	$attachment_title = sanitize_file_name( pathinfo( $file_name, PATHINFO_FILENAME ) );
	$wp_upload_dir    = wp_upload_dir();

	$post_info = array(
		'guid'           => $wp_upload_dir['url'] . '/' . $file_name,
		'post_mime_type' => $file_type['type'],
		'post_title'     => $attachment_title,
		'post_content'   => '',
		'post_status'    => 'inherit',
	);

	// Create the attachment.
	$attach_id = wp_insert_attachment( $post_info, $file_path, $parent_post_id );

	// Include image.php.
	require_once ABSPATH . 'wp-admin/includes/image.php';

	// Generate the attachment metadata.
	$attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );

	// Assign metadata to attachment.
	wp_update_attachment_metadata( $attach_id, $attach_data );

	return $attach_id;

}

if( !function_exists('get_product_and_plates_info') ){
    function get_product_and_plates_info(){
        global $current_user, $wpdb, $wp,$woocommerce;
        echo '<div class="legoart_products_info" style="display: none;">';
            require_once LEGO_DIRECTORY . '/templates/plates/plates.php';
        echo '</div>';
    }
}

//[gb_lego_art]
//lego_product_type.php

if( !function_exists('gb_enqueue_files_for_xml_to_json') ){
    function gb_enqueue_files_for_xml_to_json(){
        wp_enqueue_script( 'json2xml', LEGO_DIRECTORY_URL . '/inc/js/json2xml.js', array(), '1.0.0', true );
        wp_enqueue_script( 'xml2json', LEGO_DIRECTORY_URL . '/inc/js/xml2json.js', array(), '1.0.0', true );
    }
    
    add_action( 'wp_enqueue_scripts', 'gb_enqueue_files_for_xml_to_json' );
}

if( !function_exists('gb_get_lego_product_details') ){
    function gb_get_lego_product_details($order_id){
        $order = wc_get_order( $order_id );
        $items = $order->get_items(); 
        
        $all_items_lego_product_details = [];
        
        if(is_array($items)){
            if(count($items) > 0){
                foreach( $items as $item_id => $item ) {
                    $custom_field = wc_get_order_item_meta( $item_id, 'lego_product_details', true ); 
                    $all_items_lego_product_details[$item_id] = $custom_field;    
                }
            }
        }
        
        return $all_items_lego_product_details;
    }
}

// function custom_new_product_image( $_product_img, $cart_item, $cart_item_key ) {
//     if( array_key_exists('lego_product_details',$cart_item) ){
//         //var_dump($cart_item);
//         $canvas_image_id = $cart_item['lego_product_details']['canvas_image_id'];
//         //$a      =   '<img src="'.$cart_item['lego_product_details']['canvas_image_id'].'" alt="'.$cart_item['lego_product_details']['canvas_image_id'].'"/>';
//         return wp_get_attachment_image($canvas_image_id,'medium');
//         //return $_product_img;
//     }else{
//         return $_product_img;
//     }
// }
function custom_new_product_image($product_img, $cart_item, $cart_item_key) {
    if (array_key_exists('lego_product_details', $cart_item)) {
        $pdf_id = $cart_item['lego_product_details']['pdf_database_id'];

        // Construct the image URL based on the pdf_id
        $image_url = site_url('/wp-content/uploads/generated-images/' . $pdf_id . '.png');

        // Create an image tag with the custom URL
        $product_image = '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($pdf_id) . '" />';

        return $product_image;
    }

    return $product_img;
}


add_filter( 'woocommerce_cart_item_thumbnail', 'custom_new_product_image', 10, 3 );

if( !function_exists('gb_register_meta_boxes') ){
    function gb_register_meta_boxes() {
        add_meta_box( 'lego_orders_meta_box', __( 'Lego Art Details', 'lego_art' ), 'gb_register_meta_boxes_callback', 'shop_order' );
    }
    add_action( 'add_meta_boxes', 'gb_register_meta_boxes' );
}

if( !function_exists('gb_register_meta_boxes_callback') ){
    function gb_register_meta_boxes_callback( $post ){
        global $current_user, $wpdb;
        $order_id = $post->ID;
        $lego_product_details = gb_get_lego_product_details($order_id);
        get_product_and_plates_info();
        ?>
        <style type="text/css">
            .lego_product_details{
                width: 100%;
            }
            
            .lego_product_details thead{
                
            }
            
            .lego_product_details tbody{
                text-align: left;
            }
            
            .lego_product_details thead tr th{
                font-size: 20px;
            }
            
            .lego_product_details .color_box_container{
                display: inline-flex;
                width: 10%;
            }
            
            .lego_product_details .color_box{
                width: 20px;
                height: 20px;
                display: inline-block;
                border: 1px solid #000;
                margin-right: 5px;
            }
        </style>
        <table class="lego_product_details" >
            <colgroup>
                <col style="width:40%;">
                <col style="width:60%;">
            </colgroup>
            <thead>
                <tr>
                    <th>Labels</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    if (is_array($lego_product_details) && count($lego_product_details) > 0) {
                       foreach ($lego_product_details as $lpd) {
							
						   $pdf_id = $lpd['pdf_database_id'];
						   
                            $colors_data = $lpd['colors_data'];
                            $gb_get_color_arr = $lpd['gb_get_color_arr'];
							$pdf_file_path = ABSPATH . 'wp-content/uploads/generated-pdfs/' . $pdf_id . '.pdf';
							error_log('PDF Path: ' . $pdf_file_path);                            
                            
                            $canvas_image_path = ABSPATH . 'wp-content/uploads/generated-images/' . $pdf_id . '.png';
                            
                           
                            $pdf = wp_get_attachment_url($pdf_id);
                            
                            $gb_variation_id = $lpd['gb_variation_id'];
                            $gb_product_id = $lpd['gb_product_id'];
                            $product_title = get_the_title($gb_product_id);
                            
                            ////////////////////////////////
                            
                            $lego_condtion_table =  $wpdb->prefix . 'postmeta';
                            $results = $wpdb->get_results( "SELECT * FROM {$lego_condtion_table} WHERE `meta_key`='is_legoart_product' AND `meta_value`='yes'", OBJECT );
                            
                            $product_data = [];
                            
							if (file_exists($pdf_file_path) and file_exists($canvas_image_path)) {
								error_log('PDF Path is valid: ' . $pdf_file_path);    
								$canvas_image = site_url('/wp-content/uploads/generated-images/' . $pdf_id . '.png');
								$pdf = site_url('/wp-content/uploads/generated-pdfs/' . $pdf_id . '.pdf');
								
							} else {

								$pdf_ready = false;
									error_log('PDF not ready for ID: ' . $pdf_id);
								}
							
														
					
							
							if( is_array($results) ){
                                if(count($results) > 0){
                                    foreach($results as $key => $value){
                                        $single_variation_data = [];
                                        
                                        $product_id = $value->post_id;
                                        $product = get_post($product_id);
                                        $product_meta = get_post_meta($product_id);
                                        
                                        $product = wc_get_product($product_id);
                                        $variations = $product->get_available_variations();
                                        
                                        foreach($variations as $variation_key => $variation){
                                            $variation_id = $variation['variation_id'];
                                            if(intval($gb_variation_id) == $variation_id){
                                                $single_variation_data[$variation_id]['attributes'] = $variation['attributes'];
                                                $single_variation_data[$variation_id]['display_regular_price'] = $variation['display_regular_price'];
                                                $single_variation_data[$variation_id]['display_price'] = $variation['display_price'];
                                            }
                                        }
                                        
                                        $product_key = 'product_' . $product_id;
                                        $product_data = $single_variation_data;
                                        
                                        //Task is to Convert the Info in JSON so we access it via jQuery.
                                    }
                                }
                            }
                            
                            ///////////////////////////////
                            
                            ?>
                            <tr>
                                <th>Product Title</th>
                                <td><?php echo $product_title?></td>
                            </tr>
                            
							<tr>
								<th>Canvas Image</th>
								<td><a href="<?php echo $canvas_image; ?>" download="Canvas_Design.jpg">Download Canvas Design</a></td>
							</tr>

							<tr>
								<th>Canvas PDF Details</th>
								<td><a href="<?php echo $pdf; ?>" download="Captured_Data.pdf">Download Captured Data</a></td>
							</tr>
                            <tr>
                                <th>All Colors</th>
                                <td>
                                    <?php
                                        foreach($gb_get_color_arr as $color){
                                            echo '<div class="color_box_container" > <div class="color_box" style="background-color: ' . $color . '"></div> <span>' . $color . '</span> </div>';
                                        }
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <?php
                                    $product_data = $product_data[$gb_variation_id]['attributes'];
                                    $vertical = $product_data['attribute_vertical'];
                                    $horizontal = $product_data['attribute_horizontal'];
                                ?>
                                <th>Plates Required <?php echo '( Vertical x Horizontal(' . $vertical . ' x ' . $horizontal . ') )'; ?></th>
                                <td>
                                    <?php
                                        echo ( intval($vertical) * intval($horizontal) ) . ' Plates Required';
                                        //var_dump($product_data);
                                    ?>
                                </td>
                            </tr>
                            <?php       
                            //echo $canvas_image = wp_get_attachment_url($canvas_image_id);
                            //echo $pdf = wp_get_attachment_url($pdf_id);
                            
                        }
                    }
                ?>
            </tbody>
        </table>
        <?php
        
        //var_dump($lego_product_details);
        //gb_get_lego_product_details($order_id);
    }

}

if( !function_exists('gb_register_meta_box_save') ){
    function gb_register_meta_box_save( $post_id ) {
        
    }
    add_action( 'save_post', 'gb_register_meta_box_save' );
}

function woocommerce_currency_switcher_for_cart($currency){
	error_log('PDF ID: ' . $currency);
    //include_once WC_ABSPATH . 'includes/wc-cart-functions.php';
    //include_once WC_ABSPATH . 'includes/class-wc-cart.php';

    if ( is_null( WC()->cart ) ) {
        wc_load_cart();
    }
    // is current page is product-single
    /*if(is_single('product')) {
        return has_term('clothing', 'product_cat') ? 'EUR' : $currency;
    }
    // for every else pages
    global $woocommerce;
    foreach($woocommerce->cart->get_cart() as $product) {
        if (has_term('clothing', 'product_cat', $product['product_id'])) {
            return 'EUR';
        }
    }
    return $currency;*/
    
    $new_currency = 'AUD';
    
    $cart_data = WC()->cart->get_cart();
    
if ($cart_data != null) {
    foreach ($cart_data as $item) {
        // Check if 'lego_product_details' exists for the current item
        if (isset($item['lego_product_details'])) {
            $lego_product_details = $item['lego_product_details'];

            if (array_key_exists('gb_currency', $lego_product_details)) {
                $new_currency = $lego_product_details['gb_currency'];
                if ($new_currency == '') {
                    $new_currency = $currency;
                } else {
                    return $new_currency;
                }
            }
        }
    }
}

    
    return $new_currency; 
    //return 'EUR';
}

// add_filter('woocommerce_currency', 'log_currency_change', 999);

// function log_currency_change($currency) {
//     error_log('Currency changed to: ' . $currency);

//     return $currency;
// }
//add_action( 'woocommerce_before_calculate_totals', 'change_cart_item_currency', 10, 1 );
/*function change_cart_item_currency( $cart_all ) {
    if ( is_admin() && ! defined( 'DOING_AJAX' ) )
        return;

    $cart = WC()->cart;
    $cart_data = [];
    if(is_null($cart)){
        
    }else{
        $new_currency = 'EUR'; // set the new currency code 
        // Loop through each cart item
        foreach ( $cart->get_cart() as $cart_item ) {
            // Get the current currency
            //$current_currency = $cart_item;
            //array_push($cart_data,$current_currency);
            // Update the currency if it's different
            //if($current_currency != $new_currency) {
                $cart_item['data']->set_currency($new_currency);
            //}
        }
    }
    
    //echo '<pre>';
        //var_dump($cart_data);
    //echo '</pre>';
}*/

//add_action('wp_head','change_cart_item_currency');

//add_filter( 'woocommerce_add_cart_item_data', 'add_cart_item_currency', 10, 2 );
// function add_cart_item_currency( $cart_item_data, $product_id ) {
//     $target_currency = 'EUR';
//     $cart_item_data['currency'] = $target_currency;
//     return $cart_item_data;
// }

// Display the price in the correct currency
// 
// 
// add_filter( 'woocommerce_cart_item_subtotal','display_cart_item_price_in_currency', 10, 3 );

// add_filter( 'woocommerce_cart_item_price', 'display_cart_item_price_in_currency', 10, 3 );
// function display_cart_item_price_in_currency( $price, $cart_item, $cart_item_key ) {
// 		$currenc = get_woocommerce_currency();
// 	error_log('Currency is: ' . $currenc);
//     $lego_product_details = $cart_item['lego_product_details'];
            
//     if( array_key_exists('gb_currency',$lego_product_details) ){
//         $new_currency = $lego_product_details['gb_currency'];
//         if($new_currency == ''){
//             $target_currency = $cart_item['currency'];
//         }else{
//              $target_currency = $new_currency;
//         }
//     }
    
//     //$target_currency = $cart_item['currency'];
//     $base_currency = 'USD';
//     $app_id = '800cd5095b6c4cafad93aa7b3d03e09f';
//     $conversion_rate = fetch_conversion_rate($base_currency, $target_currency, $app_id);
//     $price = round($cart_item['data']->get_price() * $conversion_rate, 2);
    
//     return $target_currency . ' ' . wc_price($price, array( 'currency' => $target_currency ) );
// }

// function fetch_conversion_rate($base_currency, $target_currency, $app_id){
// 	 error_log('Target currency : ' . $target_currency);
//     $url = 'https://openexchangerates.org/api/latest.json?app_id=' . $app_id;
//     $response = wp_remote_get( $url );
//     $data = json_decode( wp_remote_retrieve_body( $response ), true );
//     $conversion_rate = $data['rates'][$target_currency] / $data['rates'][$base_currency];
//     return $conversion_rate;
// }

//add_filter( 'woocommerce_cart_item_subtotal', 'change_cart_item_subtotal_currency', 10, 3 );
// function change_cart_item_subtotal_currency( $subtotal, $cart_item, $cart_item_key ) {
//     $lego_product_details = $cart_item['lego_product_details'];
            
//     if( array_key_exists('gb_currency',$lego_product_details) ){
//         $new_currency = $lego_product_details['gb_currency'];
//         if($new_currency == ''){
//             $target_currency = $cart_item['currency'];
//         }else{
//              $target_currency = $new_currency;
//         }
//     }
    
//     //$target_currency = 'EUR'; // Change this to the desired currency
//     $base_currency = 'USD';
//     $app_id = '800cd5095b6c4cafad93aa7b3d03e09f';
//     $conversion_rate = fetch_conversion_rate($base_currency, $target_currency, $app_id);
//     $subtotal = $cart_item['data']->get_price();
//     $subtotal = $subtotal * $conversion_rate;
//     $subtotal = $subtotal * $cart_item['quantity'];
//     return $target_currency . ' ' . wc_price( $subtotal, array( 'currency' => $target_currency ) );
// }


//add_filter('option_woocommerce_currency', 'woocommerce_currency_switcher_for_cart', 10, 1);
//add_filter( 'woocommerce_currency', 'woocommerce_currency_switcher_for_cart' );

/*add_filter( 'woocommerce_currency_symbol', 'change_existing_currency_symbol', 10, 2 );
function change_existing_currency_symbol( $currency_symbol, $currency ) {
    global $post, $product;

    $custom_sym = 'ptos'; // <=== HERE define your currency symbol replacement
    $custom_cur = 'EUR'; // <=== HERE define the targeted currency code
    $category   = array('cupones'); // <=== HERE define your product category(ies)
    $taxonomy   = 'product_cat';

    // Cart and checkout
    if( ( is_cart() || is_checkout() ) && $currency == $custom_cur ){
        foreach( WC()->cart->get_cart() as $cart_item ){
            if ( has_term( $category, $taxonomy, $cart_item['product_id'] ) ){
                return $custom_sym; // Found! ==> we return the custom currency symbol
            }
        }
    }

    // Others Woocommerce product pages
    if ( has_term( $category, $taxonomy ) && $currency == $custom_cur ) {
        return $custom_sym;
    }

    return $currency_symbol;
}
*/

function gb_check_if_cart_have_products(){
        
}

function get_prestashop_data_func($atts){
    global $current_user, $wpdb, $wp,$woocommerce;
    $atts = shortcode_atts( array(
        'post_slug' => '',
        'user_roles' => ''
    ), $atts, 'get_prestashop_data_func' );
    
    $api = '7SKXHPAN5QL2F2YVBYEBL6G5WA6X5RXP';
    $authorization = base64_encode($api . ':');
    
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://7SKXHPAN5QL2F2YVBYEBL6G5WA6X5RXP@woonkasteel.com/api/',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      CURLOPT_HTTPHEADER => array(
        'Authorization: Basic N1NLWEhQQU41UUwyRjJZVkJZRUJMNkc1V0E2WDVSWFA6',
        'Output-Format: JSON',
        'x-powered-by: PrestaShop Webservice',
        'psws-version: 1.7.8.8'
      ),
    ));
    
    $response = curl_exec($curl);
    
    curl_close($curl);
    echo $response;
    
    //var_dump($response);
}



// Hook into the 'woocommerce_before_order_itemmeta' action
// Hook into the 'woocommerce_before_order_itemmeta' action
add_action('woocommerce_before_order_itemmeta', 'print_order_item_meta_data', 10, 3);

function print_order_item_meta_data($item_id, $item, $product)
{
    // Check if the item has the 'lego_product_details' meta data
    $lego_product_details = $item->get_meta('lego_product_details', true);

    if (!empty($lego_product_details)) {
        echo '<ul class="order-item-meta">';
        
        // Loop through and print each meta data entry
        foreach ($lego_product_details as $meta_key => $meta_value) {
            echo '<li>';
            echo '<strong>' . esc_html($meta_key) . ': </strong>';
            echo esc_html($meta_value);
            echo '</li>';
        }
        
        echo '</ul>';
    }
}

function generate_zip_url($file_urls) {
    // Get the WordPress upload directory
    

    $upload_dir = wp_upload_dir();

    // Create a temporary directory within the upload directory
    $temp_dir = $upload_dir['basedir'] . '/pdfs_' . uniqid();
    if (!is_dir($temp_dir)) {
        mkdir($temp_dir);
    }

    // Create the ZIP archive
    $zip_file = $temp_dir . '/brickpie-generated-pdfs.zip';
	$zip = new ZipArchive();
if ($zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE | ZipArchive::CREATE)) {

        // Download and save PDF files to the temporary directory
        foreach ($file_urls as $url) {
            $pdf_content = file_get_contents($url);
            if ($pdf_content) {
                $file_name = basename($url);
                $file_path = $temp_dir . '/' . $file_name;
                file_put_contents($file_path, $pdf_content);

                // Check if the file was successfully saved
                if (file_exists($file_path)) {
                    // Add the saved file to the ZIP archive
                    $zip->addFile($file_path, $file_name);
                }
            }
        }

        // Close the ZIP archive
        $zip->close();
    }

    // Clean up temporary files
    foreach ($file_urls as $url) {
        $file_name = basename($url);
        $file_path = $temp_dir . '/' . $file_name;
        if (file_exists($file_path)) {
            unlink($file_path);
        }
    }

    // Return the URL of the ZIP file within the uploads directory
    if (file_exists($zip_file)) {
        $zip_url = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $zip_file);
        return esc_url($zip_url);
    } else {
        return false; // Return false if ZIP file creation failed
    }
}




add_shortcode( 'get_prestashop_data', 'get_prestashop_data_func' );
add_action('woocommerce_order_details_after_order_table', 'custom_order_details_after_order_table', 10, 1);

function custom_order_details_after_order_table($order) {
    if ($order->has_status('completed')) {
        // Get the order ID
        $order_id = $order->get_id();
        
        // Get order items
        $order_items = $order->get_items();

        // Create an array to store PDF URLs
        $pdf_urls = array();
        $pdf_ready = true; // Assume all PDFs are ready

        // Iterate through order items
foreach ($order_items as $order_item) {
    // Get the product ID from the order item
    $product_id = $order_item->get_product_id();

    // Call gb_get_lego_product_details for each product
    $lego_product_details = gb_get_lego_product_details($order_id, $product_id);

    if (is_array($lego_product_details) && count($lego_product_details) > 0) {
        foreach ($lego_product_details as $lpd) {
            $pdf_id = $lpd['pdf_database_id'];

            // Log the PDF ID
            error_log('PDF ID: ' . $pdf_id);

            // Check if the PDF file exists
            $pdf_file_path = ABSPATH . 'wp-content/uploads/generated-pdfs/' . $pdf_id . '.pdf';
            error_log('PDF Path: ' . $pdf_file_path);

            if (file_exists($pdf_file_path)) {
                // PDF is ready, get the PDF URL and add it to the array
                $pdf_url = site_url('/wp-content/uploads/generated-pdfs/' . $pdf_id . '.pdf');
                $pdf_urls[] = $pdf_url;
            } else {
                // PDF is not ready, set $pdf_ready to false
                $pdf_ready = false;
                error_log('PDF not ready for ID: ' . $pdf_id);
            }
        }
    }
}


        // Check for PDF readiness and display the message or button using JavaScript
        ?>
        <h2 class="woocommerce-order-details__title">Additional Information</h2>
        <table class="woocommerce-table woocommerce-table--order-details shop_table order_details">
            <tbody>
                <tr>
                    <th id="pdf-status-cell">PDF Status</th>
                    <td id="pdf-action-cell">
                        <?php if ($pdf_ready && !empty($pdf_urls)) : ?>
                            <a href="<?php echo generate_zip_url($pdf_urls); ?>" class="button">Download ZIP</a>
                        <?php else : ?>
                            <p id="pdf-status-message">PDFs are still generating. Please wait.</p>
                        <?php endif; ?>
                    </td>
                </tr>
            </tbody>
        </table>
        <script>
            (function checkPDFStatus() {
                if (!<?php echo json_encode($pdf_ready); ?>) {
                    setTimeout(function() {
                        location.reload();
                    }, 10000); // Reload the page every 10 seconds
                }
            })();
        </script>
        <?php
    }
}

add_action('cleanup_task_find_expiring_sessions', 'identify_sessions_to_delete');
function identify_sessions_to_delete() {
   
    global $wpdb;

    // Query the WordPress sessions database table for sessions about to expire
    $now = current_time('timestamp');
    $threshold = $now + 300; // 10 minutes
    $sessions = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT session_id, session_key, session_value FROM wp_woocommerce_sessions WHERE session_expiry <= %d",
            $threshold
        )
    );

    foreach ($sessions as $session) {
        $session_data = maybe_unserialize($session->session_value);

        if (is_array($session_data) && isset($session_data['cart'])) {
            $cart_data = maybe_unserialize($session_data['cart']);

//             // Log session details
//             error_log('Session ID: ' . $session->session_id);
//             error_log('Session Key: ' . $session->session_key);

//             // Log session data
//             error_log('Session Data:');
//             error_log(print_r($session_data, true));

//             // Log cart_data
//             error_log('Cart Data:');
//             error_log(print_r($cart_data, true));

            // Check the cart data for pdf_database_id
            $pdf_ids = array();
			foreach ($cart_data as $cart_item) {
				if (is_array($cart_item) && isset($cart_item['lego_product_details']['pdf_database_id'])) {
					$pdf_ids[] = $cart_item['lego_product_details']['pdf_database_id'];
				}
			}

// 			// Log extracted pdf_ids
// 			error_log('Extracted pdf_ids:');
// 			error_log(print_r($pdf_ids, true));

//             // Log session_value
//             error_log('Session Value:');
//             error_log($session->session_value);

            // Check if the session_id and session_key already exist in the "pending_deletion" table
            $existing_data = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT session_id, session_key FROM " . $wpdb->prefix . "wc_lego_pending_delete WHERE session_id = %s AND session_key = %s",
                    $session->session_id,
                    $session->session_key
                )
            );

            // Insert $data_to_store into your custom "pending_deletion" table only if it doesn't already exist
            if (!$existing_data) {
                $data_to_store = array(
                    'session_id' => $session->session_id,
                    'session_key' => $session->session_key,
                    'pdf_ids' => implode(',', $pdf_ids), // Convert the array to a comma-separated string
                );

                // Insert $data_to_store into your custom "pending_deletion" table
                $wpdb->insert(
                    $wpdb->prefix . 'wc_lego_pending_delete',
                    $data_to_store
                );
            }
        }
    }
}
add_action('cleanup_task_delete_lego_data', 'process_expired_session_delete_lego_data');
// function process_expired_session_delete_lego_data() {
//     error_log('process_expired_session_delete_lego_data triggered'); // Add this line to log when the function is triggered

//     global $wpdb;

//     $results = $wpdb->get_results("SELECT pdf_ids FROM " . $wpdb->prefix . "wc_lego_pending_delete");

//     foreach ($results as $result) {
//         // Convert the comma-separated string back to an array
//         $pdf_ids = explode(',', $result->pdf_ids);

//         // Now you can use $pdf_ids as an array
//         // Prepare the request body
//         $body = json_encode(array('items' => $pdf_ids));

//         // Make the API request
//         $response = wp_safe_remote_request('https://brickpie.co/api/cart-items', array(
//             'method' => 'DELETE',
//             'body' => $body,
//             'headers' => array('Content-Type' => 'application/json'),
//         ));

//         // Check if the request was successful
//         if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) == 204) {
//             // API request successful, delete the entry from wc_lego_pending_delete
//             $wpdb->delete($wpdb->prefix . 'wc_lego_pending_delete', array('pdf_ids' => $result->pdf_ids));
//         }
//     }
// }

function process_expired_session_delete_lego_data() {
    error_log('process_expired_session_delete_lego_data triggered'); // Add this line to log when the function is triggered

    global $wpdb;

    $current_time = current_time('timestamp'); // Get the current timestamp

    // Get the pending entries
    $results = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "wc_lego_pending_delete");

    foreach ($results as $result) {
        // Convert the comma-separated string back to an array
        $pdf_ids = explode(',', $result->pdf_ids);

        // Check if an entry with the same session_id and session_key exists
        $existing_entry = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM " . $wpdb->prefix . "woocommerce_sessions WHERE session_id = %s AND session_key = %s",
                $result->session_id,
                $result->session_key
            )
        );

        if (!$existing_entry) {
            // Entry doesn't exist, delete the entry
            $wpdb->delete($wpdb->prefix . 'wc_lego_pending_delete', array('session_id' => $result->session_id, 'session_key' => $result->session_key));
        } elseif ($existing_entry) {
            $time_difference = $existing_entry->session_expiry - $current_time;
            if ($time_difference <= 300) {
                // Entry exists and is within 5 minutes of expiring, make the API call
                // Prepare the request body
                $body = json_encode(array('items' => $pdf_ids));

                // Make the API request
                $response = wp_safe_remote_request('https://brickpie.co/api/cart-items', array(
                    'method' => 'DELETE',
                    'body' => $body,
                    'headers' => array('Content-Type' => 'application/json'),
                ));

                // Check if the request was successful
                if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) == 204) {
                    // API request successful, delete the entry from wc_lego_pending_delete
                    $wpdb->delete($wpdb->prefix . 'wc_lego_pending_delete', array('session_id' => $result->session_id, 'session_key' => $result->session_key));
                    // Now, delete the session
                    $wpdb->delete($wpdb->prefix . 'woocommerce_sessions', array('session_id' => $result->session_id, 'session_key' => $result->session_key));
                }
            } else {
                // If the session is not within 5 minutes of expiring, delete the entry
                $wpdb->delete($wpdb->prefix . 'wc_lego_pending_delete', array('session_id' => $result->session_id, 'session_key' => $result->session_key));
            }
        }
    }
}

add_action('wp', 'schedule_cleanup_tasks');

function schedule_cleanup_tasks() {
    if (!wp_next_scheduled('cleanup_task_delete_lego_data')) {
        // Schedule the event to run every 10 minutes
        wp_schedule_event(current_time('timestamp'), 'every_minute', 'cleanup_task_delete_lego_data');
    }

    if (!wp_next_scheduled('cleanup_task_find_expiring_sessions')) {
        // Schedule the event to run every 1 minut
        wp_schedule_event(current_time('timestamp'), 'every_minute', 'cleanup_task_find_expiring_sessions');
    }
}


function process_cart_items() {
    global $wpdb;
    
    // Get the pdf_ids from the wc_lego_pending_delete table
    $pdf_ids = $wpdb->get_results("SELECT pdf_ids FROM " . $wpdb->prefix . "wc_lego_pending_delete");

    foreach ($pdf_ids as $pdf_id) {
        // Prepare the request body
        $body = json_encode(array('items' => $pdf_id->pdf_ids));

        // Make the API request
        $response = wp_safe_remote_post('https://brickpie.co/api/cart-items', array(
            'body' => $body,
            'headers' => array('Content-Type' => 'application/json'),
        ));

        // Check if the request was successful
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) == 200) {
            // API request successful, delete the entry from wc_lego_pending_delete
            $wpdb->delete($wpdb->prefix . 'wc_lego_pending_delete', array('pdf_ids' => $pdf_id->pdf_ids));
        }
    }
}




function create_wc_lego_pending_delete_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'wc_lego_pending_delete';

    $charset_collate = $wpdb->get_charset_collate();

    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") !== $table_name) {
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            session_key varchar(100) NOT NULL,
            pdf_ids text NOT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

register_activation_hook(__FILE__, 'create_wc_lego_pending_delete_table');


register_deactivation_hook(__FILE__, 'remove_cleanup_schedule');
function remove_cleanup_schedule() {
    wp_clear_scheduled_hook('custom_cleanup_event');
}
?>