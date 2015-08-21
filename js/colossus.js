// main class
var colossus = function()
{
	var apiURL = "https://colossusdevtest.herokuapp.com/api/";
	var ready = false;

	var pools 	 	= {};	// list of pools
	var totLegs 	= 0; 	// amount of legs in the selected pool
	var userLegs 	= {};	// list of selected legs
	var totUserLegs = 0;	// amount of selected legs
	var bid 		= 0;	// value of the selected bid

	var init = function()	// init function, retrieve the list of pools
	{
		$.ajax({
			url: apiURL + "/pools.json",
			success: function(result)
			{
				groups = result[0].groups;

				for(var group in groups)
				{
					pools[groups[group].display_group_name] = [];

					for(var pool in groups[group].pools)
					{
						// group pools by id to make it easier to search
						var poolId = groups[group].pools[pool].id;
						pools[groups[group].display_group_name][poolId] = groups[group].pools[pool];
					}
				}

				// all data in place, trigger our ready variable
				ready = true;
			},
			error: function(err)
			{
				alert("Can't retrieve list of pools!");
			}
		});
	};

	var isResultReady = function() // check if the results are ready
	{
		if(ready)
		{
			return true;
		}
		return false;
	};

	var getPools = function() 		// get all pools
	{
		return pools;
	};

	var getLegs = function(id, callback) // get legs in a pool
	{
		$.ajax({
			url: apiURL + "/pools/" + id + ".json",
			success: function(result)
			{
				totLegs = result.legs.length;

				if(typeof callback === "function")
				{
					callback(result);
				}
			},
			error: function(err)
			{
				alert("Can't retrieve list of legs!");
			}
		});
	};

	var pushSelection = function(legId, selectionId) // push a leg into the user leg-selection object
	{
		if(typeof userLegs[legId] === "undefined")
		{
			userLegs[legId] = [];
		}

		userLegs[legId].push(selectionId);
		totUserLegs++;
	};

	var popSelection = function(legId, selectionId) // pop a leg from the user leg-selection object
	{
		var index = userLegs[legId].indexOf(selectionId);
		userLegs[legId].splice(index, 1);

		// delete the property if it's empty
		if(userLegs[legId].length === 0)
		{
			delete userLegs[legId];
		}
		totUserLegs--;
	};

	var getUserLegs = function()	// gets the list of selected legs
	{
		return userLegs;
	};

	var resetUserLegs = function()	// reset the list of legs
	{
		userLegs = {};
		totUserLegs = 0;
	};

	var getTotalUserLegs = function()	// get the amount of selected legs
	{
		return totUserLegs;
	};

	var setBet = function(value)	// sets the bet value in our local scope
	{
		bid = value;
	};

	var getTotalBet = function() 	// gets the total bet based on the amount of selected legs
	{
		var tot = parseFloat(bid) * totUserLegs;
		return tot.toFixed(2);
	};

	var getLines = function()		// retrieves the list of lines
	{
		var nSelectedLegs = 0;	// counter for the number of selected legs by the user
		var legsLength = [];	// array to contain the length of each leg

		for(var i in userLegs)
		{
			nSelectedLegs++;
			legsLength.push(userLegs[i].length);
		}

		// these 2 variables contain the amount of 1 or 2 selections
		var ones = 0;
		var twos = 0;

		// the user has selected less legs than the total amount
		if(nSelectedLegs !== totLegs)
		{
			return 0;
		}
		else
		{
			for(var i = 0; i < legsLength.length; i++)
			{
				if(legsLength[i] >= 2)
				{
					twos++;
				}
				else
				{
					ones++;
				}
			}

			// apply the conditions specified in the document. It doesn't say anything about more than 2 legs with 2 selections so let's assume that
			// it will also return 4 lines
			if(ones === totLegs) return 1;
			if(twos === 1 && (ones === totLegs-1)) return 2;
			if(twos >= 2) return 4;
			return 0;
		}
	};

	var placeBet = function()
	{
		var userBet = {
			selectionIds : userLegs,
			lines 		 : colossus.getLines(),
			cost 		 : getTotalBet
		};

		$.ajax({
			url: apiURL + "/pools.json",
			data: {
				bet: userBet
			},
			success: function(result)
			{
				alert("Your bet has been placed. Good luck!");
			},
			error: function(){
				alert("There was a problem placing your bet. Please try again later.");
			}
		});
	};

	// return public methods and properties
	return {
		init 				: init,				// initialize data
		isResultReady 		: isResultReady,	// check if the data after the first load is ready
		getPools			: getPools,			// get list of pools
		getLegs				: getLegs,			// get legs in a certain pool
		pushSelection 		: pushSelection,	// add a leg to the list of legs selected by the user
		popSelection		: popSelection,		// remove a leg from the list of legs selected by the user
		getUserLegs 		: getUserLegs,		// return all the selected legs by the user
		resetUserLegs 		: resetUserLegs,	// reset the list of legs selected by the user
		setBet 				: setBet,			// sets the selected bid
		getTotalBet			: getTotalBet,		// returns the selected bid multiplied by the number of selected legs
		getLines 			: getLines, 		// calculates the amount of lines
		placeBet 			: placeBet 			// places the bet
	};

}();