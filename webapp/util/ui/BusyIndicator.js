sap.ui.define("zdashboardgcial.zdashboardgcial.util.ui.BusyIndicator", [
	"sap/ui/core/BusyIndicator",
	"zdashboardgcial/zdashboardgcial/util/helper/element"
], function(BusyIndicator, element){
	"use strict";
	
	return {
		"show": function(){
			if(arguments.length){
				sap.m.MessageToast.show(arguments[0], {
					width: "100%",
					my: "center bottom",
					at: "center bottom"
				}); 
			}
			
			element.getPromise().then(function(){
				element.setBusy(true);
			});
			BusyIndicator.show();
		},
		"hide": function(){
			element.getPromise().then(function(){
				element.setBusy(false);
			});
			BusyIndicator.hide();
		}
	};
}, /* export = */ true);