jQuery.sap.declare("zpickr.util.Formatter");zpickr.util.Formatter={formatDangerBg:function(e){var t;var a=sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd HH:mm:ss"});var l=this.getParent().getCells()[4].getText();var s=this;s.oGetDate=a.format(new Date);var r=a.format(new Date);var i=new Date(l);var n=new Date(this.oGetDate);var o=i.getDate()+"-"+i.getMonth()+"-"+i.getFullYear();var v=n.getDate()+"-"+n.getMonth()+"-"+n.getFullYear();if(o==v){var c=Math.abs(n.getTime()-i.getTime());var D=Math.abs(i.getTime()-n.getTime());var m=Math.ceil(c/(1e3*3600*24))}else{c=null;D=null}var h=parseInt(e);if(r<l&&h==100){this.removeStyleClass("clDanRed");this.removeStyleClass("clDanYellow");this.addStyleClass("clDanGreen");t=e}else if(r>l&&h<100){this.removeStyleClass("clDanGreen");this.removeStyleClass("clDanYellow");this.addStyleClass("clDanRed");t=e}else if(D<9e5&&h<100){this.removeStyleClass("clDanGreen");this.removeStyleClass("clDanRed");this.addStyleClass("clDanYellow");t=e}else{t=e;this.removeStyleClass("clDanGreen");this.removeStyleClass("clDanYellow");this.removeStyleClass("clDanRed");this.addStyleClass("clNull")}return t},formatDate:function(e){if(e){var t=e.slice(0,8);var a=t.slice(0,4);var l=t.slice(4,6);var s=t.slice(6,8);var r=a+"-"+l+"-"+s;return r}else{return e}}};