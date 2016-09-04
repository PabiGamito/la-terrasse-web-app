// Toggle Cart
$( "#cart-toggle" ).on( "click", function() {
	$( "#cart" ).toggle();
} );

// Product quantity change
$( ".quantity .fa-minus" ).click( function() {
	var quantity = parseInt( $( this ).parent().find( "input" ).val() );
	if ( quantity > 1 ) {
		quantity--;
	}
	$( this ).siblings( "input" ).val( quantity );
	amountInputChange( $( this ).siblings( "input" ) );
} );
$( ".quantity .fa-plus" ).click( function() {
	var quantity = parseInt( $( this ).parent().find( "input" ).val() );
	if ( quantity < 99 ) {
		quantity++;
	}
	$( this ).siblings( "input" ).val( quantity );
	amountInputChange( $( this ).siblings( "input" ) );
} );

// Update on amount input change
$( ".quantity input" ).on( "change", function() {
	amountInputChange( $( this ) );
} );

function amountInputChange( $input ) {
	var newAmount = parseInt( $input.val() );
	var $price = $input.parents( ".quantity" ).siblings( ".price" );
	var unitPrice = parseFloat( $price.attr( "unit-price" ) );
	var productId = $input.parents( ".quantity" ).siblings( ".add-to-cart" ).attr( "product-id" );

	// Update price for new amount
	$price.html( String( ( newAmount * unitPrice ).toFixed( 2 ) ) + " &euro;" );

	// If already in cart update cart
	if ( $input.parent( ".quantity" ).siblings( ".add-to-cart" ).hasClass( "in-cart" ) ) {
		// Update cart
		$.post(
			"/update-cart", {
				action: "update",
				product_id: productId,
				amount: newAmount
			},
			function( data ) {
				// On Response
				updateCart( data );
			}
		);
	}
}

// On request to add to cart
$( document ).on( "click", ".not-in-cart.add-to-cart", function() {
	var productId = $( this ).attr( "product-id" );
	var amount = $( this ).siblings( ".quantity" ).find( "input" ).val();
	var $addToCart = $( this );

	// Add to cart
	$.post(
		"/update-cart", {
			action: "add",
			product_id: productId,
			amount: amount
		},
		function( data ) {
			// On Response
			console.log( data );
			// console.log( $( this ).closest( ".card" ) );
			$addToCart.removeClass( "not-in-cart" );
			$addToCart.addClass( "in-cart" );
			// $addToCart.find( "span" ).html( "Suprimer du Panier" );
			updateCart( data );
		}
	);
} );

// On request to remove from cart
$( document ).on( "click", ".in-cart.add-to-cart", function() {
	var productId = $( this ).attr( "product-id" );
	var $addToCart = $( this );

	// Remove from cart
	$.post(
		"/update-cart", {
			action: "remove",
			product_id: productId
		},
		function( data ) {
			// On Response
			console.log( $( this ) );
			$addToCart.removeClass( "in-cart" );
			$addToCart.addClass( "not-in-cart" );
			// $addToCart.find( "span" ).html( "Ajouter au Panier" );
			updateCart( data );
		}
	);
} );

function updateCart( data ) {
	$( "#cart" ).html( data );
}
