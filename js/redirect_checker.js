/*
* Checks batches of Shopify paths for validity; usually used to validate final redirect paths.
* Requires: Underscore.JS, jQuery
*/

var urls = [
	[
		"/products/150-cases-only-closeout-cabernets-15-pack",
		"/products/2-free-bottles-mecedora-carmnre",
		"/products/2012-chateau-franc-cardinal-commemorative-wooden-box",
		"/products/50-cases-sensational-syrah-at-closeout-prices",
		"/products/at-cost-verdus-beer-12-pack",
		"/products/at-cost-verdus-beer-15-pack",
		"/products/cabernet-craze-15-pack",
		"/products/california-wines-15-pack-mixed-100-profits-donated",
		"/products/california-wines-15-pack-reds-100-profits-donated",
		"/products/california-wines-15-pack-whites-100-profits-donated",
		"/products/closeout-red-wine-15-pack-only-200-available",
		"/products/closeout-red-wine-15-pack-only-50-available",
		"/products/elun-cabernet",
		"/products/fifteen-fall-whites",
		"/products/finca-la-pintada-brut-ros-cava",
		"/products/flash-friday-bordeaux-grapes",
		"/products/founders-membership-special-offer",
		"/products/free-bottle-baywood-cellars-red-blend",
		"/products/granite-ridge-chenin-blanc-2015",
		"/products/groupon-cellar-reds-15-pack",
		"/products/groupon-cellar-reds-15-pack",
		"/products/groupon-cellar-reds-18-pack",
		"/products/groupon-cellar-reds-18-pack",
		"/products/groupon-european-dreaming-15-pack-mixed",
		"/products/groupon-european-dreaming-15-pack-reds",
		"/products/groupon-european-dreaming-15-pack-whites",
		"/products/groupon-european-dreaming-18-pack-mixed",
		"/products/groupon-european-dreaming-18-pack-reds",
		"/products/groupon-european-dreaming-18-pack-white",
		"/products/groupon-fall-reds-15-pack",
		"/products/groupon-fall-reds-with-critics-trio-15-pack",
		"/products/groupon-world-of-cabernet-with-premium-trio-15-pack",
		"/products/groupon-world-of-chardonnay-15-pack",
		"/products/groupon-zaca-mesa-12-pack",
		"/products/groupon-zaca-mesa-15-pack",
		"/products/halloween-giveaway-weekend-mixed",
		"/products/halloween-giveaway-weekend-reds",
		"/products/halloween-giveaway-weekend-whites",
		"/products/halloween-giveaway-weekend-mega-pack-mixed",
		"/products/halloween-giveaway-weekend-mega-pack-reds",
		"/products/halloween-giveaway-weekend-mega-pack-whites",
		"/products/halloween-party-wines-15-pack-mixed",
		"/products/halloween-party-wines-15-pack-red",
		"/products/halloween-party-wines-15-pack-white",
		"/products/halloween-party-wines-mega-18-pack-mixed",
		"/products/halloween-party-wines-mega-18-pack-reds",
		"/products/halloween-party-wines-mega-18-pack-whites",
	],
	[
		"/products/holiday-weekend-special-18-pack-mixed",
		"/products/holiday-weekend-special-18-pack-reds",
		"/products/holiday-weekend-special-18-pack-whites",
		"/products/instant-vineyard-upgrade-15-pack-mixed",
		"/products/instant-vineyard-upgrade-15-pack-reds",
		"/products/instant-vineyard-upgrade-15-pack-whites",
		"/products/labor-day-blowout-15-pack-reds",
		"/products/luna-rosso",
		"/products/magnifico-montepulciano-dabruzzo",
		"/products/paseo-del-sol-tannat",
		"/products/placer-andaluz-tempranillosyrah-2015",
		"/products/radford-dale-chardonnay",
		"/products/splash-overstock-15-pack-mystery-gift-mixed",
		"/products/splash-overstock-15-pack-mystery-gift-reds",
		"/products/splash-overstock-15-pack-mystery-gift-whites",
		"/products/splash-wines-welcome-15-pack-mixed",
		"/products/splash-wines-welcome-15-pack-reds",
		"/products/splash-wines-welcome-15-pack-whites",
		"/products/tapaculo-merlot-2015",
		"/products/tapaculo-syrah",
		"/products/the-12-bottle-spectacular-mixed",
		"/products/the-12-bottle-spectacular-red",
		"/products/the-12-bottle-spectacular-white",
		"/products/the-15-bottle-spectacular-mixed",
		"/products/the-15-bottle-spectacular-reds",
		"/products/the-15-bottle-spectacular-whites",
		"/products/the-hunt-for-october-reds-cellar-25-splash-cash-back",
		"/products/the-hunt-for-october-reds-discovery-10-back-in-splash-cash",
		"/products/the-hunt-for-october-reds-vineyard-15-back-in-splash-cash",
		"/products/the-splash-difference-zaca-mesa-12-pack-mixed",
		"/products/the-splash-difference-zaca-mesa-12-pack-reds",
		"/products/the-splash-difference-zaca-mesa-12-pack-whites",
		"/products/the-splash-staff-fall-faves-15-pack-mixed",
		"/products/the-splash-staff-fall-faves-15-pack-red",
		"/products/the-splash-staff-fall-faves-15-pack-white",
		"/products/the-wide-world-of-syrahshiraz-15-pack",
		"/products/welcome-to-splash-with-zaca-mesa-upgrade-18-pack-mixed",
		"/products/welcome-to-splash-with-zaca-mesa-upgrade-18-pack-reds",
		"/products/welcome-to-splash-with-zaca-mesa-upgrade-18-pack-white",
		"/products/yapa-cabernet-sauvignon",
		"/products/yapa-carmnre",
		"/products/yapa-chardonnay",
		"/products/yapa-sauvignon-blanc",
		"/products/zaca-mesa-cuvee-red",
		"/products/zaca-mesa-syrah",
		"/products/zaca-mesa-viognier",
		"/products/zaca-mesa-white"
	]
],
failedUrls = [];

/**
 * Determines whether to check more URLs or finish
 * @return {[type]} [description]
 */
function nextJobStep() {
	if (urls.length > 0){
		window.setTimeout(function(){
			var next = urls.pop();
			openRedirects(next);
		}, 500);
	} else {
		console.log('~~~~~~~~~~');
		console.log('~~~~~~~~~~');
		console.log('URL CHECKING DONE');
		console.log("failed urls:");
		console.log(failedUrls);
		console.log('~~~~~~~~~~');
		console.log('~~~~~~~~~~');
	}
}


/**
 * Checks redirects and stores failed links
 * @param  {array} urlsArray  	Array of arrays of paths to check; this is to help cut down on the request limit from Shopify
 * @return {null}           	On completion runs nextJobStep() to proceed
 */
function openRedirects(urlsArray) {
	_.each(urlsArray, function(data, index, list){
		var url = data,
			currIndex = index,
			olist = list;

		$.ajax({
			url: data + ".json",
			cache: false,
			type: "GET",
			dataType: "json"
		}).done(function(res){
			console.log(res);
			if (currIndex == (olist.length - 1)){
				nextJobStep();
			}
		}).fail(function(res){
			failedUrls.push(url);
			if (currIndex == (olist.length - 1)){
				nextJobStep();
			}
		});
	});
}

var start = urls.pop();

openRedirects(start);
