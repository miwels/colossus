$(function(){

	// init
	colossus.init();

	// cache pools once initialized
	var totPools;
	var totLegs;

	$('.pool-list').html("Loading list of pools...");

	// check if the list of pools is ready
	// It can also be done using a callback function
	var poolCounter = setInterval(function(){

		// if it's ready, append the list of pools
		if(colossus.isResultReady)
		{
			clearInterval(poolCounter);

			var output = "";
			totPools = colossus.getPools();

			for(var group in totPools)
			{
				output += '<h1>' + group + '</h1>';
				output += '<ul>';

				for(var pool in totPools[group])
				{
					output += '<li><a href="#" class="pool-details" data-pool-id="' + totPools[group][pool].id + '" data-pool-group="' + group + '">' + totPools[group][pool].name + ' - ' + totPools[group][pool].headline_prize +  '</a></li>';
				}

				output += '</ul>';
			}

			// once we have our list, display it
			$('.pool-list').html(output);
		}
	}, 1000);

	// bind event listener to detect when a pool is clicked
	$('body').on('click', '.pool-details', function(e){

		e.preventDefault();

		// make sure that we don't have residual data in our legs array
		colossus.resetUserLegs();

		// and reset the bid as well
		colossus.setBet(0);

		$('.total-bid').html("0.00");
		$('.total-lines').html("0");

		var poolGroup = $(this).data('pool-group');
		var poolId = $(this).data('pool-id');
		var currentPool = totPools[poolGroup][poolId];

		// print details
		displayPoolDetails(currentPool);

		// get list of legs
		colossus.getLegs(poolId, function(result){
			totLegs = result.legs;

			// print list of legs
			displayLegs(totLegs);
		});
	});

	// bind event every time a leg is clicked
	$('body').on('click', '.table-legs td', function(){

		var legId 		= $(this).data('leg-id');
		var selectionId = $(this).data('selection-id');

		if($(this).hasClass('active'))
		{
			$(this).removeClass('active');
			colossus.popSelection(legId, selectionId);
		}
		else
		{
			$(this).addClass('active');
			colossus.pushSelection(legId, selectionId);
		}

		// also, update the total bid and the amount of lines
		$('.total-bid').html(colossus.getTotalBet());
		$('.total-lines').html(colossus.getLines());
	});

	// bind event when the bid is placed
	$('body').on('click', '.bid', function(){
		colossus.setBet($(this).val());
		$('.total-bid').html(colossus.getTotalBet());
	});

	// bind event when the user tries to place a bet
	$('body').on('click', '.place-bet', function(){
		if(colossus.getTotalBet() == 0){
			alert("Please choose a leg and a bet!");
			return false;
		}

		colossus.placeBet();
	});
});