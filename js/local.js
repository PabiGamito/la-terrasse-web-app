
(function($) {

	'use strict';

	$('#contactForm:not([data-type=advanced])').validate({
		submitHandler: function(form) {

			var $form = $(form),
				$messageSuccess = $('#contactSuccess'),
				$messageError = $('#contactError'),
				$submitButton = $(this.submitButton);

			$submitButton.button('Envoi...');

			// Ajax Submit
			$.ajax({
				type: 'POST',
				url: '/ajax.php',
				data: {
					name: $form.find('#name').val(),
					email: $form.find('#email').val(),
					subject: $form.find('#subject').val(),
					message: $form.find('#message').val()
				},
				dataType: 'json',
				complete: function(data) {
				
					if (typeof data.responseJSON === 'object') {
						if (data.responseJSON.response == 'success') {

							$messageSuccess.removeClass('hidden');
							$messageError.addClass('hidden');

							// Reset Form
							$form.find('.form-control')
								.val('')
								.blur()
								.parent()
								.removeClass('has-success')
								.removeClass('has-error')
								.find('label.error')
								.remove();

							if (($messageSuccess.offset().top - 80) < $(window).scrollTop()) {
								$('html, body').animate({
									scrollTop: $messageSuccess.offset().top - 80
								}, 300);
							}

							$submitButton.button('reset');
							
							return;

						}
					}

					$messageError.removeClass('hidden');
					$messageSuccess.addClass('hidden');

					if (($messageError.offset().top - 80) < $(window).scrollTop()) {
						$('html, body').animate({
							scrollTop: $messageError.offset().top - 80
						}, 300);
					}

					$form.find('.has-success')
						.removeClass('has-success');
						
					$submitButton.button('reset');

				}
			});
		}
	});

}).apply(this, [jQuery]);