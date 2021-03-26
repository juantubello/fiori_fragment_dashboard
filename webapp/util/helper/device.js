sap.ui.define([
	"jquery.sap.global",
	"sap/ui/Device",
	"zdashboardgcial/zdashboardgcial/util/models",
	"zdashboardgcial/zdashboardgcial/model/makeHelper" 
], function(jQuery, Device, models, makeHelper) {
	"use strict";
	var
		sNameHelper = "device",
		sNameModel = sNameHelper,
		bIgnoreRequestCompleted = true;
	
	return makeHelper(sNameHelper, sNameModel, bIgnoreRequestCompleted, function(device){
		var
			list = {};
			
		list.events = {};
		list.events.resize = [];
		
		device.setData(Device);
		
		function onResize(){
			list.events.resize.map(function(callback){
				callback(Device.resize.width, Device.resize.height);
			});
		}
		
		Device.resize.attachHandler(onResize);
		
		jQuery.each({
			"isCombi": "combi",
			"isDesktop": "desktop",
			"isPhone": "phone",
			"isTablet": "tablet"
		}, function(sName, sKey){
			device[sName] = function(){
				return Device.system[sKey];
			};
		});
		
		device.extend({
			
			"resize": function(callback){
				list.events.resize.push(callback);
			},
			
			"fixedResize": onResize,
			
			"removeAllEvents": function(){
				sap.ui.Device.resize.detachHandler(onResize);
			}
			
		});
		
		return device;
	});
})