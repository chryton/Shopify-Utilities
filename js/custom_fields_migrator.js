
///////////////
// Xerograph //
///////////////

var failedMetafields = [],
	metafieldToAdd = {},
	metafields = [];

// METAFIELD DATA EXAMPLE
// 	{
// 		"id": 27840432527,
// 		"namespace": "customizer_fields", ***
// 		"key": "Band_Customizer_Modules", ***
// 		"value": "[p]Comma separated list of modules: color, image, text, serialization, type", ***
// 		"value_type": "string", ***
// 		"description": null,
// 		"owner_id": 15814739,
// 		"created_at": "2017-02-16T11:13:11-08:00",
// 		"updated_at": "2017-02-17T11:23:50-08:00",
// 		"owner_resource": "shop" ***
// 	}
// 	*** = required fields

/**
 * Recursive job function
 * @return {null} No return; logs finish or adds another metafield
 */
function nextJobStep(){
	if (metafields.length){
		window.setTimeout(function(){
			addMetafield(metafields.pop());
		}, 180);
	} else {
		console.log(' ~~~~~ METAFIELD ADDITIONS COMPLETE ~~~~~ ');
		console.log('Total Metafields Run: ' + totalMetaFields);
		console.log('Metafields Failed: ' + failedMetafields.length);
		if (failedMetafields.length) {
			console.log('Failed Metafields:');
			console.log(failedMetafields);
		}
		console.log(' ~~~~~ ~~~~~ ~~~~~ ~~~~~ ~~~~~ ');
	}
}

/**
 * Adds a metafield + data to  the store
 * @param {object} metafieldData Metafield data object mimicking a Shopify Metafield
 */
function addMetafield(metafieldData){
	var fieldData = metafieldData,
		urlPart = "";

	if (fieldData.owner_resource === "product" || fieldData.owner_resource === "collection") {
		"/" + fieldData.owner_resource + "s/" + owner_id;
	}

	$.ajax({
		type: "POST",
		url: "/admin" + urlPart + "/metafields.json",
		data: {
			"metafield[namespace]": fieldData.namespace,
			"metafield[key]": fieldData.key,
			"metafield[value]": fieldData.value,
			"metafield[value_type]": fieldData.value_type
		}
	}).done(function(){

		nextJobStep();

	}).fail(function(e){
		fieldData['error_reason'] = JSON.parse(e.responseText).errors;
		failedMetafields.push(fieldData);

		nextJobStep();
	});
}

totalMetaFields = metafields.length;
metafieldToAdd = metafields.pop();

addMetafield(metafieldToAdd);