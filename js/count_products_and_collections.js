var total_products = 0,
	total_collections = 0;

function grab_products(index){

	var next_index = index + 1;

	$.ajax({
		"url": "/admin/products.json?page=" + index,
		"type": "GET"
	}).done(function(res){

		total_products += res.products.length;

		if (res.products.length < 50){
			grab_collections(1);
		} else {
			console.log("Working on products" + Array(next_index).join("."));
			grab_products(next_index);
		}
	});
}

function grab_collections(index){

	var next_index = index + 1;

	$.ajax({
		"url": "/admin/collections.json?page=" + index,
		"type": "GET"
	}).done(function(res){

		total_collections += res.collections.length;

		if (res.collections.length < 50){
			console.info('%cTotal Products: %c' + total_products, 'background: #222; color: #f8bc15; font-size: 24px; font-weight: bold; padding: 5px 0 5px 25px;', 'background: #222; color: #f8bc15; font-size: 24px; font-style: italic; padding: 5px 25px 5px 0;');
			console.info('%cTotal Collections: %c' + total_collections, 'background: #222; color: #f8bc15; font-size: 24px; font-weight: bold; padding: 5px 0 5px 25px;', 'background: #222; color: #f8bc15; font-size: 24px; font-style: italic; padding: 5px 25px 5px 0;');
		} else {
			console.log("Working on collections" + Array(next_index).join("."));
			grab_collections(next_index);
		}
	});
}

console.clear();
grab_products(1);
