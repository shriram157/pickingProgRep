sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/util/Export", "sap/ui/core/util/ExportTypeCSV"], function (e, t, o) {
	"use strict";
	var i;
	return e.extend("zpickr.controller.Home", {
		onInit: function () {
			var e = this.getOwnerComponent().getModel("VarientModel");
			try {
				var t = "/sap/bc/ui2/start_up";
				var o = null;
				o = new XMLHttpRequest;
				o.onreadystatechange = function () {
					if (o.readyState == 4 && o.status == 200) {
						var e = JSON.parse(o.responseText);
						console.log(e)
					}
				};
				o.open("GET", t, false);
				o.send(null);
				console.log(o.responseText.slice(o.responseText.search("id"), o.responseText.search("language")).substr(5, o.responseText.slice(
					113, 128).length - 12));
				var r = o.responseText.split(",");
				i = r[7].substr(6, r[7].length - 7)
			} catch (e) {
				console.log("Caught")
			}
			var r = this.getView();
			var n = this.getOwnerComponent().getModel("wareHouseNo").sServiceUrl;
			var l = "/ZEWM_CDS_WHNO?$filter=spras eq 'EN'";
			n = n + l;
			$.ajax({
				url: n,
				type: "GET",
				datatype: "json",
				contentType: "application/json",
				headers: {
					Accept: "application/json; odata=verbose"
				},
				beforeSend: function (e) {
					e.setRequestHeader("Accept", "application/json; odata=verbose")
				},
				success: function (e) {
					var t = new sap.ui.model.json.JSONModel;
					t.setData(e.d.results);
					r.byId("idYard").setModel(t, "WareHouseData")
				},
				error: function (e) {}
			});
			e.read("/VariantPickingSet", {
				urlParameters: {
					$filter: "UserId eq '" + i + "'"
				},
				success: $.proxy(function (t) {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VariantPickingSet", t.results);
					e.read("/VariantPickingSet", {
						urlParameters: {
							$filter: "UserId eq '" + i + "' and DefaultVariantKey eq 'X'"
						},
						success: $.proxy(function (e) {
							this.getView().setModel(this.getOwnerComponent().getModel("PutawayModel"));
							this._ModelServiceCall();
							if (e.results.length > 0) {
								var t = this.getView().byId("vm");
								this.getOwnerComponent().getModel("LocalDataModel").setProperty("/DefVar", e.results[0].VariantName);
								this.getView().byId("idYard").setSelectedKey(e.results[0].Whno);
								this.getView().byId("idRoute").setSelectedKey(e.results[0].Route);
								var o = new Date(e.results[0].TruckDepartureTime);
								var i = o.getFullYear() + "-" + (o.getMonth() + 1) + "-" + o.getDate();
								this.getView().byId("idCompletionTime").setValue(i);
								if (e.results[0].HideChkbox === "X") {
									this.getView().byId("idCheckBoxMarked").setSelected(true)
								} else {
									this.getView().byId("idCheckBoxMarked").setSelected(false)
								}
							}
							var r = this.getView();
							this._timeStampCall();
							var n = new sap.ui.model.json.JSONModel;
							n.setData({
								dateFormatDRS1: "yyyy-MM-dd HH:mm:ss",
								dateValueDRS2: new Date(2018, 1, 1),
								secondDateValueDRS2: new Date,
								dateMinDRS2: (new Date).toDateString() + " " + (new Date).toLocaleTimeString(),
								dateMaxDRS2: new Date
							});
							this.getView().setModel(n, "DateModel");
							var l = new sap.ui.model.json.JSONModel;
							l.setData({
								dateFormatDRS1: "yyyy-MM-dd HH:mm:ss",
								dateValueDRS2: new Date(2018, 1, 1),
								secondDateValueDRS2: null,
								dateMinDRS2: new Date,
								dateMaxDRS2: new Date
							});
							this.getView().setModel(l, "DateModel01");
							var s = {
								multiheader1: [3, 1],
								multiheader2: [2, 1],
								multiheader3: [6, 1],
								rowCount: 0
							};
							this.getView().setModel(new sap.ui.model.json.JSONModel(s), "multiHeaderConfig");
							var a = this.getOwnerComponent().getModel("PutawayModel");
							var _ = [];
							var p = [];
							var M = [];
							var g = [];
							a.read("/ZEWM_CDS_PICK_PROG", {
								success: $.proxy(function (e) {
									var t = e.results;
									for (var o = 0; o < t.length; o++) {
										if (_.indexOf(t[o].yard) < 0 && !$.isEmptyObject(t[o].yard)) {
											_.push(t[o].yard)
										}
										if (p.indexOf(t[o].route_id) < 0 && !$.isEmptyObject(t[o].route_id)) {
											p.push(t[o].route_id)
										}
									}
									for (var i = 0; i < _.length; i++) {
										M.push({
											yard: _[i]
										})
									}
									for (var r = 0; r < p.length; r++) {
										g.push({
											route_id: p[r]
										})
									}
									this.getOwnerComponent().getModel("LocalDataModel").setProperty("/RouteData", g)
								}, this),
								error: function () {}
							});
							this.getOwnerComponent().getModel("LocalDataModel").setProperty("/enableBusy", false)
						}, this)
					})
				}, this)
			})
		},
		onSave: function () {
			var e = this.getView().byId("idYard").getSelectedKey();
			var t = this.getView().byId("idRoute").getSelectedKey();
			var o = this.getView().byId("idCompletionTime").getValue();
			if (o == "") {
				var r = null
			} else {
				var n = new Date(o).getTime();
				var l = "/Date(";
				var s = ")/";
				var r = l.concat(n.toString(), s)
			}
			var a;
			var _;
			if (this.getView().byId("idCheckBoxMarked").getSelected()) {
				_ = "X"
			} else {
				_ = ""
			}
			var p = this.getView().byId("vm");
			if (p.oSelectedItem) {
				var M = p.oSelectedItem.mProperties.text;
				console.log(M);
				if (p.oDefault.mProperties.selected) {
					a = "X"
				} else {
					a = ""
				}
			}
			var g = this.getOwnerComponent().getModel("VarientModel");
			var u = {
				Whno: e,
				Route: t,
				HideChkbox: _,
				UserId: i,
				VariantName: M,
				DefaultVariantKey: a,
				TruckDepartureTime: r
			};
			g.create("/VariantPickingSet", u, {
				success: $.proxy(function (e, t) {
					console.log(e, t)
				}, this)
			});
			g.read("/VariantPickingSet", {
				urlParameters: {
					$filter: "UserId eq '" + i + "'"
				},
				success: $.proxy(function (e) {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/VariantPickingSet", e.results)
				}, this)
			})
		},
		onSelect: function () {
			this.getView().byId("idYard").setSelectedKey("");
			this.getView().byId("idRoute").setSelectedKey("");
			this.getView().byId("idCompletionTime").setValue("");
			this.getView().byId("idCheckBoxMarked").setSelected(false);
			var e = this.getOwnerComponent().getModel("VarientModel");
			var t = this.getView().byId("vm");
			if (t.lastSelectedVariantKey === "*standard*") {
				this.getView().byId("idYard").setSelectedKey("");
				this.getView().byId("idRoute").setSelectedKey("");
				this.getView().byId("idCompletionTime").setValue("");
				this.getView().byId("idCheckBoxMarked").setSelected(false)
			} else {
				if (t.oSelectedItem) {
					var o = t.oSelectedItem.mProperties.text;
					console.log(o);
					e.read("/VariantPickingSet", {
						urlParameters: {
							$filter: "UserId eq '" + i + "' and VariantName eq '" + o + "'"
						},
						success: $.proxy(function (e) {
							console.log(e);
							this.getView().byId("idYard").setSelectedKey(e.results[0].Whno);
							this.getView().byId("idRoute").setSelectedKey(e.results[0].Route);
							var t = new Date(e.results[0].TruckDepartureTime);
							var o = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
							if (t.getTime() === 0) {
								this.getView().byId("idCompletionTime").setValue("")
							} else {
								this.getView().byId("idCompletionTime").setValue(o)
							}
							if (e.results[0].HideChkbox === "X") {
								this.getView().byId("idCheckBoxMarked").setSelected(true)
							} else {
								this.getView().byId("idCheckBoxMarked").setSelected(false)
							}
						}, this)
					})
				}
			}
		},
		onSearch: function (e) {
			var t = this.getView().byId("idYard").getSelectedKey();
			if (this.getOwnerComponent().getModel("LocalDataModel")) {
				this.getOwnerComponent().getModel("LocalDataModel").setProperty("/oWarehouseNum", t)
			}
			this.getOwnerComponent().getModel("LocalDataModel").setProperty("/enableBusy", true);
			var o = this.getOwnerComponent().getModel("PutawayModel");
			var i = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMddHHMMSS"
			});
			var r = [];
			var t = this.getView().byId("idYard");
			var n = t.getSelectedKey() || this.getView().byId("idYard").getValue();
			var l = this.getView().byId("idRoute").getSelectedKey() || this.getView().byId("idRoute").getValue();
			var s = this.getView().byId("idCompletionTime").getValue();
			var a = i.parse(s);
			var _ = i.format(a);
			var p = _.substr(0, 8);
			var M = p + 235900;
			var g = this.getView().byId("idCheckBoxMarked").getSelected();
			var u;
			if (!g) {
				g = false
			}
			if (!s) {
				s = ""
			}
			if (!g && s == "") {
				sap.m.MessageToast.show("Enter Date or mark Hide TUs checkbox");
				return
			}
			var d;
			if (n == "") {
				this.getView().byId("idPickingStrip").setProperty("visible", true);
				this.getView().byId("idPickingStrip").setText("Please Select Warehouse Number");
				this.getView().byId("idPickingStrip").setType("Error");
				t.setValueState(sap.ui.core.ValueState.Error);
				r = [];
				this.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 0)
			} else if (n != "" && s == "" && l == "") {
				this.getView().byId("idPickingStrip").setProperty("visible", false);
				d = "yard eq '" + n + "'"
			} else if (n != "" && s != "" && l == "") {
				this.getView().byId("idPickingStrip").setProperty("visible", false);
				d = "yard eq '" + n + "'and (Truck_Departure_Time ge'" + _ + "'and Truck_Departure_Time le '" + M + "')"
			} else if (n != "" && l != "" && s == "") {
				this.getView().byId("idPickingStrip").setProperty("visible", false);
				d = "yard eq '" + n + "'and route_id eq '" + l + "'"
			} else if (n != "" && l != "" && s != "") {
				this.getView().byId("idPickingStrip").setProperty("visible", false);
				d = "yard eq '" + n + "'and route_id eq '" + l + "'and (Truck_Departure_Time ge'" + _ + "'and Truck_Departure_Time le '" + M +
					"')"
			} else {
				r = [];
				this.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 0)
			}
			var m;
			if (!g) {
				m = d
			} else {
				m = d + "and Goods_Issued eq 'X'"
			}
			o.read("/ZEWM_CDS_PICK_PROG", {
				urlParameters: {
					$filter: m
				},
				success: $.proxy(function (e) {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/enableBusy", false);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/EWM_CDS_PICK_PROG", e.results);
					this.getView().byId("idTableTitle").setText("Total Rows (" + e.results.length + ")");
					if (e.results.length > 1) {
						var t = {
							CB10_Total: [],
							CB10_Min: [],
							DG10_Total: [],
							DG10_Min: [],
							LB10_Total: [],
							LB10_Min: [],
							LM10_Total: [],
							LM10_Min: [],
							RE10_Total: [],
							RE10_Min: [],
							RELM_Total: [],
							RELM_Min: [],
							REUM_Total: [],
							REUM_Min: [],
							UM10_Total: [],
							UM10_Min: [],
							FR10_Total: [],
							FR10_Min: [],
							LB20_Total: [],
							LB20_Min: [],
							NOLO_Min: [],
							NOLO_Complete_percent: [],
							NOLO_Total: [],
							DGHI_Min: [],
							DGHI_Complete_percent: [],
							DGHI_Total: [],
							UMHI_Min: [],
							UMHI_Complete_percent: [],
							UMHI_Total: [],
							LMHI_Min: [],
							LMHI_Complete_percent: [],
							LMHI_Total: [],
							WP10_Total: [],
							WP10_Complete_percent: [],
							WP10_Min: [],
							TP10_Total: [],
							TP10_Complete_percent: [],
							TP10_Min: [],
							XXBN_Total: [],
							XXBN_Complete_percent: [],
							XXBN_Min: [],
							LBHI_Total: [],
							LBHI_Complete_percent: [],
							LBHI_Min: [],
							SPHI_Total: [],
							SPHI_Complete_percent: [],
							SPHI_Min: [],
							SVHI_Total: [],
							SVHI_Complete_percent: [],
							SVHI_Min: [],
							FP10_Total: [],
							FP10_Complete_percent: [],
							FP10_Min: [],
							MP10_Total: [],
							MP10_Complete_percent: [],
							MP10_Min: [],
							RS10_Total: [],
							RS10_Complete_percent: [],
							RS10_Min: [],
							BC10_Total: [],
							BC10_Complete_percent: [],
							BC10_Min: [],
							SB10_Total: [],
							SB10_Complete_percent: [],
							SB10_Min: [],
							SP10_Total: [],
							SP10_Complete_percent: [],
							SP10_Min: [],
							SF10_Total: [],
							SF10_Complete_percent: [],
							SF10_Min: [],
							SM10_Total: [],
							SM10_Complete_percent: [],
							SM10_Min: [],
							VS10_Total: [],
							VS10_Complete_percent: [],
							VS10_Min: [],
							Total_Lines: []
						};
						for (var o in e.results) {
							if (e.results[o].NOLO_Min != "") {
								t.NOLO_Min.push(Math.round(e.results[o].NOLO_Min))
							}
							if (e.results[o].NOLO_Complete_percent != "") {
								t.NOLO_Complete_percent.push(parseInt(e.results[o].NOLO_Complete_percent))
							}
							if (e.results[o].NOLO_Total != "") {
								t.NOLO_Total.push(parseInt(e.results[o].NOLO_Total))
							}
							if (e.results[o].DGHI_Min != "") {
								t.DGHI_Min.push(Math.round(e.results[o].DGHI_Min))
							}
							if (e.results[o].DGHI_Complete_percent != "") {
								t.DGHI_Complete_percent.push(parseInt(e.results[o].DGHI_Complete_percent))
							}
							if (e.results[o].DGHI_Total != "") {
								t.DGHI_Total.push(parseInt(e.results[o].DGHI_Total))
							}
							if (e.results[o].UMHI_Min != "") {
								t.UMHI_Min.push(Math.round(e.results[o].UMHI_Min))
							}
							if (e.results[o].UMHI_Complete_percent != "") {
								t.UMHI_Complete_percent.push(parseInt(e.results[o].UMHI_Complete_percent))
							}
							if (e.results[o].UMHI_Total != "") {
								t.UMHI_Total.push(parseInt(e.results[o].UMHI_Total))
							}
							if (e.results[o].LMHI_Min != "") {
								t.LMHI_Min.push(Math.round(e.results[o].LMHI_Min))
							}
							if (e.results[o].LMHI_Complete_percent != "") {
								t.LMHI_Complete_percent.push(parseInt(e.results[o].LMHI_Complete_percent))
							}
							if (e.results[o].LMHI_Total != "") {
								t.LMHI_Total.push(parseInt(e.results[o].LMHI_Total))
							}
							if (e.results[o].CB10_Total != "") {
								t.CB10_Total.push(parseInt(e.results[o].CB10_Total))
							}
							if (e.results[o].CB10_Min != "") {
								t.CB10_Min.push(Math.round(e.results[o].CB10_Min))
							}
							if (e.results[o].DG10_Total != "") {
								t.DG10_Total.push(parseInt(e.results[o].DG10_Total))
							}
							if (e.results[o].DG10_Min != "") {
								t.DG10_Min.push(Math.round(e.results[o].DG10_Min))
							}
							if (e.results[o].LB10_Total != "") {
								t.LB10_Total.push(parseInt(e.results[o].LB10_Total))
							}
							if (e.results[o].LB10_Min != "") {
								t.LB10_Min.push(Math.round(e.results[o].LB10_Min))
							}
							if (e.results[o].LM10_Total != "") {
								t.LM10_Total.push(parseInt(e.results[o].LM10_Total))
							}
							if (e.results[o].LM10_Min != "") {
								t.LM10_Min.push(Math.round(e.results[o].LM10_Min))
							}
							if (e.results[o].RE10_Total != "") {
								t.RE10_Total.push(parseInt(e.results[o].RE10_Total))
							}
							if (e.results[o].RE10_Min != "") {
								t.RE10_Min.push(Math.round(e.results[o].RE10_Min))
							}
							if (e.results[o].RELM_Total != "") {
								t.RELM_Total.push(parseInt(e.results[o].RELM_Total))
							}
							if (e.results[o].RELM_Min != "") {
								t.RELM_Min.push(Math.round(e.results[o].RELM_Min))
							}
							if (e.results[o].REUM_Total != "") {
								t.REUM_Total.push(parseInt(e.results[o].REUM_Total))
							}
							if (e.results[o].REUM_Min != "") {
								t.REUM_Min.push(Math.round(e.results[o].REUM_Min))
							}
							if (e.results[o].UM10_Total != "") {
								t.UM10_Total.push(parseInt(e.results[o].UM10_Total))
							}
							if (e.results[o].UM10_Min != "") {
								t.UM10_Min.push(Math.round(e.results[o].UM10_Min))
							}
							if (e.results[o].FR10_Total != "") {
								t.FR10_Total.push(parseInt(e.results[o].FR10_Total))
							}
							if (e.results[o].FR10_Min != "") {
								t.FR10_Min.push(Math.round(e.results[o].FR10_Min))
							}
							if (e.results[o].LB20_Total != "") {
								t.LB20_Total.push(parseInt(e.results[o].LB20_Total))
							}
							if (e.results[o].LB20_Min != "") {
								t.LB20_Min.push(Math.round(e.results[o].LB20_Min))
							}
							if (e.results[o].WP10_Total != "") {
								t.WP10_Total.push(parseInt(e.results[o].WP10_Total))
							}
							if (e.results[o].WP10_Complete_percent != "") {
								t.WP10_Complete_percent.push(parseInt(e.results[o].WP10_Complete_percent))
							}
							if (e.results[o].WP10_Min != "") {
								t.WP10_Min.push(Math.round(e.results[o].WP10_Min))
							}
							if (e.results[o].TP10_Total != "") {
								t.TP10_Total.push(parseInt(e.results[o].TP10_Total))
							}
							if (e.results[o].TP10_Complete_percent != "") {
								t.TP10_Complete_percent.push(parseInt(e.results[o].TP10_Complete_percent))
							}
							if (e.results[o].TP10_Min != "") {
								t.TP10_Min.push(Math.round(e.results[o].TP10_Min))
							}
							if (e.results[o].XXBN_Total != "") {
								t.XXBN_Total.push(parseInt(e.results[o].XXBN_Total))
							}
							if (e.results[o].XXBN_Complete_percent != "") {
								t.XXBN_Complete_percent.push(parseInt(e.results[o].XXBN_Complete_percent))
							}
							if (e.results[o].XXBN_Min != "") {
								t.XXBN_Min.push(Math.round(e.results[o].XXBN_Min))
							}
							if (e.results[o].SM10_Total != "") {
								t.SM10_Total.push(parseInt(e.results[o].SM10_Total))
							}
							if (e.results[o].SM10_Complete_percent != "") {
								t.SM10_Complete_percent.push(parseInt(e.results[o].SM10_Complete_percent))
							}
							if (e.results[o].SM10_Min != "") {
								t.SM10_Min.push(Math.round(e.results[o].SM10_Min))
							}
							if (e.results[o].VS10_Total != "") {
								t.VS10_Total.push(parseInt(e.results[o].VS10_Total))
							}
							if (e.results[o].VS10_Complete_percent != "") {
								t.VS10_Complete_percent.push(parseInt(e.results[o].VS10_Complete_percent))
							}
							if (e.results[o].VS10_Min != "") {
								t.VS10_Min.push(Math.round(e.results[o].VS10_Min))
							}
							if (e.results[o].LBHI_Total != "") {
								t.LBHI_Total.push(parseInt(e.results[o].LBHI_Total))
							}
							if (e.results[o].LBHI_Complete_percent != "") {
								t.LBHI_Complete_percent.push(parseInt(e.results[o].LBHI_Complete_percent))
							}
							if (e.results[o].LBHI_Min != "") {
								t.LBHI_Min.push(Math.round(e.results[o].LBHI_Min))
							}
							if (e.results[o].SPHI_Total != "") {
								t.SPHI_Total.push(parseInt(e.results[o].SPHI_Total))
							}
							if (e.results[o].SPHI_Complete_percent != "") {
								t.SPHI_Complete_percent.push(parseInt(e.results[o].SPHI_Complete_percent))
							}
							if (e.results[o].SPHI_Min != "") {
								t.SPHI_Min.push(Math.round(e.results[o].SPHI_Min))
							}
							if (e.results[o].SVHI_Total != "") {
								t.SVHI_Total.push(parseInt(e.results[o].SVHI_Total))
							}
							if (e.results[o].SVHI_Complete_percent != "") {
								t.SVHI_Complete_percent.push(parseInt(e.results[o].SVHI_Complete_percent))
							}
							if (e.results[o].SVHI_Min != "") {
								t.SVHI_Min.push(Math.round(e.results[o].SVHI_Min))
							}
							if (e.results[o].FP10_Total != "") {
								t.FP10_Total.push(parseInt(e.results[o].FP10_Total))
							}
							if (e.results[o].FP10_Complete_percent != "") {
								t.FP10_Complete_percent.push(parseInt(e.results[o].FP10_Complete_percent))
							}
							if (e.results[o].FP10_Min != "") {
								t.FP10_Min.push(Math.round(e.results[o].FP10_Min))
							}
							if (e.results[o].MP10_Total != "") {
								t.MP10_Total.push(parseInt(e.results[o].MP10_Total))
							}
							if (e.results[o].MP10_Complete_percent != "") {
								t.MP10_Complete_percent.push(parseInt(e.results[o].MP10_Complete_percent))
							}
							if (e.results[o].MP10_Min != "") {
								t.MP10_Min.push(Math.round(e.results[o].MP10_Min))
							}
							if (e.results[o].RS10_Total != "") {
								t.RS10_Total.push(parseInt(e.results[o].RS10_Total))
							}
							if (e.results[o].RS10_Complete_percent != "") {
								t.RS10_Complete_percent.push(parseInt(e.results[o].RS10_Complete_percent))
							}
							if (e.results[o].RS10_Min != "") {
								t.RS10_Min.push(Math.round(e.results[o].RS10_Min))
							}
							if (e.results[o].BC10_Total != "") {
								t.BC10_Total.push(parseInt(e.results[o].BC10_Total))
							}
							if (e.results[o].BC10_Complete_percent != "") {
								t.BC10_Complete_percent.push(parseInt(e.results[o].BC10_Complete_percent))
							}
							if (e.results[o].BC10_Min != "") {
								t.BC10_Min.push(Math.round(e.results[o].BC10_Min))
							}
							if (e.results[o].Total_Lines != "") {
								t.Total_Lines.push(Math.round(e.results[o].Total_Lines))
							}
						}
						this.getView().getModel("multiHeaderConfig").setProperty("/NOLO_Min", this._fnTotalCount(t.NOLO_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/NOLO_Complete_percent", this._fnTotalCount(t.NOLO_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/NOLO_Total", this._fnTotalCount(t.NOLO_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/DGHI_Min", this._fnTotalCount(t.DGHI_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/DGHI_Complete_percent", this._fnTotalCount(t.DGHI_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/DGHI_Total", this._fnTotalCount(t.DGHI_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/UMHI_Min", this._fnTotalCount(t.UMHI_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/UMHI_Complete_percent", this._fnTotalCount(t.UMHI_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/UMHI_Total", this._fnTotalCount(t.UMHI_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/LMHI_Min", this._fnTotalCount(t.LMHI_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/LMHI_Complete_percent", this._fnTotalCount(t.LMHI_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/LMHI_Total", this._fnTotalCount(t.LMHI_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/CB10_Total", this._fnTotalCount(t.CB10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/CB10_Min", this._fnTotalCount(t.CB10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/DG10_Total", this._fnTotalCount(t.DG10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/DG10_Min", this._fnTotalCount(t.DG10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/LB10_Total", this._fnTotalCount(t.LB10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/LB10_Min", this._fnTotalCount(t.LB10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/LM10_Total", this._fnTotalCount(t.LM10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/LM10_Min", this._fnTotalCount(t.LM10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/RE10_Total", this._fnTotalCount(t.RE10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/RE10_Min", this._fnTotalCount(t.RE10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/RELM_Total", this._fnTotalCount(t.RELM_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/RELM_Min", this._fnTotalCount(t.RELM_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/REUM_Total", this._fnTotalCount(t.REUM_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/REUM_Min", this._fnTotalCount(t.REUM_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/UM10_Total", this._fnTotalCount(t.UM10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/UM10_Min", this._fnTotalCount(t.UM10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/FR10_Total", this._fnTotalCount(t.FR10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/FR10_Min", this._fnTotalCount(t.FR10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/LB20_Total", this._fnTotalCount(t.LB20_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/LB20_Min", this._fnTotalCount(t.LB20_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/SVHI_Total", this._fnTotalCount(t.SVHI_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/SVHI_Complete_percent", this._fnTotalCount(t.SVHI_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/SVHI_Min", this._fnTotalCount(t.SVHI_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/SPHI_Total", this._fnTotalCount(t.SPHI_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/SPHI_Complete_percent", this._fnTotalCount(t.SPHI_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/SPHI_Min", this._fnTotalCount(t.SPHI_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/LBHI_Total", this._fnTotalCount(t.LBHI_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/LBHI_Complete_percent", this._fnTotalCount(t.LBHI_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/LBHI_Min", this._fnTotalCount(t.LBHI_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Total", this._fnTotalCount(t.WP10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Complete_percent", this._fnTotalCount(t.WP10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Min", this._fnTotalCount(t.WP10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/TP10_Total", this._fnTotalCount(t.TP10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/TP10_Complete_percent", this._fnTotalCount(t.TP10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/TP10_Min", this._fnTotalCount(t.TP10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/XXBN_Total", this._fnTotalCount(t.XXBN_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/XXBN_Complete_percent", this._fnTotalCount(t.XXBN_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/XXBN_Min", this._fnTotalCount(t.XXBN_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/SM10_Total", this._fnTotalCount(t.SM10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/SM10_Complete_percent", this._fnTotalCount(t.SM10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/SM10_Min", this._fnTotalCount(t.SM10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/VS10_Total", this._fnTotalCount(t.VS10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/VS10_Complete_percent", this._fnTotalCount(t.VS10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/VS10_Min", this._fnTotalCount(t.VS10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Total", this._fnTotalCount(t.WP10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Complete_percent", this._fnTotalCount(t.WP10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Min", this._fnTotalCount(t.WP10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/FP10_Total", this._fnTotalCount(t.FP10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/FP10_Complete_percent", this._fnTotalCount(t.FP10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/FP10_Min", this._fnTotalCount(t.FP10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/MP10_Total", this._fnTotalCount(t.MP10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/MP10_Complete_percent", this._fnTotalCount(t.MP10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/MP10_Min", this._fnTotalCount(t.MP10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/RS10_Total", this._fnTotalCount(t.RS10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/RS10_Complete_percent", this._fnTotalCount(t.RS10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/RS10_Min", this._fnTotalCount(t.RS10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/SB10_Total", this._fnTotalCount(t.SB10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/SB10_Complete_percent", this._fnTotalCount(t.SB10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/SB10_Min", this._fnTotalCount(t.SB10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/BC10_Total", this._fnTotalCount(t.BC10_Total));
						this.getView().getModel("multiHeaderConfig").setProperty("/BC10_Complete_percent", this._fnTotalCount(t.BC10_Complete_percent));
						this.getView().getModel("multiHeaderConfig").setProperty("/BC10_Min", this._fnTotalCount(t.BC10_Min));
						this.getView().getModel("multiHeaderConfig").setProperty("/Total_Lines", this._fnTotalCount(t.Total_Lines))
					} else {
						this.getView().getModel("multiHeaderConfig").setProperty("/CB10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/CB10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/DG10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/DG10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LB10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LB10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LM10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LM10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RE10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RE10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RELM_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RELM_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/REUM_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/REUM_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/UM10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/UM10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/FR10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/FR10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LB20_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LB20_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SVHI_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SVHI_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SVHI_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SPHI_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SPHI_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SPHI_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LBHI_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LBHI_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/LBHI_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/TP10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/TP10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/TP10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/XXBN_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/XXBN_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/XXBN_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SM10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SM10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SM10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/VS10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/VS10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/VS10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/WP10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/FP10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/FP10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/FP10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/MP10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/MP10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/MP10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RS10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RS10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/RS10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SB10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SB10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/SB10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/BC10_Total", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/BC10_Complete_percent", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/BC10_Min", "");
						this.getView().getModel("multiHeaderConfig").setProperty("/Total_Lines", "")
					}
				}, this),
				error: $.proxy(function () {
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/enableBusy", false)
				}, this)
			})
		},
		_fnTotalCount: function (e) {
			var t = "";
			if (e.length > 0) {
				t = e.reduce(function (e, t) {
					return Math.round(e + t)
				});
				return Math.round(t)
			} else {
				return t
			}
		},
		onNavigate: function (e) {
			var t = e.getSource().getModel("LocalDataModel").getProperty(e.getParameters().rowContext.sPath);
			this.getOwnerComponent().getRouter().navTo("Details", {
				yard: t.yard,
				route_id: t.route_id,
				tu_num_ext: t.tu_num_ext
			})
		},
		formatNumber: function (e) {
			if (e) {
				var t = parseFloat(e).toFixed(2);
				return t * 100
			} else {
				return e
			}
		},
		_ModelServiceCall: function () {
			var e = this;
			this.IntervalHandle = setInterval(function () {
				e.getOwnerComponent().getModel("PutawayModel").refresh(true)
			}, 6e4)
		},
		_timeStampCall: function () {
			var e = this;
			this.InterValHandlCall = setInterval(function () {
				e.getView().byId("idGetDate").setText((new Date).toDateString() + " " + (new Date).toLocaleTimeString())
			}, 1e3)
		},
		onClear: function (e) {
			this.getView().byId("idYard").setSelectedKey("");
			this.getView().byId("idRoute").setSelectedKey("");
			this.getView().getModel("multiHeaderConfig").setProperty("/rowCount", 0);
			var t = this.getView().byId("idRCPTable");
			var o = t.getBinding("rows");
			o.filter([])
		},
		formatBlankValue: function (e) {
			var t = parseFloat(e);
			if (t == 0) {
				var o = "";
				return o
			} else {
				return e
			}
		},
		onAfterRendering: function () {},
		onDataExport: function (e) {
			var t = this;
			var o = new sap.ui.core.util.Export({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: "\t",
					mimeType: "application/vnd.ms-excel",
					charset: "utf-8",
					fileExtension: "xls"
				}),
				models: this.getOwnerComponent().getModel("LocalDataModel"),
				rows: {
					path: "/EWM_CDS_PICK_PROG"
				},
				columns: [{
					name: "TU",
					template: {
						content: "{tu_num_ext}"
					}
				}, {
					name: "Truck Departure Time",
					template: {
						content: "{path:'Truck_Departure_Time', type: 'sap.ui.model.type.DateTime', formatOptions: { source: { pattern: 'yyyy-MM-dd HH:mm:ss X' }, pattern: 'yyyy-MM-dd HH:mm:ss' }}"
					}
				}, {
					name: "Route Name",
					template: {
						content: "{route_id}"
					}
				}, {
					name: "Route Description",
					template: {
						content: "{bezei}"
					}
				}, {
					name: "Target Completion Time",
					template: {
						content: "{path:'created_time', type: 'sap.ui.model.type.DateTime', formatOptions: { source: { pattern: 'yyyy-MM-dd HH:mm:ss X' }, pattern: 'yyyy-MM-dd HH:mm:ss' }}"
					}
				}, {
					name: "Cage Bulk CB10 (Lines- " + t.getView().getModel("multiHeaderConfig").getProperty("/CB10_Total") + ")",
					template: {
						content: "{CB10_Total}"
					}
				}, {
					name: "Cage Bulk CB10 (Percent Complete)",
					template: {
						content: "{path: ' CB10_Complete_percent', type: 'sap.ui.model.type.String'}"
					}
				}, {
					name: "Cage Bulk CB10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/CB10_Min") + ")",
					template: {
						content: "{CB10_Min}"
					}
				}, {
					name: "Dangerous Goods DG10 (Line - " + t.getView().getModel("multiHeaderConfig").getProperty("/DG10_Total") + ") ",
					template: {
						content: "{DG10_Total}"
					}
				}, {
					name: "Dangerous Goods DG10 (Percent Complete)",
					template: {
						content: "{DG10_Complete_percent}"
					}
				}, {
					name: "Dangerous Goods DG10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/DG10_Min") + ")",
					template: {
						content: "{DG10_Min}"
					}
				}, {
					name: "Loose Bulk LB10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/LB10_Total") + ")",
					template: {
						content: "{LB10_Total}"
					}
				}, {
					name: "Loose Bulk LB10 (Percent Complete)",
					template: {
						content: "{LB10_Complete_percent}"
					}
				}, {
					name: "Loose Bulk LB10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/LB10_Min") + ")",
					template: {
						content: "{LB10_Min}"
					}
				}, {
					name: "Lower Mezzanine LM10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/LM10_Total") + ")",
					template: {
						content: "{LM10_Total}"
					}
				}, {
					name: "Lower Mezzanine LM10 (Percent Complete) ",
					template: {
						content: "{LM10_Complete_percent}"
					}
				}, {
					name: "Lower Mezzanine LM10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/LM10_Min") + ")",
					template: {
						content: "{LM10_Min}"
					}
				}, {
					name: "Reserve Storage RE10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/RE10_Total") + ")",
					template: {
						content: "{RE10_Total}"
					}
				}, {
					name: "Reserve Storage RE10 (Percent Complete)",
					template: {
						content: "{RE10_Complete_percent}"
					}
				}, {
					name: "Reserve Storage RE10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/RE10_Min") + ")",
					template: {
						content: "{RE10_Min}"
					}
				}, {
					name: "LM Reserve RELM (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/RELM_Total") + ")",
					template: {
						content: "{RELM_Total}"
					}
				}, {
					name: "LM Reserve RELM (Percent Complete)",
					template: {
						content: "{RELM_Complete_percent}"
					}
				}, {
					name: "LM Reserve RELM (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/RELM_Min") + ")",
					template: {
						content: "{RELM_Min}"
					}
				}, {
					name: "UM Reserve REUM (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/REUM_Total") + ")",
					template: {
						content: "{REUM_Total}"
					}
				}, {
					name: "UM Reserve REUM (Percent Complete)",
					template: {
						content: "{REUM_Complete_percent}"
					}
				}, {
					name: "UM Reserve REUM  (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/REUM_Min") + ")",
					template: {
						content: "{REUM_Min}"
					}
				}, {
					name: "Upper Mezzanine UM10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/UM10_Total") + ")",
					template: {
						content: "{UM10_Total}"
					}
				}, {
					name: "Upper Mezzanine UM10 (Percent Complete)",
					template: {
						content: "{UM10_Complete_percent}"
					}
				}, {
					name: "Upper Mezzanine UM10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/UM10_Min") + ")",
					template: {
						content: "{UM10_Min}"
					}
				}, {
					name: "Fast Rack PDC1 FR10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/FR10_Total") + ")",
					template: {
						content: "{FR10_Total}"
					}
				}, {
					name: "Fast Rack PDC1 FR10 (Percent Complete)",
					template: {
						content: "{FR10_Complete_percent}"
					}
				}, {
					name: "Fast Rack PDC1 FR10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/FR10_Min") + ")",
					template: {
						content: "{FR10_Min}"
					}
				}, {
					name: "Loose Bulk PDC2 LB20 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/LB20_Total") + ")",
					template: {
						content: "{LB20_Total}"
					}
				}, {
					name: "Loose Bulk PDC2 LB20 (Percent Complete)",
					template: {
						content: "{LB20_Complete_percent}"
					}
				}, {
					name: "Loose Bulk PDC2 LB20 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/LB20_Min") + ")",
					template: {
						content: "{LB20_Min}"
					}
				}, {
					name: "Lower Mezzanine LMHI (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/LMHI_Total") + ")",
					template: {
						content: "{LMHI_Total}"
					}
				}, {
					name: "Lower Mezzanine LMHI (Percent Complete)",
					template: {
						content: "{LMHI_Complete_percent}"
					}
				}, {
					name: "Lower Mezzanine LMHI (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/LMHI_Min") + ")",
					template: {
						content: "{LMHI_Min}"
					}
				}, {
					name: "Upper Mezzanine UMHI (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/UMHI_Total") + ")",
					template: {
						content: "{UMHI_Total}"
					}
				}, {
					name: "Upper Mezzanine UMHI (Percent Complete)",
					template: {
						content: "{UMHI_Complete_percent}"
					}
				}, {
					name: "Upper Mezzanine UMHI (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/UMHI_Min") + ")",
					template: {
						content: "{UMHI_Min}"
					}
				}, {
					name: "Dangerous Goods DGHI (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/DGHI_Total") + ")",
					template: {
						content: "{DGHI_Total}"
					}
				}, {
					name: "Dangerous Goods DGHI (Percent Complete)",
					template: {
						content: "{DGHI_Complete_percent}"
					}
				}, {
					name: "Dangerous Goods DGHI (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/DGHI_Min") + ")",
					template: {
						content: "{DGHI_Min}"
					}
				}, {
					name: "TP10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/TP10_Total") + ")",
					template: {
						content: "{TP10_Total}"
					}
				}, {
					name: "TP10 (Percent Complete)",
					template: {
						content: "{TP10_Complete_percent}"
					}
				}, {
					name: "TP10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/TP10_Min") + ")",
					template: {
						content: "{TP10_Min}"
					}
				}, {
					name: "XXBN (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/XXBN_Total") + ")",
					template: {
						content: "{XXBN_Total}"
					}
				}, {
					name: "XXBN (Percent Complete)",
					template: {
						content: "{XXBN_Complete_percent}"
					}
				}, {
					name: "XXBN (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/XXBN_Min") + ")",
					template: {
						content: "{XXBN_Min}"
					}
				}, {
					name: "SM10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/SM10_Total") + ")",
					template: {
						content: "{SM10_Total}"
					}
				}, {
					name: "SM10 (Percent Complete)",
					template: {
						content: "{SM10_Complete_percent}"
					}
				}, {
					name: "SM10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/SM10_Min") + ")",
					template: {
						content: "{SM10_Min}"
					}
				}, {
					name: "VS10 (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/VS10_Total") + ")",
					template: {
						content: "{VS10_Total}"
					}
				}, {
					name: "VS10 (Percent Complete)",
					template: {
						content: "{VS10_Complete_percent}"
					}
				}, {
					name: "VS10 (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/VS10_Min") + ")",
					template: {
						content: "{VS10_Min}"
					}
				}, {
					name: "NOLO (Lines - " + t.getView().getModel("multiHeaderConfig").getProperty("/NOLO_Total") + ")",
					template: {
						content: "{NOLO_Total}"
					}
				}, {
					name: "NOLO (Percent Complete)",
					template: {
						content: "{NOLO_Complete_percent}"
					}
				}, {
					name: "NOLO (Min - " + t.getView().getModel("multiHeaderConfig").getProperty("/NOLO_Min") + ")",
					template: {
						content: "{NOLO_Min}"
					}
				}]
			});
			o.saveFile().always(function () {
				this.destroy()
			})
		}
	})
});