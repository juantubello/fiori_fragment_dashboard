sap.ui.define([
	"jquery.sap.global",
	"zdashboardgcial/zdashboardgcial/util/models",
	"sap/ui/model/Filter",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel"
], function(jQuery, models, Filter, ODataModel, ODataModelV2) {
	"use strict";
	return models.makeHelper("gateway").extend({
		
		"parseEntity": function(sEntity){
			if(!sEntity.match(/^[\/]{1}/)){
				sEntity = "/" +sEntity;
			}
			return sEntity;
		},
		
		"add": function(sName, sServiceUrl, mParams){
			var
				mParams = mParams || {};
			
			mParams.vertion = mParams.vertion || "odata";
			models.load(sName, sServiceUrl, mParams.vertion, mParams);
		},
		
		"read": function(sModelName, sEntity, mOptions){
			var oContext = this;
			return new Promise(function(fnSuccess, fnError){
				mOptions = jQuery.extend({}, mOptions) || {};
				
				mOptions.success = fnSuccess;
				mOptions.error = fnError;
				
				if(mOptions.useResponseBody){
					mOptions.success = function(oReciveData, oResponse){
						fnSuccess(oResponse.body);
					};
				}
				
				if(Array.isArray(mOptions.filters)){
					var 
						aFilters = [];
						
					mOptions.filters.forEach(function(vFilter){
						if(Array.isArray(vFilter)){
								if(!jQuery("meta[name=filtersoff]").get().length) vFilter[2] = location.href.match("localhost") ? vFilter[2] : vFilter[2];
														
							vFilter = new Filter(vFilter[0], vFilter[1], vFilter[2], vFilter[3]); 
						}
						
						aFilters.push(vFilter);
					});
					
					mOptions.filters = aFilters;
				}
				
				//sEntity = oContext.parseEntity(sEntity);
				
				models.get(sModelName).read(sEntity, mOptions);
				//sModelName
			});
		},
		
		"readV2": function(sModelName, sEntity, mOptions){
			return new Promise(function(fnSuccess, fnError){
				mOptions = jQuery.extend({}, mOptions) || {};
				mOptions.success = fnSuccess;
				mOptions.error = fnError;
				if(Array.isArray(mOptions.filters)){
					var aFilters = [];
					mOptions.filters.forEach(function(vFilter){
						if(Array.isArray(vFilter)){
							if(!jQuery("meta[name=filtersoff]").get().length) vFilter[2] = location.href.match("localhost") ? "'" +vFilter[2] +"'" : vFilter[2];
							vFilter = new Filter(vFilter[0], vFilter[1], vFilter[2], vFilter[3]); 
						}
						aFilters.push(vFilter);
					});
					mOptions.filters = aFilters;
				}
				sModelName.read(sEntity, mOptions);
			});
		},
		
		"create": function(sModelName, sEntity, oSendData){
			return new Promise(function(fnSuccess, fnError){
				var
					oModel = models.get(sModelName);
				
				switch(oModel.constructor){
					case ODataModel:
						oModel.create(sEntity, oSendData, null, fnSuccess, fnError);
						break;
					case ODataModelV2:
						oModel.create(sEntity, oSendData, {
							"success": fnSuccess,
							"error": fnError,
						});
						break;
					default:
						throw new Error("Modelo '" +sModelName +"' no valido para usar en esta funcion.")
						break;
				}
			});
		},
	
		
		"createV2": function(oModelName, sEntity, oSendData){
			return new Promise(function(fnSuccess, fnError){
				oModelName.create(sEntity, oSendData, null, fnSuccess, fnError);
			});
		}
	
	});
});