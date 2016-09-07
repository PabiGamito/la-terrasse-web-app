// Disable default form submit action
$( 'form' ).submit( false );

// $( '.user-phone' ).formatter( {
// 	'pattern': '{{99}} {{99}} {{99}} {{99}} {{99}}'
// } );
$( '.user-first-name' ).formatter( {
	'pattern': '{{aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}}'
} );
$( '.user-last-name' ).formatter( {
	'pattern': '{{aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}}'
} );
$( '.pickup-time' ).formatter( {
	'pattern': '{{99}}:{{99}}'
		// 'persistent': true
} );

// Setup time select
function roundUp5( x ) {
	return Math.ceil( x / 5 ) * 5;
}
var t = moment.tz( "Europe/Paris" );
var hour = parseInt( t.format( "HH" ) );
var minutes = roundUp5( parseInt( t.format( "mm" ) ) );
if ( hour < 17 || ( hour == 18 && minutes < 30 ) ) {
	hour = 18;
	minutes = 30;
}
$( "input.pickup-time" ).attr( "placeholder", hour + ":" + minutes );
var options = "";
while ( hour < 22 ) {
	if ( hour < 21 || ( hour == 21 && minutes < 30 ) ) {
		if ( minutes == 60 ) {
			minutes = 0;
			hour++;
		}
		displayMinute = ( "0" + minutes ).slice( -2 );
		options += "<option value=" + hour + ":" + displayMinute + "></option>";
		minutes += 5;
	} else {
		hour = 23; // breaks loop
	}
}

$( "datalist#pickup-times" ).html( options );

// TODO: Add mailcheck https://github.com/mailcheck/mailcheck
$( "a.not-new" ).click( function() {
	$( ".first-order" ).hide();
	$( ".not-first-order" ).show();
} );
$( "a.new" ).click( function() {
	$( ".not-first-order" ).hide();
	$( ".first-order" ).show();
} );

$( "a.change-email" ).click( function() {
	$( ".first-section.no-missing-data" ).hide();
	$( ".first-section.missing-data" ).show();
	$( ".first-order" ).hide();
	$( ".not-first-order" ).show();
} );
$( "a.create-account" ).click( function() {
	$( ".first-section.no-missing-data" ).hide();
	$( ".first-section.missing-data" ).show();
} );

// Send first order (add user data)
$( ".first-order button[type='submit'].order" ).click( function() {
	// Clear error message
	$( ".error" ).removeClass( "error" );
	$( "error-message" ).remove();
	var $form = $( this ).closest( ".form" );
	$( this ).find( ".fa" ).removeClass( "fa-chevron-right" );
	$( this ).find( ".fa" ).addClass( "fa-spinner fa-pulse fa-fw" );
	var pickupTime;
	if ( $form.find( ".pickup-time" ).val() === "" ) {
		pickupTime = $form.find( ".pickup-time" ).attr( "placeholder" );
	} else {
		pickupTime = $form.find( ".pickup-time" ).val();
	}

	$.post(
		"/order", {
			first_order: true,
			first_name: $form.find( ".user-first-name" ).val(),
			last_name: $form.find( ".user-last-name" ).val(),
			email: $form.find( ".user-email" ).val(),
			phone: $form.find( ".user-phone" ).val(),
			pickup_time: pickupTime
		},
		function( data, status ) {
			// On Response
			if ( data.success ) {
				handleOrderSuccess( data );
			} else {
				errorHandling( data.error_id, data );
			}
		}
	);
} );

// Send order (expect user data to already exist)
$( ".not-first-order button[type='submit'].order" ).click( function() {
	var $form = $( this ).closest( ".form" );
	$( this ).find( ".fa" ).removeClass( "fa-chevron-right" );
	$( this ).find( ".fa" ).addClass( "fa-spinner fa-pulse fa-fw" );
	var pickupTime;
	if ( $form.find( ".pickup-time" ).val() === "" ) {
		pickupTime = $form.find( ".pickup-time" ).attr( "placeholder" );
	} else {
		pickupTime = $form.find( ".pickup-time" ).val();
	}

	$.post(
		"/order", {
			first_order: false,
			email: $form.find( ".user-email" ).val(),
			pickup_time: pickupTime
		},
		function( data, status ) {
			// On Response
			if ( data.success ) {
				handleOrderSuccess( data );
			} else {
				errorHandling( data.error_id, data );
			}
		}
	);
} );

function handleOrderSuccess( data ) {
	// window.location.replace( data.redirect );
	$( "#order-form" ).html( '<h3>Merci pour votre comande!</h3>' +
		'<h4>Pour que la commande passe en cuisine, veuillez la confirmer grace au lien de confirmation qui vous a été envoyé</h4>' +
		'<a href="' + data.mail_domain + '"' +
		'<button type="button" name="open-email-client">Ouvrir ma boîte mail</button>' +
		'</a>' );
}

function getOderRecap( orderSubmittedTime ) {
	$.get(
		"/order-recap", {
			ts: orderSubmittedTime
		},
		function( data ) {
			// On Response
			$( "#order-recap" ).html( data );
		}
	);
}

function errorHandling( errorID, data ) {
	$( "button[type='submit'].order .fa" ).removeClass( "fa-spinner fa-pulse fa-fw" );
	$( "button[type='submit'].order .fa" ).addClass( "fa-chevron-right" );
	var message;
	console.log( "errorID", errorID, "errorData", data );
	switch ( errorID ) {
		case 1: // not open for orders
			t = moment.tz( "Europe/Paris" );
			var timeOfDay = parseInt( t.format( "HH" ) ) + parseInt( t.format( "mm" ) ) / 60;
			if ( timeOfDay < 18.5 ) {
				message = "On ne prends que des commandes entre 18:30 et 21:30. <b>Votre commande sera prise en charge à partir de 18:30.</b> Es-ce que ça vous va ?";
				// TODO: Add button to say ok.
			} else if ( timeOfDay > 21.5 ) {
				message = "On ne prends que des commandes entre 18:30 et 21:30. Il est trop tard pour commander. On est désolé.";
			}
			showAlert( message );
			break;
		case 2: // invalid email address
			message = "Il semble que votre address email n'est pas valide. Veuillez saisir une adresse email valide.";
			if ( data.first_order ) {
				addErrorMessage( $( ".first-order .user-email" ), message );
			} else if ( !data.first_order ) {
				addErrorMessage( $( ".not-first-order .user-email" ), message );
			}
			break;
		case 3: // one or more required parameters are empty
			message = "Toute information doit être saisie.";
			if ( data.first_order ) {
				$( ".first-order input" ).each( function() {
					if ( $( this ).val() === "" && !$( this ).hasClass( "pickup-time" ) ) {
						addErrorMessage( $( this ), message );
					}
				} );
			} else if ( !data.first_order ) {
				$( ".not-first-order input" ).each( function() {
					if ( $( this ).val() === "" ) {
						addErrorMessage( $( this ), message );
					}
				} );
			}
			break;
		case 4: // email is already associated with an account
			message = "Cette adresse email est déjà associée à un compte.";
			addErrorMessage( $( ".first-order .user-email" ), message );
			message = "Saissisez votre adresse email ici.";
			addErrorMessage( $( ".not-first-order .user-email" ), message );
			break;
		case 5: // you are missing contact detail, please submit form as a new user
			message = "Le compte accossié à cette adresse email ne contient pas tout vos coordonées. Veuillez vous remplis le formulaire comme un nouveau compte.";
			showAlert( message );
			break;
		case 6: // no record of user found with that email
			message = "Cette adresse email n'est associé à aucun compte.";
			addErrorMessage( $( ".not-first-order .user-email" ), message );
			break;
		case 7: // order is empty or already sent : check your email or resubmit an order
			message = "Votre panier est vider. Votre commande a déjà peut-être été envoyer. Verifier vous emails.";
			showAlert( message );
			break;
		case 8: // invalid phone number
			message = "Ce numéro de téléphone n'est pas valide. Le format doit être le suivant: +33 6 12 34 56 78";
			addErrorMessage( $( ".first-order .user-phone" ), message );
			break;
		default: // unknown error
			message = "Il y a eut une error. Veuillez re-essayer dans quelques instants. Si le problème perciste contactez nous.";
			showAlert( message );
			console.log( data );
	}
}

function showAlert( message ) {
	$( ".alert-message" ).show();
	$( ".message" ).html( message );
}

function addErrorMessage( $input, message ) {
	$input.addClass( "error" );
	$input.after( "<error-message>" + message + "</error-message>" );
}

$( document ).ajaxError( function( event, jqxhr, settings, thrownError ) {
	errorHandling( -1, thrownError );
} );
