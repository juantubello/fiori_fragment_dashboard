sap.ui.define([
	"zdashboardgcial/zdashboardgcial/util/models"
], function(models){				
	return function(sName, vModel, bIgnoreRequestCompleted, fnFactoryPromise){
		return models.makeHelper(sName, vModel, bIgnoreRequestCompleted, fnFactoryPromise);
	};
})