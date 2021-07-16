sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (e, t) {
	"use strict";
	return e.extend("zpickr.controller.Details", {
		onInit: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("PutawayModel"));
			this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onRoutMatched, this)
		},
		_onRoutMatched: function (e) {
			var t = e.getParameters().arguments.yard;
			var n = e.getParameters().arguments.route_id;
			var r = e.getParameters().arguments.tu_num_ext;
			this.getView().byId("idObjHeader").setTitle("#" + r);
			if (t != undefined && n != undefined && r != undefined) {
				var o = this.getOwnerComponent().getModel();
				o.read("/ZEWM_CDS_PICK_PROG", {
					urlParameters: {
						$filter: "yard eq '" + t + "'and route_id eq '" + n + "'and tu_num_ext eq '" + r + "'",
						$expand: "toItems"
					},
					success: $.proxy(function (e) {
						this.getView().getModel("LocalDataModel").setProperty("/ItemModel", e.results[0].toItems.results)
					}, this),
					error: function () {}
				})
			}
		},
		onNavBack: function (e) {
			this.getOwnerComponent().getRouter().navTo("Home", {}, true)
		}
	})
});