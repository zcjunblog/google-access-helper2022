
var winBackgroundPage = chrome.extension.getBackgroundPage();
var lang = window.navigator.language;

function popupFun(){
	this.init=function(){
		var _sl = localStorage['_sl'];
		if(!_sl || _sl == undefined){
			return ;
		}
		var _i = localStorage['_i'];
		
			var _d = JSON.parse(_sl)
		
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>disconnect</font>");
			
			var _img = "";
			var _f = "";
			var _pg = ""
			if(_i == undefined){
				for(var i = 0;i < _d.d.length;i++){
					if(i == 0){
						_f += '<img class="x-select-icon" src="/img/flags/'+_d.d[i].p+'">';
						_f += '<label style="display: none;" id="select_now">'+_d.d[i].i+'</label>';
						_f += '<div class="x-select-title">'+_d.d[i].n+'</div>  ';
						var _l = '';
						if(_d.d[i].l == 2){
							_l = '<div class="x-select-badge">Premium</div>';
						}
						_f += _l;
						_f += '<div class="x-select-arrow"></div>';
						
						_img = _d.d[i].p;
						
					}
				}
			} else {
				var _flag = true;
				for(var i = 0;i < _d.d.length;i++){
					if(_d.d[i].i == _i){
						_flag = false;
					}
				}
				
				for(var i = 0;i < _d.d.length;i++){
					if(_flag){
						if(i == 0){
							_f += '<img class="x-select-icon" src="/img/flags/'+_d.d[i].p+'">';
							_f += '<label style="display: none;" id="select_now">'+_d.d[i].i+'</label>';
							_f += '<div class="x-select-title">'+_d.d[i].n+'</div>  ';
							var _l = '';
							if(_d.d[i].l == 2){
								_l = '<div class="x-select-badge">Premium</div>';
							}
							_f += _l;
							_f += '<div class="x-select-arrow"></div>';
							
							_img = _d.d[i].p;
						}
					} else {
						if(_d.d[i].i == _i){
							_f += '<img class="x-select-icon" src="/img/flags/'+_d.d[i].p+'">';
							_f += '<label style="display: none;" id="select_now">'+_d.d[i].i+'</label>';
							_f += '<div class="x-select-title">'+_d.d[i].n+'</div>  ';
							var _l = '';
							if(_d.d[i].l == 2){
								_l = '<div class="x-select-badge">Premium</div>';
							}
							_f += _l;
							_f += '<div class="x-select-arrow"></div>';
							
							_img = _d.d[i].p;
						}
					}
				}
			}
			$(".x-select-view").html(_f);

			var _pg = ""
			for(var i = 0;i < _d.d.length;i++){
				if(_d.d[i].l == 2){
					continue ;
				}
				_pg += '<li class="list-group-item list-group-item-action" style="cursor: pointer;" name="proxyLi">'
				
				if(_d.d[i].i < 0){
					_pg += '<input style="display: inline-block; margin-left: -12px;" type="radio" name="proxySelected" value="'+_d.d[i].i+'" disabled>'
				} else {
					if(_i != undefined && _d.d[i].i == _i){
						_pg += '<input style="display: inline-block; margin-left: -12px;" type="radio" name="proxySelected" value="'+_d.d[i].i+'" checked>'
					} else {
						_pg += '<input style="display: inline-block; margin-left: -12px;" type="radio" name="proxySelected" value="'+_d.d[i].i+'">'
					}
				}

				_pg += '<img style="display: inline-block;margin-left: 5px;" src="/img/flags/'+_d.d[i].p+'">'
				if(_d.d[i].i < 0){
					_pg += '<div style="display: inline-block;margin-left: 5px; width: 120px; height: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 8px; color: red;" title="'+_d.d[i].n+'">'+_d.d[i].n+'</div>'
				} else {
					_pg += '<div style="display: inline-block;margin-left: 5px; width: 120px; height: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 8px;" title="'+_d.d[i].n+'">'+_d.d[i].n+'</div>'
				}
				_pg += '<div style="display: inline-block; float: right; width: 80px; margin-right: 1px;">'

				var number = popup.getPing(_d.d[i].i)
				_pg += '<img style="display: inline; width: 15px; height: 15px;" src="/img/signal'+number+'.svg">'
				_pg += '<div style="display: inline-block; visibility: hidden; margin-left: 5px; width: 60px; border-radius: 9px; background-color: #4CAF50; padding: 3px 5px; font-size: 5px; color: white;">Premium</div>'
				_pg += '</div>'
				_pg += '</li>'

			}

			var _pgVIP = ""
			for(var i = 0;i < _d.d.length;i++){
				if(_d.d[i].l != 2){
					continue ;
				}
				_pgVIP += '<li class="list-group-item list-group-item-action" style="cursor: pointer;" name="proxyLi">'
				
				if(_d.d[i].i < 0){
					_pgVIP += '<input style="display: inline-block; margin-left: -12px;" type="radio" name="proxySelected" value="'+_d.d[i].i+'" disabled>'
				} else {
					if(_i != undefined && _d.d[i].i == _i){
						_pgVIP += '<input style="display: inline-block; margin-left: -12px;" type="radio" name="proxySelected" value="'+_d.d[i].i+'" checked>'
					} else {
						_pgVIP += '<input style="display: inline-block; margin-left: -12px;" type="radio" name="proxySelected" value="'+_d.d[i].i+'">'
					}
				}

				_pgVIP += '<img style="display: inline-block;margin-left: 5px;" src="/img/flags/'+_d.d[i].p+'">'
				if(_d.d[i].i < 0){
					_pgVIP += '<div style="display: inline-block;margin-left: 5px; width: 120px; height: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 8px; color: red;" title="'+_d.d[i].n+'">'+_d.d[i].n+'</div>'
				} else {
					_pgVIP += '<div style="display: inline-block;margin-left: 5px; width: 120px; height: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 8px;" title="'+_d.d[i].n+'">'+_d.d[i].n+'</div>'
				}
				_pgVIP += '<div style="display: inline-block; float: right; width: 80px; margin-right: 1px;">'

				var number = popup.getPing(_d.d[i].i)
				_pgVIP += '<img style="display: inline; width: 15px; height: 15px;" src="/img/signal'+number+'.svg">'
				_pgVIP += '<div style="display: inline-block; visibility: visible; margin-left: 5px; width: 60px; border-radius: 9px; background-color: #4CAF50; padding: 3px 5px; font-size: 5px; color: white;">Premium</div>'
				_pgVIP += '</div>'
				_pgVIP += '</li>'

			}

			let login_status= localStorage['login_status']
			let nCurrValidTime = localStorage['nCurrValidTime']
			let isVipUser = 0
			if(login_status && login_status == '1' && nCurrValidTime && nCurrValidTime != '0'){
				isVipUser = 1
			}

			if(isVipUser == 1){
				$("#proxy-group").html(_pgVIP + _pg)
			} else {
				$("#proxy-group").html(_pg + _pgVIP)
			}

			$("[name='proxyLi']").bind("click", function(){
				var _i = $(this).find("[name='proxySelected']").val()
				if(Number.parseInt(_i) < 0){
					var login_status = localStorage['login_status'] 
					var nCurrValidTime = localStorage['nCurrValidTime'] 
					if(login_status && login_status == '1'){
						if(!nCurrValidTime || nCurrValidTime == '0'){
							let mes = "Please recharge first";
							if(lang == 'zh-CN'){
								mes = "&#35831;&#20808;&#20805;&#20540;";
							} 
							$("#message_dialog_div").html(mes)
							$("#dialog_button").show()
							$("#dialog_button").one("click", function(){
								chrome.tabs.create({url: "astar.html"})
							})
							$("#myModal").modal("show")
							return ;
						} else {
							winBackgroundPage.server.popupEvent(202);
							if(lang == 'zh-CN'){
								$("#message_dialog_div").html("&#20195;&#29702;&#20449;&#24687;&#33258;&#21160;&#21047;&#26032;&#65292;&#35831;&#37325;&#35797;")
							} else {
								$("#message_dialog_div").html("Proxy information is automatically refreshed, please try again")
							}
							$("#proxyLine").css({"top": "100%"})
							$("#dialog_button").hide()
							$("#myModal").modal("show")
							return ;
						}
					} else {
						let mes = "Please login first";
						if(lang == 'zh-CN'){
							mes = "&#35831;&#20808;&#30331;&#38470;";
						} 
						$("#message_dialog_div").html(mes)
						$("#dialog_button").show()
						$("#dialog_button").one("click", function(){
							$("#setting-panel").css({"width":"100%"});
							$("#setting-header").css({"display":"block"});
							$("#setting-body").css({"display":"block"});
							$("#myModal").modal("hide")
							$("#open-settings").hide()
							$("#proxyLine").css({"top": "100%"})
							$("#close-settings").show()
						})
						$("#myModal").modal("show")
						return ;
					}
				}
				popup.showSelected(_i);
			});
			
			var state = localStorage['state'];
			if(state == undefined || state == 0){
				return ;
			}
			
			if(state == 1){
				$("body").addClass("on");
				$('#vpn-on').attr("checked", true);
				$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>connect</font>");
				$("#blockerDiv").show();
				let webRTCObjStatus = localStorage['webRTCObjStatus']
				if(webRTCObjStatus && webRTCObjStatus == '1' && !$("#webRTC").is(':checked')){
					$("#webRTC").attr('checked', true);
				}
			}
	},
	this.getPing = function(id){
		var ping = localStorage['proxySignal_' + id]
		if(typeof(ping) == "undefined" || Number(ping) == -1){
			// no image
			return 0;
		}else if(Number(ping) == 10000){
			// no signal
			return -1;
		}else {
			if(Number(ping) < 500){
				return 4;
			}else if(Number(ping) < 1500){
				return 3;
			}else if(Number(ping) < 2500){
				return 2;
			}else if(Number(ping) < 3500){
				return 1;
			}else {
				return -1;
			}
		}
	},
	this.showSelected=function(_i){
		var _sl = localStorage['_sl'];
		if(_sl == undefined){
			return ;
		}
		
		var _d = JSON.parse(_sl)
		$("#proxyLine").css({"top": "100%"})
		
		var _f = "";
		for(var i = 0;i < _d.d.length;i++){
			if(_d.d[i].i == _i){
				_f += '<img class="x-select-icon" src="/img/flags/'+_d.d[i].p+'">';
				_f += '<label style="display: none;" id="select_now">'+_d.d[i].i+'</label>';
				_f += '<div class="x-select-title">'+_d.d[i].n+'</div>  ';
				var _l = '';
				if(_d.d[i].l == 2){
					_l = '<div class="x-select-badge">Premium</div>';
				}
				_f += _l;
				_f += '<div class="x-select-arrow"></div>';
			}
		}
		$(".x-select-view").html(_f);
		
		var state = localStorage['state'];
		if(state == undefined){
			return ;
		}
		if(state == 1){
			$("body").addClass("loading");
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>connecting</font>");
			localStorage['_i'] = _i
			winBackgroundPage.server.popupEvent(200);
		}
		if(state == 0){
			localStorage['_i'] = _i;
			popup.init();
		}
	},
    this.listenerSt = function(){
        
    },
    this.listenerBg = function(){
		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
			if(message.n == 1){
				$("body").removeClass("loading");
				$("body").addClass("on");
				$('#vpn-on').attr("checked", true);
				popup.init();
			}
			if(message.n == 0){
				$("body").removeClass("on");
				$("body").removeClass("loading");
				$('#vpn-on').attr("checked", false);
				popup.init();
			}
			if(message.n == 2){
				popup.init();
			}
			if(message.n == 4){
				$("body").removeClass("on");
				popup.init();
			}
			
			sendResponse({caback: "ok"});
		});
	},
	this.backgroundEvent = function(message){
		if(message.n == 1){
			$("body").removeClass("loading");
			$("body").addClass("on");
			$('#vpn-on').attr("checked", true);
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>connect</font>");
			popup.init();
			$("#blockerDiv").show();
			let webRTCObjStatus = localStorage['webRTCObjStatus']
			if(webRTCObjStatus && webRTCObjStatus == '1' && !$("#webRTC").is(':checked')){
				$("#webRTC").attr('checked', true);
			}
		}
		if(message.n == 0){
			$("body").removeClass("on");
			$("body").removeClass("loading");
			$('#vpn-on').attr("checked", false);
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>disconnect</font>");
			popup.init();
			$("#blockerDiv").hide();
		}
		if(message.n == 2){
			popup.init();
		}
		if(message.n == 4){
			$("body").removeClass("on");
			$("body").removeClass("loading");
			$('#vpn-on').attr("checked", false);
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>disconnect</font>");
			$("#blockerDiv").hide();
		}
	},
	this.noticeBack = function(mes){
		showMessage(mes);
	},
	this.change = function(){
		if($('#vpn-on').is(':checked')){
			var _title = $("#select_now").html();
			if(_title < 0){
				localStorage['_click'] = '1';
				var login_status = localStorage['login_status'] 
				var nCurrValidTime = localStorage['nCurrValidTime'] 
				if(login_status && login_status == 1){
					if(!nCurrValidTime || nCurrValidTime == '0'){
						let mes = "Please recharge first";
						if(lang == 'zh-CN'){
							mes = "&#35831;&#20808;&#20805;&#20540;";
						} 
						$("#message_dialog_div").html(mes)
						$("#dialog_button").show()
						$("#dialog_button").one("click", function(){
							chrome.tabs.create({url: "astar.html"})
						})
						$("#myModal").modal("show")
						return ;
					} else {
						winBackgroundPage.server.popupEvent(202);
						if(lang == 'zh-CN'){
							$("#message_dialog_div").html("&#20195;&#29702;&#20449;&#24687;&#33258;&#21160;&#21047;&#26032;&#65292;&#35831;&#37325;&#35797;")
						} else {
							$("#message_dialog_div").html("Proxy information is automatically refreshed, please try again")
						}
						$("#proxyLine").css({"top": "100%"})
						$("#dialog_button").hide()
						$("#myModal").modal("show")
						return ;
					}
				} else {
					let mes = "Please login first";
					if(lang == 'zh-CN'){
						mes = "&#35831;&#20808;&#30331;&#38470;";
					} 
					$("#message_dialog_div").html(mes)
					$("#dialog_button").show()
					$("#dialog_button").one("click", function(){
						$("#setting-panel").css({"width":"100%"});
						$("#setting-header").css({"display":"block"});
						$("#setting-body").css({"display":"block"});
						$("#open-settings").hide()
						$("#proxyLine").css({"top": "100%"})
						$("#close-settings").show()
						$("#myModal").modal("hide")
					})
					$("#myModal").modal("show")
					return ;
				}
			}
			
			localStorage['_i'] = _title
			$("body").addClass("loading");
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>connecting</font>");
			winBackgroundPage.server.popupEvent(200);
		} else {
			$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>disconnecting</font>");
			winBackgroundPage.server.popupEvent(404);
		}
	},
	this.getProduct = function(){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var email = localStorage['login_email']

			$.ajax({
				url: getDomainData()+'/astarnew/user/getProduct?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id
				},
				success: function(json){
					if(json.nCode != 0){
						showMessage(json.strText)
						return ;
					}
					// console.info(json)
					var productList = json.jsonObject.productList
					var _html = '<table style="width: 100%;"><tr>'
					for(var i = 0;i < productList.length;i++){
						var product = productList[i]
						
						_html += '<td align="center" valign="middle" style="padding: 2px 2px 2px 2px;">'
						_html += '<div '
						_html += 'id="' + product.productId + '"'
						_html += 'name="payTypeDiv" style="width: 120px; height: 80px; cursor: pointer; border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px;-o-border-radius: 10px;'
						if(i == 0){
							_html += 'border: 1px solid #000000;'
							localStorage['productId'] = product.productId
						}
						_html += '"><figure class="figure">'
						_html += '<img src="/img/'+ product.pic +'" class="figure-img img-fluid rounded" style="width: 109px; height: 45px;" alt="">'
						_html += '<figcaption class="figure-caption">'+ product.name +'</figcaption>'
						_html += '</figure><div></td>'
						if((i + 1) % 2 == 0){
							_html += '</tr><tr>'
						}
					}
					_html += '</tr></table>'
					$("#login_div").hide()
					$("#recharge_div").html(_html)
					$("#recharge_div").show()
					
					$("[name='payTypeDiv']").click(function(){
						$("[name='payTypeDiv']").css("border", "1px solid #FFFFFF")
						$(this).css("border", "1px solid #000000")
						localStorage['productId'] = $(this).attr("id")
					})
				},
				error: function(){
					// console.info("service net exception");
				}
			})
		}
	},
	this.getProductPrice = function(){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var email = localStorage['login_email']

			$.ajax({
				url: getDomainData()+'/astarnew/user/getProductPrice?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id
				},
				success: function(json){
					if(json.nCode != 0){
						showMessage(json.strText)
						return ;
					}
					// console.info(json)
					var productPriceList = json.jsonObject.productPriceList
					var _html = '<form>'
					for(var i = 0;i < productPriceList.length;i++){
						var productPrice = productPriceList[i]
						
						_html += '<div class="radio" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">'
						_html += '<label style="cursor: pointer;"><input type="radio" name="optradio"'
						_html += ' id="' + productPrice.productPriceId + '"'
						if(i == 0){
							_html += ' checked'
						}
						_html += '>'	
						_html += productPrice.name + ' <span style="text-decoration:line-through; color: #F00">US $' + productPrice.oriPrice + '</span> <span style="color: #0000FF">US $' + productPrice.price
						_html += '</span></label>'
						_html += '</div>'
					}
					_html += '</form>'
					
					_html += '<div style="margin-top: 15px;">'
					_html += '<button type="button" class="btn btn-outline-success btn-lg btn-block" id="paySubmit">pay</button>'
					// _html += '<button type="button" class="btn btn-secondary" id="cancelSubmit">cancel</button>'
					_html += '</div>'

					// console.info(_html)
					$("#login_div").hide()
					$("#price_div").html(_html)
					$("#price_div").show()

					$("#paySubmit").click(function(){
						popup.rechargeSubmit()
					});
					
					// $("#cancelSubmit").click(function(){
					// 	$("#price_div").hide()
					// 	$("#recharge_div").hide()
					// 	$("#login_div").show()
					// });
				},
				error: function(){
					console.info("service net exception");
				}
			})
		}
	},
	this.rechargeSubmit = function(){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var email = localStorage['login_email']
			var productPriceId = $("[name='optradio']:checked").attr("id")

			$.ajax({
				url: getDomainData()+'/astarnew/user/charge?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id, strlognid: email, productPriceId: productPriceId
				},
				success: function(json){
					if(json.nCode != 0){
						showMessage(json.strText)
						return ;
					}
					var url = json.strText
					window.open(url,"about")
				},
				error: function(){
					// console.info("service net exception");
				}
			})
		}
	},
	this.getActivityConfig = function(){
		$.ajax({
			url: getDomainData()+'/astarnew/user/getActivityConfig?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id
			},
			success: function(json){
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				if(!json.jsonObject){
					return ;
				}
				let enMessage = json.jsonObject.enMessage
				let chMessage = json.jsonObject.chMessage
				let dtEndTime = json.jsonObject.dtEndTime
				let nCurrValidTime = localStorage['nCurrValidTime']
				let login_status = localStorage['login_status']
				if((enMessage != '' || chMessage != '') && ((nCurrValidTime == undefined || nCurrValidTime == '0') || (login_status == undefined || login_status == '0'))){
					let closeMes = "Turn off active prompts";
					if(lang == 'zh-CN'){
						$("#activity_mess").html(chMessage)
						closeMes = "关闭活动提示";
					} else {
						$("#activity_mess").html(enMessage)
					}
					$("#activity_time").html(popup.getTimeDiff(lang, dtEndTime))
					setInterval(function(){
						$("#activity_time").html(popup.getTimeDiff(lang, dtEndTime))
					}, 1000)
					$("#activityDiv").css("top", "420px")
					$("#activity_close").show();
					$("#activity_close").attr("title", closeMes);
					$("#activity_close").one("click", function(){
						$("#activityDiv").css("top", "100%")
						$("#activity_close").hide();
					});
				} else {
					$("#activityDiv").css("top", "100%")
					$("#activity_close").hide();
				}
			},
			error: function(){
				console.info("service net exception");
			}
		})
	},
	this.getZoneTime = function(offset) {
        var localtime = new Date();
        var localmesc = localtime.getTime();
        var localOffset = localtime.getTimezoneOffset() * 60000;
        var utc = localOffset + localmesc;
        var calctime = utc + (3600000 * offset);
        return new Date(calctime);
    },
    this.getTimeDiff = function(lang, activityEndTime){
        var date3 = new Date(activityEndTime).getTime() - popup.getZoneTime(0)
        if(date3 <= 0){
            if(lang == 'zh-CN'){
				return "&#24050;&#32467;&#26463;"
			} else {
				return "It's over"
			}
        }
        var days=Math.floor(date3/(24*3600*1000))
        if(days < 10){
            days = '0' + days
        }
        var leave1=date3%(24*3600*1000) 
        var hours=Math.floor(leave1/(3600*1000))
        if(hours < 10){
            hours = '0' + hours
        }
        var leave2=leave1%(3600*1000) 
        var minutes=Math.floor(leave2/(60*1000))
        if(minutes < 10){
            minutes = '0' + minutes
        }
        var leave3=leave2%(60*1000)
        var seconds=Math.round(leave3/1000)
        if(seconds < 10){
            seconds = '0' + seconds
        }
		if(lang == 'zh-CN'){
			return "剩余 " + days + "天 " + hours + "小时 " + minutes + "分 " + seconds + "秒"
		} else {
			return days + "day " + hours + "hour " + minutes + "minute " + seconds + "second"
		}
    },
	this.getClientInfo = function(){
		$.ajax({
			url: getDomainData()+'/astarnew/NewVPN/getAllClientInfo?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id
			},
			success: function(json){
				if(json.nCode != 0){
					return ;
				}

				let _html = ''
				let arr = json.jsonObject.arr
				
				let downloadMes = "Click download ";
				let pcMes = "Please give priority to the client, which is more stable and fast.";
				if(lang == 'zh-CN'){
					downloadMes = "点击下载 ";
					pcMes = "请优先使用客户端，更稳定、快速。";
				}

				for(let i = 0;i < arr.length;i++){
					let arrObj = arr[i]
					if(arrObj.type == 'PC' || arrObj.type == 'MAC'){
						_html += '<div class="'+arrObj.type+ '" style="margin-left: 20px;" title="'+ pcMes + downloadMes +arrObj.type+ ' ' + arrObj.version + '">'
					} else {
						_html += '<div class="'+arrObj.type+ '" style="margin-left: 20px;" title="'+ downloadMes +arrObj.type+ ' ' + arrObj.version + '">'
					}
					_html += '<a href="'+arrObj.url+'" target="_blank"><img style="height: 30px; width: 30px;" src="/img/'+arrObj.type+'.png" /></a>'
					_html += '</div>'

					if(arrObj.type === 'CRX'){
						let new_version = arrObj.version.replace(/\./, "");
						let cVersion = localStorage['version']
						let showFlag = false;
						if(!cVersion){
							showFlag = true;
						} else {
							let current_version = cVersion.replace(/\./, "");
							if(Number(new_version) > Number(current_version)){
								showFlag = true;
							}
						}
						if(showFlag){
							let mes = "The new version ["+arrObj.version+"] has been released, please update to experience the new features!";
							if(lang == 'zh-CN'){
								mes = "新版本["+arrObj.version+"]已发布，请更新之后体验新功能！";
								// $("#renew_version_button").attr("title", "更新");
							} else {
								// $("#renew_version_button").attr("title", "Renew");
							}
							// $("#renew_version_button").show();

							$("#message_dialog_div").html(mes)
							$("#dialog_button").hide()
							// $("#dialog_button").one("click", function(){
							// 	chrome.runtime.reload();
							// })
							$("#myModal").modal("show")
						} else {
							// $("#renew_version_button").hide();
						}
					}
				}
				$("#androidDown").html(_html)				
			},
			error: function(){
				console.info("service net exception");
			}
		})
	},
	this.signOut = function(){
		localStorage['login_status'] = '0'
		localStorage['login_email'] = ''
		$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>disconnecting</font>");
		winBackgroundPage.server.popupEvent(404);
		// $("#login_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	},
	this.forgetPassword = function(){
		$("#load_div").show()
		var strlognid = $("#email").val()
		if(strlognid == ""){
			$("#load_div").hide()
			showMessage("email must exist!", "电子邮件必须存在！");
			return ;
		}
		if(!validateEmail(strlognid)){
			$("#load_div").hide()
			showMessage("email format error!", "电子邮件格式错误！");
			return ;
		}

		$.ajax({
			url: getDomainData()+'/astarnew/user/getBackPass?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: strlognid
			},
			success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				showMessage("email send success!", "电子邮件发送成功！");
			},
			error: function(){
				$("#load_div").hide()
				showMessage("Network exception, please try again later", "网络异常，请稍后重试");
			}
		})
	},
	this.showMess = function(mess){
		
	},
	this.userButton = function(){
		$("#user_button").bind("click", function(){
			localStorage['userButton'] = "1"
			showMessage("open the standby channel, please close the window and connect, and connect after reopening the window.", "打开备用频道，请关闭窗口并连接，重新打开窗口后再连接。");
		})

		$.ajax({
			url: getDomainData()+'/astarnew/user/userButton?' + new Date().getTime(),
			type: 'get',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id
			},
			success: function(json){
				if(json.nCode != 0){
					$("#user_button").hide()
					localStorage.removeItem("userButton")
					localStorage.removeItem("userM")
					return ;
				}
				$("#user_button").show()
				localStorage['userM'] = json.strText
			},
			error: function(){
				showMessage("Network exception, please try again later", "网络异常，请稍后重试");
			}
		})
	},
	this.resendActivEmail = function(){
		$("#load_div").show()
		var strlognid = $("#email_register").val()
		if(strlognid == ""){
			$("#load_div").hide()
			showMessage("email must exist!", "电子邮件必须存在！");
			return ;
		}
		if(!validateEmail(strlognid)){
			$("#load_div").hide()
			showMessage("email format error!", "电子邮件格式错误！");
			return ;
		}

		$.ajax({
			url: getDomainData()+'/astarnew/user/activateEmailSend?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: strlognid
			},
			success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				showMessage("email send success!", "电子邮件发送成功！");
			},
			error: function(){
				$("#load_div").hide()
				showMessage("Network exception, please try again later", "网络异常，请稍后重试");
			}
		})
	}
	/*,
	this.showIP = function(){
		chrome.storage.local.get(['_sl'], function(result) {
			if(result._sl == undefined){
				return ;
			}
			var _d = result._sl;
			//$(".ip").html("disconnect");
		});
	}*/
	// ,
	// this.showWebRtc = function(state){
	// 	var webRtcState = localStorage['webRtcState']
	// 	if(state){
	// 		webRtcState = state
	// 	}
	// 	if(webRtcState == '1'){
	// 		$("#startWebRtc").css({"display":"block"});
	// 		$("#stopWebRtc").css({"display":"none"});
	// 	} else {
	// 		$("#startWebRtc").css({"display":"none"});
	// 		$("#stopWebRtc").css({"display":"block"});
	// 	}
	// }
}

function validateEmail(email){
	var reg=/^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]{1,}){0,}@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,}){1,})$/;

	if( !reg.test( email ) ) 
		return false
	else 
		return true
}

function showMessage(mess, cnMess){
	let showMess = mess;
	if(lang == 'zh-CN' && cnMess){
		showMess = cnMess;
	}
	$("#message_dialog_div").html(showMess)
	$("#dialog_button").hide()
	$("#myModal").modal("show")
}

function showResvendPass(mess){
	$("#message_dialog_div").html(mess)
	$("#dialog_button").one("click",function(){
		popup.forgetPassword()
	})
	$("#dialog_button").show()
	$("#myModal").modal("show")
}

function showActivEmailSend(mess){
	$("#message_dialog_div").html(mess)
	$("#dialog_button").one("click",function(){
		popup.resendActivEmail()
	}) 
	$("#dialog_button").show()
	$("#myModal").modal("show")
}

var popup = new popupFun();
popup.init();
popup.listenerSt();
popup.userButton()
popup.getActivityConfig()
popup.getClientInfo()

// version info show
function autoShowVersion(){
	$.get(chrome.extension.getURL('manifest.json'), function(info){
		var version = localStorage['version']
		$("#version_current").html(info.version);
		if(!version){
			showCurrentProxy()
			localStorage['version'] = info.version
			chrome.tabs.create({url: "https://astarvpn.com/index.html"})
			return ;
		}
		if(version != info.version){
			showCurrentProxy()
			localStorage['version'] = info.version
			chrome.tabs.create({url: "https://astarvpn.com/index.html"})
			return ;
		}
	}, 'json');
}
autoShowVersion()


function showCurrentProxy(){	
	var _i = localStorage['_i'];
	if(_i == undefined || _i == '-1'){
		return ;
	}
	var _sl = localStorage['_sl'];
	if(_sl == undefined){
		return ;
	}

	var state = localStorage['state'];
	if(state == undefined || state == 0){
		return ;
	}

	var _d = JSON.parse(_sl)
	
	for(var i = 0;i < _d.d.length;i++){
		if(_i == undefined){
			if(i == 0){
				chrome.browserAction.setBadgeBackgroundColor({color:[16,201,33,100]});
				chrome.browserAction.setBadgeText({text:_d.d[i].p.replace(".png", "")});
			}
		} else {
			if(_d.d[i].i == _i){
				chrome.browserAction.setBadgeBackgroundColor({color:[16,201,33,100]});
				chrome.browserAction.setBadgeText({text:_d.d[i].p.replace(".png", "")});
			}
		}
	}
}

function isShowDownAndroid(){
	var userAgent = window.navigator.userAgent;
	if(userAgent.indexOf('Chrome') != -1 && userAgent.indexOf('Edg') != -1){
		$("#androidDown").hide()
	}
}

function isShowClashProxy(){
	if(localStorage['clashProxy'] && localStorage['clashProxy'] == '1'){
		$("#clashProxy").css("top", "0%")
	}
}

function refreshUserData(){
	var email = localStorage['login_email']

	$.ajax({
		url: getDomainData()+'/astarnew/user/userInfo?' + new Date().getTime(),
		type: 'post',
		dataType: 'json',
		data: {
			strP:chrome.runtime.id, strlognid: email
		},
		success: function(json){
			if(json.nCode != 0){
				return ;
			}
			var data = json.jsonObject
			$("#strLognId").html(data.email)
			$("#referalCode").html(data.referralCode)
			if(data.referrer && data.referrer != ""){
				$("#referrerData").html(data.referrer);
				$("#referrer_data_button").hide();
			} else {
				$("#referrerData").html("");
				let ref_title = "Add referrer";
				if(lang == 'zh-CN'){
					ref_title = "添加推荐人";
				}
				$("#referrer_data_button").html(ref_title);
				$("#referrer_data_button").show();
			}
			if(data.nCurrValidTime == "0"){
				$("#nCurrValidTime").html(data.nCurrValidTime + " second")
			} else {
				$("#nCurrValidTime").html(data.nCurrValidTime)
			}
			let showRewardTime = data.rewardTime ? data.rewardTime : 0;
			$("#rewardTime").html(showRewardTime + " day")
			let col_title = "Collection time";
			if(lang == 'zh-CN'){
				col_title = "领取时间";
			}
			$("#reward_time_button").attr("title", col_title);
			if(showRewardTime === 0){
				$("#reward_time_button").hide();
			}
			localStorage['nCurrValidTime'] = data.nCurrValidTime;
			localStorage['subEmailData'] = data.subEmailData;
			
			if(data.nCurrValidTime != '0'){
				$("#vip_img").show()
			} else {
				$("#vip_img").hide()
			}
		},
		error: function(){
			console.info("service net exception");
		}
	})
}

function setLanguage(){
	let defaultLang = "en";
	if(lang == 'zh-CN'){
		defaultLang = "cn";
	} 
	$("[i18n]").i18n({
		defaultLang: defaultLang,
		filePath: "./i18n/",
		filePrefix: "i18n_",
		fileSuffix: "",
		forever: true,
		callback: function(res) {}
	});
}

function blockerInit(){
	let abBlockStatus = localStorage['abBlockStatus']
	if(abBlockStatus && abBlockStatus == '1'){
		$("#adBlocker").attr('checked', true);
	}
	$("#adBlocker").change(function() { 
		if($(this).is(':checked')){
			winBackgroundPage.abBlock.setStatus(1);
		} else {
			winBackgroundPage.abBlock.setStatus(0);
		}
	});

	let cookieBlockStatus = localStorage['cookieBlockStatus']
	if(cookieBlockStatus && cookieBlockStatus == '1'){
		$("#cookieBlocker").attr('checked', true);
	}
	$("#cookieBlocker").change(function() { 
		if($(this).is(':checked')){
			winBackgroundPage.cookieBlock.setStatus(1);
		} else {
			winBackgroundPage.cookieBlock.setStatus(0);
		}
	});

	let malwareBlockerStatus = localStorage['malwareBlockerStatus']
	if(malwareBlockerStatus && malwareBlockerStatus == '1'){
		$("#malwareBlocker").attr('checked', true);
	}
	$("#malwareBlocker").change(function() { 
		if($(this).is(':checked')){
			winBackgroundPage.malwareBlocker.setStatus(1);
		} else {
			winBackgroundPage.malwareBlocker.setStatus(0);
		}
	});

	let trackerBlockerStatus = localStorage['trackerBlockerStatus']
	if(trackerBlockerStatus && trackerBlockerStatus == '1'){
		$("#trackerBlocker").attr('checked', true);
	}
	$("#trackerBlocker").change(function() { 
		if($(this).is(':checked')){
			winBackgroundPage.trackerBlocker.setStatus(1);
		} else {
			winBackgroundPage.trackerBlocker.setStatus(0);
		}
	});

	let webRTCObjStatus = localStorage['webRTCObjStatus']
	if(webRTCObjStatus && webRTCObjStatus == '1'){
		$("#webRTC").attr('checked', true);
	}
	$("#webRTC").change(function() { 
		if($(this).is(':checked')){
			winBackgroundPage.webRTCObj.setStatus(1);
			winBackgroundPage.webRTCObj.stop();
		} else {
			winBackgroundPage.webRTCObj.setStatus(0);
			winBackgroundPage.webRTCObj.start();
		}
	});

}

function BlackList(){
	this.setData = function(url){
		let strBlackList = localStorage['blackList'];
		if(!strBlackList || strBlackList == ""){
			strBlackList = "[]";
		}
		let blackList = JSON.parse(strBlackList);
		if(blackList == undefined || blackList.length == 0){
			blackList = []
			blackList.push(url);
		} else {
			let dataIndex = blackList.indexOf(url);
			if(dataIndex === -1){
				blackList.push(url);
			}
		}
		localStorage['blackList'] = JSON.stringify(blackList);
	}
	this.isExist = function(){
		let strBlackList = localStorage['blackList'];
		if(!strBlackList || strBlackList == ""){
			return false;
		}
		let blackList = JSON.parse(strBlackList);
		if(blackList && blackList.length > 0){
			return true;
		}
		return false;
	}
	this.getData = function(){
		let strBlackList = localStorage['blackList'];
		if(!strBlackList || strBlackList == ""){
			return undefined;
		}
		let blackList = JSON.parse(strBlackList);
		return blackList;
	}
	this.deleteData = function(data){
		let strBlackList = localStorage['blackList'];
		if(!strBlackList || strBlackList == ""){
			return ;
		}
		let blackList = JSON.parse(strBlackList);
		if(blackList == undefined || blackList.length == 0){
			return ;
		}
		let index = blackList.indexOf(data);
		if (index > -1) {
			blackList.splice(index, 1);
		}
		localStorage['blackList'] = JSON.stringify(blackList);
	}
	this.urlExist = function(data){
		let strBlackList = localStorage['blackList'];
		if(!strBlackList || strBlackList == ""){
			return false;
		}
		let blackList = JSON.parse(strBlackList);
		if(blackList == undefined || blackList.length == 0){
			return false;
		}
		let dataIndex = blackList.indexOf(data);
		if(dataIndex === -1){
			return false;
		}
		return true;
	},
	this.showContent = function(){
		let _html = "";
		let dataArr = blackList.getData();
		if(dataArr && dataArr.length > 0){
			for(let i = 0;i < dataArr.length;i++){
				let _dataBlack = dataArr[i];
				_html += '<div style="height: 30px; text-align: left;padding-left: 30px;">';
                _html += '	<span class="label label-info">' + _dataBlack + '</span>';
                _html += '	<button type="button" class="btn btn-default btn-lg" name="blackRemove" value="' + _dataBlack + '">';
                _html += '    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
                _html += '	</button>';
            	_html += '</div>';
			}
			$("#blackContent").html(_html);


			$("[name='blackRemove']").bind("click", function(){
				let _value = $(this).attr("value");
				blackList.deleteData(_value);
				blackList.showContent();
				showMessage("Successfully deleted!", "删除成功！");
				
				resetLine();
			})
		} else {
			$("#blackContent").html("");
		}
		$("#blackList").css("top", "0%")
	}
	this.init = function(){

		if(lang == 'zh-CN'){
			$("#blackSave").attr("title", "保存黑名单");
			$("#showBlackList").attr("title", "打开黑名单");
		} else {
			$("#blackSave").attr("title", "Save Blacklist");
			$("#showBlackList").attr("title", "Open Blacklist");
		}

		$("#blackSave").bind("click", function(){
			let currentLink = localStorage['currentLink'];
			if(!currentLink || currentLink == ""){
				showMessage("Link cannot be empty!", "链接不能为空！");
				return ;
			}
			if(currentLink == '无效域名' || currentLink == 'invalid domain'){
				showMessage("Invalid domain name, cannot be added!", "无效域名,不能添加!");
				return ;
			}
			blackList.setData(currentLink);
			showMessage("Saved successfully!", "保存成功！");

			resetLine();
		})

		$("#blackSubmit").bind("click", function(){
			let localLink = $("#localLink").val();
			if(!localLink || localLink == ""){
				showMessage("Link cannot be empty!", "链接不能为空！");
				return ;
			}
			blackList.setData(localLink);
			blackList.showContent();
			showMessage("Added successfully!", "添加成功！");

			resetLine();
		})

		$("#close_blackList").bind("click", function(){
			$("#blackList").css("top", "100%")
		})

		$("#showBlackList").bind("click", function(){
			blackList.showContent();
		})
	
	}
}
var blackList = new BlackList();
blackList.init();

function resetLine(){
	var state = localStorage['state'];
	if(state == undefined){
		return ;
	}
	if(state == 1){
		$("body").addClass("loading");
		$(".ip").html("<font style='font-family: verdana, sans-serif;font-size: 30px;font-weight: bold;'>connecting</font>");
		winBackgroundPage.server.popupEvent(200);
	}
}

function setCurrentLink(){
	let currentLink = localStorage['currentLink'];
	$("#currentLink").html(currentLink);
	$("#currentLink").attr("title", currentLink);
}

function PCClientMess(){
	this.showContent = function(){
		let closeMes = "Close";
		if(lang == 'zh-CN'){
			$("#pcclient_mess").html("客户端线路更快，更稳定，请点击上面客户端图片进行下载使用。")
			closeMes = "关闭";
		} else {
			$("#pcclient_mess").html("The client line is faster and more stable, please click the client picture above to download and use.")
		}
		$("#pcclientDiv").css("top", "420px")
		$("#pcclient_close").show();
		$("#pcclient_close").attr("title", closeMes);
		$("#pcclient_close").one("click", function(){
			$("#pcclientDiv").css("top", "100%")
			$("#pcclient_close").hide();
		});

		$("#pcclientQution").bind("click", function(){
			chrome.tabs.create({url: "https://astarvpn.com/index.html"})
		});
	}
}
var pcClientMess = new PCClientMess();
pcClientMess.showContent();


function getDomainData(){
	let domainL = '.iosedge.com'
	var d = new Date();
	var time = 'w' + (d.getMonth()+1) + '' + d.getDate() + '' + d.getHours() + 's'
	domainL = time + domainL 
	if(localStorage['ddomain'] && localStorage['ddomain'] != ''){
		domainL = localStorage['ddomain']
	}
	return 'https://' + domainL
}

$(function(){
	setLanguage();
	isShowClashProxy()
	// isShowDownAndroid()

	blockerInit();

	localStorage['_click'] = '1';

	if(localStorage['login_status'] && localStorage['login_status'] == '1'){
		var email = localStorage['login_email']

		$.ajax({
            url: getDomainData()+'/astarnew/user/userInfo?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: email
            },
            success: function(json){
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				var data = json.jsonObject
				$("#strLognId").html(data.email)
				$("#referalCode").html(data.referralCode)
				if(data.referrer && data.referrer != ""){
					$("#referrerData").html(data.referrer);
					$("#referrer_data_button").hide();
				} else {
					$("#referrerData").html("");
					let ref_title = "Add referrer";
					if(lang == 'zh-CN'){
						ref_title = "添加推荐人";
					}
					$("#referrer_data_button").html(ref_title);
					$("#referrer_data_button").show();
				}
				if(data.nCurrValidTime == "0"){
					$("#nCurrValidTime").html(data.nCurrValidTime + " second")
				} else {
					$("#nCurrValidTime").html(data.nCurrValidTime)
				}
				let showRewardTime = data.rewardTime ? data.rewardTime : 0;
				$("#rewardTime").html(showRewardTime + " day")
				let col_title = "Collection time";
				if(lang == 'zh-CN'){
					col_title = "领取时间";
				}
				$("#reward_time_button").attr("title", col_title);
				if(showRewardTime === 0){
					$("#reward_time_button").hide();
				}
				localStorage['nCurrValidTime'] = data.nCurrValidTime;
				localStorage['subEmailData'] = data.subEmailData;

				$("#loginForm").hide()
				$("#login_div").hide()
				$("#userData").show()
				$("#login_out_div").show()
				$("#signOut").show()
				if(data.nCurrValidTime != '0'){
					// $(".x-select-item").each(function(){
					// 	// console.info($(this).attr("value"))
					// 	var _value = $(this).attr("value")
					// 	if(Number.parseInt(_value) < 0){
					// 		winBackgroundPage.server.popupEvent(200);
					// 		return ;
					// 	}
					// })
					$("#vip_img").show()
				} else {
					// var _value = $(this).attr("value")
					// if(Number.parseInt(_value) < 0){
					// 	winBackgroundPage.server.popupEvent(404);
					// }
					$("#vip_img").hide()
				}
            },
            error: function(){
				console.info("service net exception");
				winBackgroundPage.server.popupEvent(404);
            }
        })


	}
	
	$('#vpn-on').bind("click", function(){
		var _click = localStorage['_click']
		if(_click == 0){
			return ;
		}
		localStorage['_click'] = '0';
		popup.change();
	});
	
	$("#x-select-view-div").bind("click", function(){
		var _dispaly = $(".x-select-dropdown").css("display");
		if(_dispaly == 'none'){
			$(".x-select-dropdown").css("display", "block");
		} else {
			$(".x-select-dropdown").css("display", "none");
		}

		$("#proxyLine").css({"top": "0%"});

	});

	$("#backmain_btn").bind("click", function(){
		$("#proxyLine").css({"top": "100%"})
	})

	$("#refresh_auto").bind("click", function(){
		$("#load_div").show();
		winBackgroundPage.server.popupEvent(202)
		setTimeout(function(){
			$("#load_div").hide();
		}, 1000);
	})

	$("#open-settings").bind("click", function(){
		$("#setting-panel").css({"width":"100%"});
		$("#setting-header").css({"display":"block"});
		$("#setting-body").css({"display":"block"});
		$("#open-settings").hide()
		$("#close-settings").show()
		// $("#login_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	});
	
	$("#close-settings").bind("click", function(){
		$("#setting-header").css({"display":"none"});
		$("#setting-body").css({"display":"none"});
		$("#setting-panel").css({"width":"0px"});
		$("#close-settings").hide()
		$("#open-settings").show()
	});
	
	$(".wechat").hover(function(){
		$(".wechatshare").css({"display":"block"});
	},function(){
		$(".wechatshare").css({"display":"none"});
	});
	
	// $("#stopWebRtc").bind("click", function(){
	// 	chrome.permissions.request({
	// 		permissions: ['privacy'],
	// 	}, (granted) => {
	// 		console.info(granted)
	// 		if (granted) {
	// 			winBackgroundPage.stopWebRtc()
	// 			popup.showWebRtc('1')
	// 			localStorage['webRtcState'] = '1';
	// 		} else {
	// 			popup.showWebRtc('2')
	// 			localStorage['webRtcState'] = '2';
	// 		}
	// 	})
	// });
	
	// $("#startWebRtc").bind("click", function(){
	// 	winBackgroundPage.startWebRtc()
	// 	chrome.permissions.remove({
	// 		permissions: ['privacy'],
	// 	}, (granted) => {
	// 		console.info(granted)
	// 		if (granted) {
	// 			popup.showWebRtc('2')
	// 			localStorage['webRtcState'] = '2';
	// 		} else {
	// 			popup.showWebRtc('1')
	// 			localStorage['webRtcState'] = '1';
	// 		}
	// 	})
	// });
	
	$("[name='five_astar']").bind("click", function(){
		var userAgent = window.navigator.userAgent;
		var t = "";
		if(userAgent.indexOf('Chrome') != -1){
			if(userAgent.indexOf('Edg') != -1){
				t = "https://microsoftedge.microsoft.com/addons/detail/astar-vpn-free-and-fast/phnnpafoelnadmgjkinijkbaogoekoff";
			} else {
				t = "https://chrome.google.com/webstore/detail/jajilbjjinjmgcibalaakngmkilboobh/reviews?utm_source=chrome-ntp-icon";
			}
		} else {
			t = "https://addons.mozilla.org/zh-CN/firefox/addon/jajilbjjinjmgcibalaakngmkilboobh/";
		}
		
		window.open(t,"about")
	});
	
	$("[name='share_img']").bind("click", function(){
		var  t = 'https://chrome.google.com/webstore/detail/jajilbjjinjmgcibalaakngmkilboobh';
		var i = 'Astar VPN';
		var n = 'Astar VPN - Free and fast VPN for everyone. Easily watch 720P, 1080P, 1440P, 4K, 8K videos on YouTube.';
		var toPage = $(this).attr("id");
		
		if(toPage == 'facebook'){
			window.open("https://www.facebook.com/sharer/sharer.php?u="+t,"facebook")
		} else if(toPage == 'twitter'){
			window.open("https://twitter.com/intent/tweet?text="+i+": "+n+"&url="+t,"twitter")
		} else if(toPage == 'weibo'){
			window.open("http://service.weibo.com/share/share.php?title="+i+": "+n+"&url="+t+"&pic=","weibo")
		} else if(toPage == 'google'){
			window.open("https://plus.google.com/share?url="+t,"google")
		} else if(toPage == 'qzone'){
			window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+t+"&title="+i+": "+n+"&desc="+i+": "+n+"&summary="+i+": "+n+"&site="+i+": "+n,"qzone")
		}
		});
	
	$("#androidDownload").bind("click", function(){
		$("#hide_div").css({"display": "block"})
		$("#androidDownload").css({"display": "none"})
	})

	$("#hideAndroidDownload").bind("click", function(){
		$("#hide_div").css({"display": "none"})
		$("#androidDownload").css({"display": "block"})
	})

	$("#goHref").bind("click", function(){
		chrome.tabs.create({url: "https://get.astarvpn.app/"})
	})


	$("#goRegister").bind("click", function(){
		$("#loginForm").hide()
		$("#registerForm").show()
		// $("#register_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	})

	$("#goLogin").bind("click", function(){
		$("#registerForm").hide()
		$("#loginForm").show()
		// $("#login_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	})

	$("#login_img").bind("click", function(){
		// $("#login_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	})

	$("#register_img").bind("click", function(){
		// $("#register_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	})

	$("#loginSubmit").bind("click", function(){
		$("#load_div").show()
		var strlognid = $("#email").val()
		var strpassword = $("#pwd").val()
		var codeV = $("#code").val()
		if(strlognid == ""){
			$("#load_div").hide()
			showMessage("email must exist!", "邮箱不能为空！")
			return ;
		}
		if(!validateEmail(strlognid)){
			$("#load_div").hide()
			showMessage("email format error!", "邮箱格式错误！")
			return ;
		}
		if(strpassword == ""){
			$("#load_div").hide()
			showMessage("password must exist!", "密码不能为空！")
			return ;
		}
		// if(codeV == ""){
		// 	$("#load_div").hide()
		// 	showMessage("code must exist!")
		// 	return ;
		// }

		$.ajax({
            url: getDomainData()+'/astarnew/user/loginCode?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: strlognid, strvcode: '123456'
            },
            success: function(json){
				if(json.nCode != 0){
					$("#load_div").hide()
					localStorage['login_status'] = '0';
					localStorage['login_email'] = ''
					showMessage(json.strText, json.chStrText)
					return ;
				}
				var jsonObject = json.jsonObject
				var strPassToken = jsonObject.strPassToken
				var strSalt = jsonObject.strSalt
				var data1 = hex_md5(hex_md5(strpassword) + strSalt)
				var strrandompasscode = hex_md5(data1 + strPassToken)
				var clientUUID = localStorage['clientUUID']
				if(!clientUUID){
					clientUUID = ''
				}

				$.ajax({
					url: getDomainData()+'/astarnew/user/login?' + new Date().getTime(),
					type: 'post',
					dataType: 'json',
					data: {
						strP:chrome.runtime.id, strlognid: strlognid, strrandompasscode: strPassToken, strpasstoken: strrandompasscode, strvcode: '123456', clientUUID: clientUUID
					},
					success: function(json){
						$("#load_div").hide()
						if(json.nCode != 0){
							localStorage['login_status'] = '0';
							localStorage['login_email'] = ''
							showMessage(json.strText, json.chStrText)
							return ;
						}
						localStorage['login_status'] = '1';
						localStorage['login_email'] = strlognid;
						$("#login_div").hide()
						$("#loginForm").hide()
						$("#userData").show()
						$("#login_out_div").show()
						$("#signOut").show()

						$("#email").val("")
						$("#pwd").val("")
						$("#code").val("")

						var data = json.jsonObject
						$("#strLognId").html(data.email)
						$("#referalCode").html(data.referralCode)
						if(data.referrer && data.referrer != ""){
							$("#referrerData").html(data.referrer);
							$("#referrer_data_button").hide();
						} else {
							$("#referrerData").html("");
							let ref_title = "Add referrer";
							if(lang == 'zh-CN'){
								ref_title = "添加推荐人";
							}
							$("#referrer_data_button").html(ref_title);
							$("#referrer_data_button").show();
						}
						if(data.nCurrValidTime == "0"){
							$("#nCurrValidTime").html(data.nCurrValidTime + " second")
						} else {
							$("#nCurrValidTime").html(data.nCurrValidTime)
						}
						let showRewardTime = data.rewardTime ? data.rewardTime : 0;
						$("#rewardTime").html(showRewardTime + " day")
						let col_title = "Collection time";
						if(lang == 'zh-CN'){
							col_title = "领取时间";
						}
						$("#reward_time_button").attr("title", col_title);
						if(showRewardTime === 0){
							$("#reward_time_button").hide();
						}
						localStorage['subEmailData'] = data.subEmailData;
						localStorage['nCurrValidTime'] = data.nCurrValidTime;
						
						// NEW
						if(data.nCurrValidTime == '0'){
							// chrome.tabs.create({url: "astar.html"})
						} else {
							$("#vip_img").show()
							winBackgroundPage.server.popupEvent(202)
						}
					},
					error: function(){
						$("#load_div").hide()
						showMessage("service net exception", "网络连接异常，请稍后重试");
					}
				})
            },
            error: function(){
				$("#load_div").hide()
				showMessage("service net exception", "网络连接异常，请稍后重试");
            }
        })

	})

	$("#registerSubmit").bind("click", function(){
		$("#load_div").show()
		var strlognid = $("#email_register").val()
		var strpassword = $("#pwd_register").val()
		var strpassword2 = $("#pwd2_register").val()
		var referrerCodeRegister = $("#referrerCode_register").val()
		var codeV = $("#code_register").val()
		if(strlognid == ""){
			$("#load_div").hide()
			showMessage("email must exist!", "邮箱不能为空！")
			return ;
		}
		if(!validateEmail(strlognid)){
			$("#load_div").hide()
			showMessage("email format error!", "邮箱格式错误！")
			return ;
		}
		if(strpassword == ""){
			$("#load_div").hide()
			showMessage("password must exist!", "密码不能为空！")
			return ;
		}
		if(strpassword != strpassword2){
			$("#load_div").hide()
			showMessage("two password is not same!", "二次输入密码不一致！")
			return ;
		}
		// if(codeV == ""){
		// 	$("#load_div").hide()
		// 	showMessage("code must exist!")
		// 	return ;
		// }
		var clientUUID = localStorage['clientUUID']
		if(!clientUUID){
			clientUUID = ''
		}

		$.ajax({
            url: getDomainData()+'/astarnew/user/register?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: strlognid, strpassword: strpassword, strvcode: '123456', clientUUID: clientUUID, referrerCode: referrerCodeRegister
            },
            success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText, json.chStrText)
					return ;
				}
				
				showMessage(json.strText, json.chStrText)
				$("#email_register").val("")
				$("#pwd_register").val("")
				$("#pwd2_register").val("")
				$("#code_register").val("")
				$("#referrerCode_register").val("")

				$("#registerForm").hide()
				$("#loginForm").show()

            },
            error: function(){
				$("#load_div").hide()
				showMessage("service net exception", "网络连接异常，请稍后重试");
            }
        })

	})

	$("#rechargeSubmit").bind("click", function(){
		chrome.tabs.create({url: "astar.html"})
	})

	$("#strLognId").bind("click", function(){
		chrome.tabs.create({url: "account.html"})
	})

	$("#signOut").bind("click", function(){
		$("#load_div").show()

		var strlognid = localStorage['login_email']
		var clientUUID = localStorage['clientUUID']
		if(!clientUUID){
			clientUUID = ''
		}
		$.ajax({
            url: getDomainData()+'/astarnew/user/signOut?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: strlognid, clientUUID: clientUUID
            },
            success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				
				popup.signOut()
				$("#vip_img").hide()
				$("#userData").hide()
				$("#signOut").hide()
				localStorage.clear();
				$("#loginForm").show()
				// $("#price_div").hide()
				$("#login_div").show()
            },
            error: function(){
				$("#load_div").hide()
				showMessage("service net exception", "网络连接异常，请稍后重试");
            }
        })
	})

	$("#forgot-link").bind("click", function(){
		let mes = "sure to retrieve the password?";
		if(lang == 'zh-CN'){
			mes = "确定要找回密码吗？";
		}
		showResvendPass(mes)
	})

	$("#activation-link").bind("click", function(){
		let mes = "sure to resend email?";
		if(lang == 'zh-CN'){
			mes = "确定要重新发送激活电子邮件吗？";
		}
		showActivEmailSend(mes)
	})

	$("#signup-tab").bind("click", function(){
		$("#signin-tab").removeClass("active")
		$("#loginForm").hide()
		$("#signup-tab").addClass("active")
		$("#registerForm").show()
		// $("#register_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	})

	$("#signin-tab").bind("click", function(){
		$("#signup-tab").removeClass("active")
		$("#registerForm").hide()
		$("#signin-tab").addClass("active")
		$("#loginForm").show()
		// $("#login_img").attr("src", "https://'+getDomainData()+'/astarnew/user/code?" + new Date().getTime())
	})

	$("#changePasswordLi").bind("click", function(){
		$("#change-password-old").val("")
		$("#change-password").val("")
		$("#change-password-confirmation").val("")
		$("#changePassword").css("top", "0px")
	})

	$("#subEmailSubmit").bind("click", function(){
		if(localStorage['subEmailData'] && localStorage['subEmailData'] != ''){
			$("#subEmailData").val(localStorage['subEmailData'])
		} else {
			$("#subEmailData").val("")
		}
		$("#subEmaillDiv").css("top", "0px")
	})

	// $("#version_info").bind("click", function(){
	// 	chrome.tabs.create({url: "version.html"})
	// })

	$("#version-link").bind("click", function(){
		chrome.tabs.create({url: "version.html"})
	})


	$("#back_btn").bind("click", function(){
		$("#changePassword").css("top", "100%")
		$("#changePasswordSubmit").removeClass("active")
	})

	$("#changePasswordSubmit").bind("click", function(){
		$("#load_div").show()
		var oldPassword = $("#change-password-old").val()
		var newPassword = $("#change-password").val()
		var newPasswordConfirmation = $("#change-password-confirmation").val()
		if(oldPassword == ''){
			$("#load_div").hide()
			showMessage('old password must exist', "旧密码不能为空")
			return ;
		}
		if(newPassword == ''){
			$("#load_div").hide()
			showMessage('new password must exist', "新密码不能为空")
			return ;
		}
		if(newPassword != newPasswordConfirmation){
			$("#load_div").hide()
			showMessage('new password confirmation is error', "新密码二次确认不一致")
			return ;
		}
		var email = localStorage['login_email']
		$("#changePasswordSubmit").addClass("active")
		$.ajax({
			url: getDomainData()+'/astarnew/user/changePassword?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: email, oldPassword: oldPassword, newPassword: newPassword
			},
			success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				showMessage("change password is success!", "修改密码成功")
				$("#changePassword").css("top", "100%")
				$("#changePasswordSubmit").removeClass("active")
			},
			error: function(){
				$("#load_div").hide()
				// console.info("service net exception");
			}
		})
	})

	$("#subEmail_back_btn").bind("click", function(){
		$("#subEmaillDiv").css("top", "100%")
		$("#subEmaillSubmitN").removeClass("active")
	})

	$("#subEmaillSubmitN").bind("click", function(){
		$("#load_div").show()
		var subEmailData = $("#subEmailData").val()
		if(subEmailData == ''){
			$("#load_div").hide()
			showMessage('Email must exist', "邮箱不能为空")
			return ;
		}

		if(localStorage['subEmailData'] && localStorage['subEmailData'] == subEmailData){
			$("#load_div").hide()
			showMessage('The email has been bound', "邮箱已绑定")
			return ;
		}

		if(!validateEmail(subEmailData)){
			$("#load_div").hide()
			showMessage("Email format error!", "邮箱格式错误")
			return ;
		}

		var email = localStorage['login_email']
		$.ajax({
			url: getDomainData()+'/astarnew/user/setSubEmail?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: email, subEmail: subEmailData
			},
			success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
                showMessage("Bind successfully!", "绑定成功")
				$("#subEmaillDiv").css("top", "100%")
				$("#subEmaillSubmitN").removeClass("active")

				localStorage['subEmailData'] = subEmailData
			},
			error: function(){
				$("#load_div").hide()
				// console.info("service net exception");
			}
		})
	})

	$("#closeButton").click(function(){
        winBackgroundPage.getOtherExtensions(function(exts){
			if(exts.length > 0){
				for(var i in exts){
					var extensionInfo = exts[i];
                    chrome.management.setEnabled(extensionInfo.id, false, function(){
                        
                    });
                }
			}
		});
		localStorage['clashProxy'] = '0'
		chrome.browserAction.setBadgeText({text:""});
		$("#clashProxy").css("top", "100%")
        winBackgroundPage.client.init()
    })

	$("#close_clashProxy").click(function(){
		$("#clashProxy").css("top", "100%")
	})

	$("#activityDiv").click(function(){
		chrome.tabs.create({url: "astar.html"})
	})

	$("#reward_time_button").bind("click", function(){
		$("#load_div").show()

		var strlognid = localStorage['login_email']
		if(!strlognid){
			$("#load_div").hide()
			return ;
		}

		$.ajax({
            url: getDomainData()+'/astarnew/user/receiveRewardTime?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: strlognid
            },
            success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				refreshUserData();
				showMessage(json.strText)
            },
            error: function(){
				$("#load_div").hide()
				showMessage("service net exception", "网络异常，请稍后重试");
            }
        })
	})

	$("#renew_version_button").bind("click", function(){
		chrome.runtime.reload();
	})

	$("#referrer_data_button").bind("click", function(){
		$("#referrerInputData").val("")
		$("#referrerDiv").css("top", "0px")
	})

	$("#referrerSubmitN").bind("click", function(){
		$("#load_div").show()

		var strlognid = localStorage['login_email']
		if(!strlognid){
			$("#load_div").hide()
			return ;
		}

		let referrerCode = $("#referrerInputData").val();
		if(!referrerCode || referrerCode == ""){
			$("#load_div").hide()
			showMessage("Referral code cannot be empty", "推荐码不能为空");
			return ;
		}
		let selfRefCode = $("#referalCode").html();
		if(selfRefCode == referrerCode){
			$("#load_div").hide()
			showMessage("The recommendation code cannot be the current user's recommendation code", "推荐码不能是当前用户推荐码");
			return ;
		}
		

		$.ajax({
            url: getDomainData()+'/astarnew/user/bindReferrer?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: strlognid, referrerCode: referrerCode
            },
            success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText, json.chStrText)
					return ;
				}
				refreshUserData();
				showMessage("Set successfully", "设置成功")
				$("#referrerDiv").css("top", "100%")
            },
            error: function(){
				$("#load_div").hide()
				showMessage("service net exception", "网络异常，请稍后重试");
            }
        })
	})

	$("#referrer_back_btn").bind("click", function(){
		$("#referrerDiv").css("top", "100%")
	})
})

