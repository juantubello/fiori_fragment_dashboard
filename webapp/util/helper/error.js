sap.ui.define([
	"jquery.sap.global",
	"zdashboardgcial/zdashboardgcial/util/models",
	"zdashboardgcial/zdashboardgcial/model/makeHelper" 
], function(jQuery, models, makeHelper) {
	"use strict";
	var
		sNameHelper = "error",
		oModel = models.get(sNameHelper),
		bIgnoreRequestCompleted = true;
		
	return makeHelper(sNameHelper, oModel, bIgnoreRequestCompleted, function(error){
		error.setData({
			"page": {
				"messages": []
			}
		});
		
		error.extend({
			"add": function(){
				
			}
		});
		
		return error;
	});
});