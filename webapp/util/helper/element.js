sap.ui.define([
	"jquery.sap.global",
	"zdashboardgcial/zdashboardgcial/util/models",
	"zdashboardgcial/zdashboardgcial/util/helper/device",  
	"zdashboardgcial/zdashboardgcial/model/makeHelper" 
], function(jQuery, models, /*user,*/ device, makeHelper) {
	"use strict";
	var
		sNameHelper = "element",
		sNameModel = sNameHelper,
		bIgnoreRequestCompleted = true;
		
	return makeHelper(sNameHelper, sNameModel, bIgnoreRequestCompleted, function(element){	
		element.setData({
			"isBusy": false,
			"header": {
				"text": {
					"type":null
				},
				"content": {
					"buttonSave": {
						"visible": false
					}
				}
			},
			"table": {
				"main": {
					"visibleRowCount":"9"
				}
			},
			"fileUploader": {
				"csv": {
					"fileType": ["csv"]
				}
			},
			"mainTiles": {
				"container": {
					"width": 1000
				},
				"tile": {
					"widthPercentage": 30
				}
			}
		});
		
		element.setBusy = function(bBusy){
			element.setProperty("/isBusy", Boolean(bBusy));
		};
	});
})