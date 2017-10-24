/*
* Checks batches of Shopify paths for validity; usually used to validate final redirect paths.
* Requires: Underscore.JS, jQuery
*/

var urls = [ // Array of arrays of links to check. This is to help cut down on the request limit from Shopify rejecting too many hits in a short amoutn of time
	[
		"/pages/page-handle",
		"/pages/page-handle",
		"/pages/page-handle",
		"/pages/page-handle",
	],
	[
		"/products/product-handle",
		"/products/product-handle",
		"/collections/collection-handle",
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
 * @param  {array} urlsArray  	Array of paths to check
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
