/****************************************************************
 * 					List of display functions 					*
 ****************************************************************/

/**
 *	Print pool details in a nice format
 *
 * 	@param {obj} 	pool 	object with all the pool properties
 */
function displayPoolDetails(pool)
{
	$('.pool-name').html(pool.name);
	$('.pool-currency').html(pool.currency);
	$('.pool-has-offers').html(pool.has_offers);
	$('.pool-headline-prize').html(pool.headline_prize);
	$('.pool-sport-code').html(pool.sport_code);
	$('.pool-status').html(pool.status);

	$('.pool-details-wrapper').show();
	$('.controls').show();
}

/**
 * 	Print list of legs in a nice format
 *
 * 	@param {obj} 	legs 	object containing the list of legs
 */
function displayLegs(legs)
{
	var output = '<table class="table-legs">';

	for(var leg in legs)
	{
		output += '<tr>';

		var selections = legs[leg].selections;

		for(var i = 0; i < selections.length; i++)
		{
			output += '<td data-leg-id="' + legs[leg].id + '" data-selection-id="' + selections[i].id + '">' + selections[i].name + '</td>';
		}
		output += '</tr>';
	}

	output += '</table>';
	$('.legs-list').html(output);
}