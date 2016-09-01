// Toggle Cart
$( "#cart-toggle" ).on( "click", function() {
	$( "#cart" ).toggle();
} );

// Update on amount input change
$( ".amount input" ).on( "change", function() {
	var newAmount = parseInt( $( this ).val() );
	var $addButton = $( this ).parent( ".amount" ).siblings( ".plan-purchase" );
	var unitPrice = parseFloat( $addButton.attr( "unit-price" ) );
	var $productDiv = $( this ).closest( ".product" );
	var productId = $productDiv.find( ".add-to-cart" ).attr( "product-id" );
	var amount = $productDiv.find( ".amount input" ).val();

	// Update price for new amount
	$addButton.find( ".price" ).html( ( newAmount * unitPrice ).toFixed( 2 ) );

	// If already in cart update cart
	if ( $productDiv.hasClass( "in-cart" ) ) {
		// Update cart
		$.post(
			"/update-cart", {
				action: "update",
				product_id: productId,
				amount: amount
			},
			function( data ) {
				// On Response
				updateCart( data );
			}
		);
	}

} );
