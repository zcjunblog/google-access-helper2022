var submitPay = 0

function astarObject(){
	this.showProductPrice = function(){
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
				var productPriceList = json.jsonObject.productPriceList

				let lang = window.navigator.language
				for(var i = 0;i < productPriceList.length;i++){
					var productPrice = productPriceList[i]
					if(lang == 'zh-CN'){
						$("#price_font_" + (i+1)).html('价格 $'+productPrice.price)
						$("#ori_price_font_" + (i+1)).html('$'+productPrice.oriPrice)
						$("#name_font_" + (i+1)).html(' ' +productPrice.cnName)
						$("#product_price_" + (i+1)).html("US$"+productPrice.price)
						$("#product_name_" + (i+1)).html(productPrice.cnName)
						$("#product_price_id_" + (i+1)).val(productPrice.productPriceId)
					} else {
						$("#price_font_" + (i+1)).html('Price $'+productPrice.price)
						$("#ori_price_font_" + (i+1)).html('$'+productPrice.oriPrice)
						$("#name_font_" + (i+1)).html(' ' +productPrice.name)
						$("#product_price_" + (i+1)).html("US$"+productPrice.price)
						$("#product_name_" + (i+1)).html(productPrice.name)
						$("#product_price_id_" + (i+1)).val(productPrice.productPriceId)
					}
				}
			},
			error: function(){
				console.info("service net exception");
			}
		})
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
				
				if(enMessage != '' || chMessage != ''){
					let lang = window.navigator.language
					if(lang == 'zh-CN'){
						$("#hMessage").html(chMessage)
					} else {
						$("#hMessage").html(enMessage)
					}
					$("#hTime").html(astar.getTimeDiff(lang, dtEndTime))
					setInterval(function(){
						$("#hTime").html(astar.getTimeDiff(lang, dtEndTime))
					}, 1000)
					$("#activity_div").show()
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
        var date3 = new Date(activityEndTime).getTime() - astar.getZoneTime(0)
        if(date3 <= 0){
            if(lang == 'zh-CN'){
				return "已结束"
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
			return  days + "day " + hours + "hour " + minutes + "minute " + seconds + "second"
		}
    },
	this.getPayType = function(num){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var email = localStorage['login_email']

			$.ajax({
				url: getDomainData()+'/astarnew/user/getPayType?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id, strlognid: email
				},
				success: function(json){
					submitPay = 0
					if(json.nCode != 0){
						showMessage(json.strText)
						return ;
					}
					
					var div_html = ""
					var payTypeList = json.jsonObject.payTypeList
					for(var i = 0;i < payTypeList.length;i++){
						var payType = payTypeList[i]
						var pmId = payType.pmId
						var pic = payType.pic
						var name = payType.name
						
						div_html += "<div id='" + pmId + "' style='cursor: pointer;  display: inline-block; margin-left: 20px; margin-top: 20px;padding: 5px;'>"
						if(pic == null || pic  == ''){
							div_html += "<span>" + name + "</span>"
						} else {
							div_html += "<img src='/img/" + pic + "'/>"
						}
						div_html += "</div>"
					}

					$("#Cashier_div").html(div_html)

					for(var i = 0;i < payTypeList.length;i++){
						var payType = payTypeList[i]
						var pmId = payType.pmId
						$("#" + pmId).unbind("click")
						$("#" + pmId).bind("click", function(){
							if(submitPay == 1){
								return ;
							}
							var pId = $(this).attr("id")
							submitPay = 1
							$("#load_div").show()
							astar.rechargeSubmit(num, pId)
						})
						
						$("#" + pmId).unbind("mouseover")
						$("#" + pmId).bind("mouseover", function(){
							$(this).addClass("block_div")
						})
						
						$("#" + pmId).unbind("mouseout")
						$("#" + pmId).bind("mouseout", function(){
							$(this).removeClass("block_div")
						})
					}

					$('#CashierModal').modal("show");
				},
				error: function(){
					console.info("service net exception");
				}
			})
		}
	},
    this.rechargeSubmit = function(num, pmId){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var email = localStorage['login_email']
			var productPriceId = $("#product_price_id_" + num).val()

			$.ajax({
				url: getDomainData()+'/astarnew/user/charge?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id, strlognid: email, productPriceId: productPriceId, pmId: pmId
				},
				success: function(json){
					submitPay = 0
					if(json.nCode != 0){
						$("#load_div").hide()
						$('#CashierModal').modal("hide");
						showMessage(json.strText)
						return ;
					}
					var url = json.strText
					chrome.tabs.create({url: url})
				},
				error: function(){
					// console.info("service net exception");
				}
			})
		}
	}
}

var astar = new astarObject();
astar.showProductPrice()
astar.getActivityConfig()

function showMessage(mess, cnMess){
	let showMess = mess;
	let lang = window.navigator.language
	if(lang == 'zh-CN' && cnMess){
		showMess = cnMess;
	}
	$("#message_dialog_div").html(showMess)
	$("#dialog_button").hide()
	$("#myModal").modal("show")
}

function setLanguage(){
	let lang = window.navigator.language
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

	$("#product_price_button_1").bind("click", function(){
		// $("#load_div").show()
		astar.getPayType(1)
	})

	$("#product_price_button_2").bind("click", function(){
		// $("#load_div").show()
		astar.getPayType(2)
	})

	$("#product_price_button_3").bind("click", function(){
		// $("#load_div").show()
		astar.getPayType(3)
	})

	$("#closeButton").bind("click", function(){
		$("#NoPermissioniframe").attr("src", "");
		$('#NoPermissionModal').modal("hide");
	})

	$("#closeButtonX").bind("click", function(){
		$("#NoPermissioniframe").attr("src", "");
		$('#NoPermissionModal').modal("hide");
	})

	$("#account_foot").bind("click", function(){
		chrome.tabs.create({url: "account.html"})
	})

	$("#CashierCloseButton").bind("click", function(){
		$('#CashierModal').modal("hide");
	})

	$("#CashierCloseButtonX").bind("click", function(){
		$('#CashierModal').modal("hide");
	})
})