sap.ui.define([
	"zdashboardgcial/zdashboardgcial/util/gateway",
	"sap/ui/model/json/JSONModel"
], function (gateway, JSONModel) {
	"use strict";
	/* eslint-disable no-console */
	var mainService = "DASHBOARD_GERENCIAL";
	var vizFrame = {
		"TiempoCiclo": "vizFrameTiempoCiclo",
		"MetaDespacho": "vizFrameMetaDespacho",
		"CapacidadOciosa": "vizFrameCapacidadOciosa",
		"CapacidadOciosaTon": "vizFrameCapacidadOciosaTon",
		"AlistadoTransportes": "vizFrameAlistadoTransportes"
	};
	return {
		createTiempoCicloPopOver: function (centro, fechaDesde, fechaHasta, claseDocumento, object, sel) {
			var popUpTable = new sap.m.Table({});
			var data = sel[0].data.Chapacamion;
			var aData = [];

			var chapa = new sap.ui.model.Filter({
				path: "Chapacamion",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: data
			});

			gateway.read(mainService, object.popOverPath, {
					"filters": [chapa, centro, fechaDesde, fechaHasta, claseDocumento]
				})
				.then(function (res) {
					var responseSet = res.results;

					for (var i = 0; i < responseSet.length; i++) {
						aData.push({
							Transporte: responseSet[i].Transporte,
							Horas: responseSet[i].Horas
						});
					}

					var aColumnData = [{
						columnId: "Transporte"
					}, {
						columnId: "Horas"
					}];

					var oModel = new sap.ui.model.json.JSONModel();

					oModel.setData({
						columns: aColumnData,
						rows: aData
					});

					popUpTable.setModel(oModel);

					popUpTable.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().columnId
							}),
							hAlign: "Center"
						});
					});

					popUpTable.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();

						for (var k in obj) {
							row.addCell(new sap.m.Text({
								text: obj[k]
							}));
						}
						return row;
					});

					return popUpTable;
				})
				.catch(function (error) {
					error = error;
				});
			return popUpTable;
		},

		createCapacidadOciosaTonPopOver: function (centro, fechaDesde, fechaHasta, claseDocumento,object, sel) {
			var popUpTable = new sap.m.Table({});
			var filtro = sel[0].data.Estado;
			var aData = [];

			gateway.read(mainService, object.popOverPath, {
					"filters": [centro, fechaDesde, fechaHasta, claseDocumento]
				})
				.then(function (res) {
					var responseSet = res.results;

					for (var i = 0; i < responseSet.length; i++) {

						if (responseSet[i].Estado === filtro) {
							aData.push({
								Transporte: responseSet[i].Transporte,
								Kilos: responseSet[i].Kilos
							});
						}
					}

					var aColumnData = [{
						columnId: "Transporte"
					}, {
						columnId: filtro
					}];

					var oModel = new sap.ui.model.json.JSONModel();

					oModel.setData({
						columns: aColumnData,
						rows: aData
					});

					popUpTable.setModel(oModel);

					popUpTable.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().columnId
							}),
							hAlign: "Center"
						});
					});

					popUpTable.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();

						for (var k in obj) {
							row.addCell(new sap.m.Text({
								text: obj[k]
							}));
						}
						return row;
					});

					return popUpTable;
				})
				.catch(function (error) {
					// BusyIndicator.hide();
					error = error;
				});
			return popUpTable;
		},
		getMetaDespachoDataPointStyle: function () {
			var treeConfig = {
				rules: [{
					dataContext: {
						Cantidad: ""
					},
					properties: {
						color: "#3fa45b"
					},
					displayName: "<=180 Minutos"
				}, {
					dataContext: {
						Cantidad: ""
					},
					properties: {
						color: "sapUiChartPaletteSemanticCritical"
					},
					displayName: ">180 | <220 Minutos"
				}, {
					dataContext: {
						Cantidad: ""
					},
					properties: {
						color: "#dc0d0e"
					},
					displayName: ">=220 Minutos"
				}, {
					dataContext: {
						Cantidad: ""
					},
					properties: {
						color: "#AB218E"
					},
					displayName: "Promedio"
				}]
			};
			return treeConfig;
		},
		getAlistadoCustomPopOver: function (selection, odata) {

			var table = new sap.m.Table({});
			var filtro;
			var colorPopUp;
			if (selection[0].data.Estado === "Listo") {
				filtro = "01";
				colorPopUp = "#3fa45b"; //Verde
			} else if (selection[0].data.Estado === "Pendiente") {
				filtro = "02";
				colorPopUp = "#dc0d0e"; //Rojo
			} else if (selection[0].data.Estado === "EnProceso") {
				filtro = "03";
				colorPopUp = "#ffde08"; //Amarillo
			}

			var arrTransportes = [];

			for (var i = 0; i < odata.results.length; i++) {

				if (odata.results[i].Estado === filtro) {
					arrTransportes.push(odata.results[i].Transporte);
				}
			}

			var aColumnData = [{
				columnId: "Transportes - " + selection[0].data.Estado
			}];

			// Creacion de objeto JSON para el bind de la tabla pop-up
			var jsonArr = [];

			for (var j = 0; j < arrTransportes.length; j++) {
				jsonArr.push({
					Transporte: arrTransportes[j]
				});
			}

			var popModel = new sap.ui.model.json.JSONModel();
			popModel.setData({
				columns: aColumnData,
				rows: jsonArr
			});

			table.setModel(popModel);

			table.bindAggregation("columns", "/columns", function (index, context) {
				return new sap.m.Column({
					header: new sap.m.Label({
						text: context.getObject().columnId
					}),
					hAlign: "Center",
					footer: new sap.ui.core.Icon({
						src: "sap-icon://color-fill",
						color: colorPopUp
					})
				});
			});

			table.bindItems("/rows", function (index, context) {
				var obj = context.getObject();
				var row = new sap.m.ColumnListItem();
				for (var k in obj) {
					row.addCell(new sap.m.Text({
						text: obj[k]
					}));
				}
				return row;
			});
			return table;
		},

		createMetaDespachoCustomPopOver: function (centro, fechaDesde, fechaHasta, claseDocumento, object, sel) {

			var popUpTable = new sap.m.Table({});
			// var data = sel[0].data.Minutos;
			var data = sel[0].data.Cantidad;
			var aData = [],
				aColumnData;

			var chapa = new sap.ui.model.Filter({
				path: "Minutos",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: data
			});

			gateway.read(mainService, object.popOverPath, {
					"filters": [centro, fechaDesde, fechaHasta, chapa, claseDocumento]
				})
				.then(function (res) {
					var responseSet = res.results;

					for (var i = 0; i < responseSet.length; i++) {
						aData.push({
							Transporte: responseSet[i].Transporte,
							Minutos: responseSet[i].Minutos
						});
					}

					aColumnData = [{
						columnId: "Chapa Camión"
					}, {
						columnId: "Minutos"
					}];

					var oModel = new sap.ui.model.json.JSONModel();

					oModel.setData({
						columns: aColumnData,
						rows: aData
					});

					popUpTable.setModel(oModel);

					popUpTable.bindAggregation("columns", "/columns", function (index, context) {
						return new sap.m.Column({
							header: new sap.m.Label({
								text: context.getObject().columnId
							}),
							hAlign: "Center"
						});
					});

					popUpTable.bindItems("/rows", function (index, context) {
						var obj = context.getObject();
						var row = new sap.m.ColumnListItem();

						for (var k in obj) {
							row.addCell(new sap.m.Text({
								text: obj[k]
							}));
						}
						return row;
					});

					return popUpTable;
				})
				.catch(function (error) {
					error = error;
				});
			return popUpTable;

		},

		createCustomPopOver: function (centro, fechaDesde, fechaHasta, claseDocumento, object, sel) {
			var tablePopOver;
			switch (object.frameId) {
			case vizFrame.TiempoCiclo:
				tablePopOver = this.createTiempoCicloPopOver(centro, fechaDesde, fechaHasta, claseDocumento, object, sel);
				break;
			case vizFrame.MetaDespacho:
				tablePopOver = this.createMetaDespachoCustomPopOver(centro, fechaDesde, fechaHasta, claseDocumento, object, sel);
				break;
			case vizFrame.CapacidadOciosa:
				console.log("Capacidad Ociosa");
				break;
			case vizFrame.CapacidadOciosaTon:
				tablePopOver = this.createCapacidadOciosaTonPopOver(centro, fechaDesde, fechaHasta, claseDocumento, object, sel);
				break;
			case vizFrame.AlistadoTransportes:
				break;
			}
			return tablePopOver;
		}
	};

});