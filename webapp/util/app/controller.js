sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"zdashboardgcial/zdashboardgcial/util/ui/BusyIndicator",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/m/TableSelectDialog",
	"zdashboardgcial/zdashboardgcial/util/models",
	"zdashboardgcial/zdashboardgcial/util/gateway",
	
	"zdashboardgcial/zdashboardgcial/util/helper/promise"
], function (UIComponent, Controller, History, BusyIndicator, Filter, MessageBox, MessagePopover, MessagePopoverItem, TableSelectDialog, models, gateway, promise /*user*/) {
	"use strict";

	return Controller.extend("zdashboardgcial.zdashboardgcial.util.app.controller", { 
		"onNavBack": function() {
			var
				oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.back();
			} else {
				this.getRouter().navTo("appMain", {}, false /*no history*/);
			}
		},

		"getRouter": function () {
			return UIComponent.getRouterFor(this);
		},
		
		"navTo": function(sNavTo){
			this.getRouter().navTo(sNavTo);
		},
		
		"getRoute": function(sName){
			return this.getRouter().getRoute(sName);
		},
		/*
		"getResourceBundle": function(){
			return this.getView().getModel("i18n").getResourceBundle();
		},*/
		
		"getResourceBundle" : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		"setTimeout": function(nSecons){
			var
				nMiniSecons = ( nSecons || 0 ) * 1000;
			
			return new Promise(function(fnReady){
				setTimeout(fnReady, nMiniSecons);
			});
		},
		
		"showBusyIndicator": function(){
			BusyIndicator.show();
		},

		"hideBusyIndicator": function(nSecons, vData){
			return this.setTimeout(nSecons)
			
			.then(function(){
				BusyIndicator.hide();
				return vData;
			});
		},
		
		
		"onLiveChangeAmount": function(oEvent){
			var
				oSource = oEvent.getSource(),
				sValue = oSource.getValue(),
				sNumber = sValue.replace(/\./g, '').replace(/\,/, '.'),
				nNumber = Number(sNumber);
			
			if(!sNumber || isNaN(nNumber)){
				var
					sInvalidValue = sValue;
					
				if(!sNumber){
					sValue = "0";
					sInvalidValue = "vacio";
				}
				
				if(sValue.match(/[\-]{1,}/)){
					sValue = sValue.charAt(0) + sValue.substring(1).replace(/\-/g, '');
				}
				
				oSource.setValue(sValue.replace(/[^0-9\,\.\-]{1,}/g, ''));
				sap.m.MessageToast.show("Solo se permiten Valores Numericos, "+sInvalidValue +" no una entra valida.");
			}
		},
		
		"formatterNum": function(nNumber){
			var oLocale = new sap.ui.core.Locale("es-ES");
			var oFormatOptions = {
			    minIntegerDigits: 1,
			    maxIntegerDigits: 10,
			    minFractionDigits: 2,
			    maxFractionDigits: 2
			};
			 
			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			return oFloatFormat.format(nNumber);
		},
		
		"formatterNumTipoCambio": function(nNumber){
			var oLocale = new sap.ui.core.Locale("es-ES");
			var oFormatOptions = {
			    minIntegerDigits: 1,
			    maxIntegerDigits: 10,
			    minFractionDigits: 2,
			    maxFractionDigits: 2 //5
			};
			 
			var oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			return oFloatFormat.format(nNumber);
		},
		
		"formatterBalance": function(vBalance){
			return this.formatterNum(vBalance);
		},
		
		"getTableSelectedRows": function(oTable, bUsePromise){
			try{
				var
					aRows = [],
					oBinding = oTable.getBinding(),
					oList = oBinding.oList,
					aIndices = oBinding.aIndices,
					aSelectedIndices = oTable.getSelectedIndices();
					
				if(aSelectedIndices.length){
					aRows = aSelectedIndices.map(function(cIndex){
						cIndex = aIndices[cIndex];
						return oList[cIndex];
					});
				}
			}catch(oError){
				if(bUsePromise){
					return Promise.reject(oError);
				}else{
					throw oError;
				}
			}
			
			return bUsePromise ? Promise.resolve(aRows) : aRows;
		}
		
	});
})