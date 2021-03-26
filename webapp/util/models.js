sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/xml/XMLModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/Device"
], function(jQuery, XMLModel, JSONModel, ODataModel, ODataModelV2, Device) {
	"use strict";
	/* eslint-disable no-console */
	var oDeferred, models = {},list = {};
	
	list.models = {};
	list.dependents = [null];
	
	models.extend = jQuery.extend;
	
	models.addDependent = function(oElement){
		list.dependents.push(oElement);
	};
	
	models.setComponent = function(oComponent){
		console.log("Model: set component - " + new Date());
		oDeferred = new jQuery.Deferred();
		list.dependents[0] = oComponent;
	};
	
	models.resetAllHelpers = function(){
		jQuery.each(models.helper, function(sName, oHelper){
			if(oHelper.reset) oHelper.reset();
		});
	};
	
	models.getPromise = function(){
		return new Promise(function(fnResolve){
			oDeferred.then(fnResolve);
		});
	};
	
	models.start = function(){
		console.log("Model: start - " + new Date());
		oDeferred.resolve();
		
		return models.getPromise();
	};
	
	/* Get Models */
	models.extend({
		
		"load": function(sName, vData, sType, mParams){
			var oModel;
			
			sType = sType || "json";
			mParams = mParams || {};
			
			switch(sType){
				case "xml":
					oModel = new XMLModel(vData);
					break;
			
				case "json":
					oModel = new JSONModel(vData);
					break;
					
				case "odata":
					oModel = new ODataModel(vData, mParams);
					break;
					
				case "odatav2":
					oModel = new ODataModelV2(vData, mParams);
					break;
					
				default:
					throw new Error("Tipo invalido");
					break;
			}
			
			list.models[sName] = oModel;
			
			return oModel;
		},

		"exists": function(sName){
			var
				oModel;
				
			if(sName in list.models){
				oModel = list.models[sName];
			}else if(list.dependents.length){
				jQuery.each(list.dependents, function(cKey){
					if((oModel = list.dependents[cKey].getModel(sName))){
						return false;
					}
				});
			}
			
			return typeof oModel !== "undefined";
		},
		
		"get": function(sName){
			var
				oModel;
				
			if(sName in list.models){
				oModel = list.models[sName];
			}else if(list.dependents.length){
				jQuery.each(list.dependents, function(cKey){
					if((oModel = list.dependents[cKey].getModel(sName))){
						return false;
					}
				});
			}
			
			if(typeof oModel === "undefined"){
				throw new Error("El modelo '"+sName+"' no existe.");
			}

			return oModel;
		},
		
		"setIn": function(oElement, sName){
			oElement.setModel(models.get(sName));
		},
		
		"setListIn": function(oElement, sList){
			sList.map(function(sName){
				oElement.setModel(models.get(sName), sName);
			});
		},
		
		"setProperty": function(sName, sProperty, oValue){
			return models.get(sName).setProperty(sProperty, oValue);
		},
		
		"getProperty": function(sName, sProperty){
			return models.get(sName).getProperty(sProperty);
		},
		
		"denyProperty": function(sName, sProperty){
			var
				oValue = models.get(sName).getProperty(sProperty);
			
			models.get(sName).setProperty(sProperty, !oValue);
			
			return oValue;
		},
	
		"getVersion": function(oModel){
			switch(oModel.constructor){
				case ODataModel:
					return 1;
					break;
				case ODataModelV2:
					return 2;
					break;
			}
		},
		"createDeviceModel" : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		"createFLPModel" : function () {
			var fnGetuser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
				bIsShareInJamActive = fnGetuser ? fnGetuser().isJamActive() : false,
				oModel = new JSONModel({
					isShareInJamActive: bIsShareInJamActive
				});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	});
	
	models.extend({
		
		"helper": {},
		
		"makeHelper": function(sName, vModel, bIgnoreRequestCompleted, fnFactoryPromise){
			var
				oHelper = {};
			
			oHelper.extend = jQuery.extend;
			
			models.helper[sName] = oHelper;
			
			oHelper.getModel = function(){
				if(typeof vModel === "string"){
					return models.get(vModel);
				}
				
				return vModel;
			};
			
			if(typeof bIgnoreRequestCompleted !== "boolean"){
				fnFactoryPromise = bIgnoreRequestCompleted;
				bIgnoreRequestCompleted = false;
			}
			
			if(typeof vModel !== "undefined"){
				var
					pModel = new Promise(function(fnResolve, fnError){
						var
							fnSuccess = fnResolve.bind(null, oHelper.getModel());
						
						if(bIgnoreRequestCompleted){
							fnSuccess();
						}else{
							oHelper.getModel().attachRequestCompleted(fnSuccess);
						}
					});
					
				oHelper.extend({
					"getModelPromise": function(){
						return models.getPromise().then(function(){
							return pModel;
						});
					},
					"getProperty": function(sName){
						return this.getModel().getProperty(sName);
					},
					"setProperty": function(sName, vValue){
						return this.getModel().setProperty(sName, vValue);
					},
					"getData": function(vData){
						return this.getModel().getData(vData);
					},
					"setData": function(vData){
						return this.getModel().setData(vData);
					}
				});
				
				oHelper.reset = function(){
					if(typeof fnFactoryPromise === "function"){
						var
							pHelper = oHelper.getModelPromise().then(function(){
								return fnFactoryPromise(oHelper);
							});
							
						oHelper.getPromise = function(){
							return pHelper;
						};
					}
				}
				oHelper.reset();
			}
			
			return oHelper;
		},
		
		"getHelper": function(sName){
			jQuery.sap.require("Cluster.model.helper".concat(".", sName));						
			return models.helper[sName];
		}
		
	});
	
	return models;
});