sap.ui.define([
	"zdashboardgcial/zdashboardgcial/util/app/controller",
	"zdashboardgcial/zdashboardgcial/util/models"
], function(controller, /*user,*/  models) {
	"use strict";	
	return controller.extend("zdashboardgcial.zdashboardgcial.controller.App", {	
	
		"onInit": function(){
			
		},
		"onBeforeRendering": function(){},
		"onAfterRendering": function(){
			var
				oController = this,
				oView = oController.getView();
				oController.navTo("appMain");
		}
	});
})