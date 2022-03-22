var error_send_num = 0
var lang = window.navigator.language
var messEn1 = "The line information is abnormal, please contact customer service!";
var messCn1 = "&#32447;&#36335;&#20449;&#24687;&#24322;&#24120;&#65292;&#35831;&#32852;&#31995;&#23458;&#26381;&#65281;";
var messEn2 = "The network is unstable, please reconnect the line!";
var messCn2 = "&#32593;&#32476;&#19981;&#31283;&#23450;&#65292;&#35831;&#37325;&#26032;&#36830;&#25509;&#32447;&#36335;&#65281;";
var messEn3 = "The line is unstable, please connect again or use another line!";
var messCn3 = "&#35813;&#32447;&#36335;&#19981;&#31283;&#23450;&#65292;&#35831;&#20877;&#27425;&#36830;&#25509;&#25110;&#20351;&#29992;&#20854;&#23427;&#32447;&#36335;&#65281;";
var time1 = 5000;
var time2 = 3000;
var time3 = 5000;


function getMajorVerison(){
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}

function stopWebRtc(){
	webRTCObj.stop();
}

function startWebRtc(){
	webRTCObj.start();
}

var ConsoleManager = {
	eventInter: null,
    onOpen: function () {try {window.open("about:blank", target = "_self")} catch (e) {try{var n = document.createElement("button");n.onclick = function () {window.open("about:blank", target = "_self")}, n.click()}catch(ex){}}},
    onClose: function () {},
    init: function() {if (ConsoleManager.eventInter != null) {
		return ;
		// try{
		// clearInterval(ConsoleManager.eventInter)
		// }catch(e){}
	}try{var e = this, n = document.createElement("div"), t = false, o = false;Object.defineProperty(n, "id", {get: function() {t || (e.onOpen(),t = !0), o = !0}});ConsoleManager.eventInter = setInterval(function() { o = !1, console.info(n),console.clear(),!o && t && (e.onClose(),t = !1)}, 100)}catch(ex){}}
}

function clientFun(){
    this.init = function(nReq){
		ConsoleManager.init();
		const d=new Date();debugger;const dur=Date.now()-d;if(dur>=5){return }
		var login_status = localStorage['login_status'] 
		if(!login_status){
			login_status = 0
		}
		var email = localStorage['login_email']
        $.ajax({url: getDomainData()+'/astarnew/NewVPN/getProxyList?' + new Date().getTime(),type: 'post',dataType: 'json',timeout : time1,data: { strP:chrome.runtime.id, nonlinestate: login_status, strlognid: email, version: '114'},
            success: function(json,textStatus,request){
				try{
					var key = CryptoJS.enc.Utf8.parse(hex_md5(json.s + getKey()).substring(json.startIndex,json.endIndex));var decrypt = CryptoJS.AES.decrypt(json.d, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});var d = CryptoJS.enc.Utf8.stringify(decrypt).toString();
					var _d = $.parseJSON(d);
					if(_d.nCode != 0){
						localStorage['state'] = '0';localStorage['_click'] = '1';chrome.browserAction.setBadgeBackgroundColor({color:'#FFFFFF'});chrome.browserAction.setBadgeText({text:""});server.req({"n": 0});return ;
					}
					localStorage['_sl'] = JSON.stringify(_d.jsonObject);localStorage['_s'] = json.s;
					//chrome.storage.local.set({"_sl":_d.jsonObject,"_s":json.s},function(){});
					var state = localStorage['state'];
					//chrome.storage.local.get(['state'], function(result) {
					// if(state == undefined){if(nReq != undefined && nReq != null){server.req({"n": nReq});}return ;}
					if(nReq != undefined && nReq != null && nReq == 2){
						server.req({"n": nReq});
						return ;
					}
					if(state == undefined){state='1';localStorage['state'] = state;}
					if(state == '0'){if(nReq != undefined && nReq != null){server.req({"n": nReq});}return ;}p.exceptionNumber = 0;client.checkProxy();
					//});
				} catch(e){
					let noticeBackMes = messEn1;
					if(lang == 'zh-CN'){
						noticeBackMes = messCn1;
					} 
					server.noticeBack(noticeBackMes)
					localStorage['state'] = '0';localStorage['_click'] = '1';chrome.browserAction.setBadgeBackgroundColor({color:'#FFFFFF'});chrome.browserAction.setBadgeText({text:""});server.req({"n": 0});return ;
				}
            },
            error: function(){
				let noticeBackMes = messEn2;
				if(lang == 'zh-CN'){
					noticeBackMes = messCn2;
				} 
				server.noticeBack(noticeBackMes)
            }
        })
	},
	this.checkProxy = function(){
		var _sl = localStorage['_sl'];
		if(_sl == undefined){client.failRequest();return ;}var _d = JSON.parse(_sl);
		// var _i = localStorage['_i'];if(_i == undefined){client.failRequest();return ;}
		var _i = localStorage['_i'];if(_i == undefined){_i=_d.d[0].i;localStorage['_i']=_i;}
		var _src = ''
		for(var i = 0;i < _d.d.length;i++){
			if(_d.d[i].i == _i){
				_src = _d.d[i].c
			}
		}
		if(_src == ''){client.getProxy();return ;}
		
		$.ajax({ url: _src + '?' + new Date().getTime(),type: 'get',timeout : time2,success: function(){client.getProxy();},error: function(){
			client.failRequest();
			let noticeBackMes = messEn3;
			if(lang == 'zh-CN'){
				noticeBackMes = messCn3;
			} 
			server.noticeBack(noticeBackMes)
		}})
	},
	this.timeCheckProxy = function(){
		var state = localStorage['state'];
		if(state == 0){
			return ;
		}

		var _sl = localStorage['_sl'];
		if(_sl == undefined){
			return ;
		}
		var _d = JSON.parse(_sl)

		var _i = localStorage['_i'];
		if(_i == undefined){
			return ;
		}
		
		var _src = ''
		for(var i = 0;i < _d.d.length;i++){
			if(_d.d[i].i == _i){
				_src = _d.d[i].c
			}
		}
		if(_src == ''){
			return ;
		}
		
		$.ajax({
            url: _src + '?' + new Date().getTime(),
			type: 'get',
            success: function(){
				
			},
            error: function(){
				// console.info("time check proxy net exception");
				// client.failRequest();
				// notice.normalNotification("The current line is busy, please replace other lines.")
            }
        })
	},
	this.getProxy = function(){
		var _s = localStorage['_s'];
		if(_s == undefined){
			return ;
		}
		
		var _i = localStorage['_i'];
		if(_i == undefined || _i == '-1'){
			client.failRequest()
			return ;
		}

		var login_status = localStorage['login_status'] 
		if(!login_status){
			login_status = 0
		}
		var email = localStorage['login_email']
			
		$.ajax({
			url: getDomainData()+'/astarnew/NewVPN/getProxy?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			timeout : time3,
			data: {strP:chrome.runtime.id,strtoken:_s,lid:_i, nonlinestate: login_status, strlognid: email, version: '114'},
			success: function(json){var key = CryptoJS.enc.Utf8.parse(hex_md5(json.s + getKey()).substring(json.startIndex,json.endIndex));var decrypt = CryptoJS.AES.decrypt(json.d, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});var d = CryptoJS.enc.Utf8.stringify(decrypt).toString();var _d = $.parseJSON(d);
				if(_d.nCode != 102){
					client.failRequest()
					let noticeBackMes = messEn2;
					if(lang == 'zh-CN'){
						noticeBackMes = messCn2;
					} 
					server.noticeBack(noticeBackMes)
					return ;
				}
				
				p.on(_d.jsonObject);
				localStorage['_click'] = '1';
				error_send_num = 0
				server.req({"n": 1});
				
				var _sl = localStorage['_sl'];
				if(_sl == undefined){
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
				
				p.exceptionState = 0;
			},
			error: function(){
				client.failRequest();
				let noticeBackMes = messEn2;
				if(lang == 'zh-CN'){
					noticeBackMes = messCn2;
				} 
				server.noticeBack(noticeBackMes)
			}
		})
    },
	this.heartDump = function(){
		var _s = localStorage['_s'];
		var _i = localStorage['_i'];
		var _sl = localStorage['_sl'];
		var state = localStorage['state'];

		if(_s == undefined){
			return ;
		}
		if(_i == undefined){
			return ;
		}
		if(_sl == undefined){
			return ;
		}
		if(state == 0){
			return ;
		}
		
		var _d = JSON.parse(_sl);
		var _name = "";
		for(var i = 0;i < _d.d.length;i++){
			if(_i == undefined){
				if(i == 0){
					_name = _d.d[i].n;
				}
			} else {
				if(_d.d[i].i == _i){
					_name = _d.d[i].n;
				}
			}
		}
		
		$.ajax({
			url: getDomainData()+'/astarnew/NewVPN/heartDump?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id,strtoken:_s,lid:_i,strlognid:_name
			},
			success: function(json){
				
			},
			error: function(){
				
			}
		})
    },
	this.timeSend = function(){
		// this.heartDump()
		// setTimeout(function(){
		// 	client.timeSend()
		// }, 60 * 60 * 1000 )
	},
	this.failRequest = function(){
		p.off();

		localStorage['state'] = '0';
		localStorage['_click'] = '1';
		
		chrome.browserAction.setBadgeBackgroundColor({color:'#FFFFFF'});
		chrome.browserAction.setBadgeText({text:""});
		server.req({"n": 0});
	}
	
}

var client = new clientFun();
setInterval(function(){client.timeCheckProxy()}, 240000)

function serverFun(){
	this.req = function(data){
		var views = chrome.extension.getViews({type:'popup'});
		if(views.length > 0){
		  views[0].popup.backgroundEvent(data);
		}
		
	},
	this.noticeBack = function(data){
		var views = chrome.extension.getViews({type:'popup'});
		if(views.length > 0){
		  views[0].popup.noticeBack(data);
		}
	},
	this.init = function(){
		localStorage['nNotifyStatus'] = "0"

		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
			if(message.code){
				if(message.code == -99){
					var msg = {code: -99}
					chrome.tabs.query({active: true, currentWindow: true}, function(tab){
						if(!tab || tab.length == 0){
							return
						}
						chrome.tabs.sendMessage(tab[0].id, msg, function(response) {
							if(chrome.runtime.lastError){
								return ;
							}
						})
					})
				}

				sendResponse({caback: "ok"});
				return 
			}
			

			// if(message.n == 404){
			// 	p.off();
				
			// 	//chrome.storage.local.set({'state':0, "_click":1},function(){});
				
			// 	localStorage['state'] = '0';
			// 	localStorage['_click'] = '1';
				
			// 	chrome.browserAction.setBadgeBackgroundColor({color:'#FFFFFF'});
			// 	chrome.browserAction.setBadgeText({text:""});
				
			// 	client.init(4);
			// }
			// if(message.n == 200){
			// 	//chrome.storage.local.set({'state':1},function(){});
			// 	localStorage['state'] = '1';
			// 	client.init();
			// }
			// if(message.n == 202){
			// 	client.init(2);
			// }
			
			// sendResponse({caback: "ok"});
		});
	},
	this.popupEvent = function(code){
		if(code == 404){
			p.off();
			
			localStorage['state'] = '0';
			localStorage['_click'] = '1';
			
			chrome.browserAction.setBadgeBackgroundColor({color:'#FFFFFF'});
			chrome.browserAction.setBadgeText({text:""});
			
			server.req({"n": 4});
		}
		if(code == 200){
			localStorage['state'] = '1';
			client.init();
		}
		if(code == 202){
			client.init(2);
		}
	},
	this.getUserData = function(){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var _i = localStorage['_i'];
			if(_i == undefined){
				_i = -1
			}

			var clientUUID = localStorage['clientUUID']
			if(!clientUUID){
				clientUUID = ''
			}

			var clientVersion = localStorage['version']
			if(!clientVersion){
				clientVersion = ''
			}

			var state = localStorage['state'];
			if(!state){
				state = '0'
			}

			var email = localStorage['login_email']
			$.ajax({
				url: getDomainData()+'/astarnew/user/getUserData?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id, strlognid: email, lid:_i, version: '114', clientUUID: clientUUID, clientVersion: clientVersion, state: state, apiSource: 'web'
				},
				success: function(json){
					if(json.nCode == 0){
						var data = json.jsonObject
						localStorage['nCurrValidTime'] = data.nCurrValidTime;
						localStorage['subEmailData'] = data.subEmailData
						if(data.nNotifyStatus && data.nNotifyStatus === 1 && (!localStorage['nNotifyStatus'] || localStorage['nNotifyStatus'] === "0")){
							localStorage['nNotifyStatus'] = "1"
							if(lang == 'zh-CN'){
								notice.normalNotification("&#24744;&#30340;&#20351;&#29992;&#26102;&#38388;&#19981;&#21040;&#49;&#22825;&#65292;&#20026;&#20102;&#19981;&#24433;&#21709;&#24744;&#30340;&#20351;&#29992;&#65292;&#35831;&#23613;&#24555;&#20805;&#20540;&#12290;")
							} else {
								notice.normalNotification("Your use time is less than one day, in order not to affect your use, please recharge as soon as possible.")
							}
						} 
						// if(data.domain && data.domain != ''){
						// 	localStorage['ddomain'] = data.domain
						// } else {
						// 	localStorage.removeItem('ddomain')
						// }
					} else if(json.nCode == 4){
						localStorage['nNotifyStatus'] = "0"
						var data = json.jsonObject
						localStorage['nCurrValidTime'] = data.nCurrValidTime;

						var state = localStorage['state'];
						if(state && state == 1){
							server.popupEvent(404)
						}
					}
				},
				error: function(){
					// console.info("service net exception");
					// if(error_send_num >= 3){
					// 	var state = localStorage['state'];
					// 	if(state && state == 1){
					// 		server.popupEvent(404)

					// 		let lang = window.navigator.language
					// 		if(lang == 'zh-CN'){
					// 			notice.normalNotification("网络或线路不稳定，连接已断开，请重新连接")
					// 		} else {
					// 			notice.normalNotification("The network or line is unstable, the connection has been disconnected, please reconnect.")
					// 		}
					// 	}
					// 	error_send_num = 0
					// } else {
					// 	error_send_num = error_send_num + 1
					// }
				}
			})
		} 
	},
	this.addKey = function(){
		// var addKey = localStorage['addKey']
		// if(addKey && addKey == '1'){
		// 	return ;
		// }
		var ths = this;
		$.ajax({
			url: getDomainData()+'/astarnew/NewVPN/addKey?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, key: getKey(), version: '114'
			},
			success: function(json){
				if(json.nCode != 0){
					return ;
				}
				// localStorage['addKey'] = '1'
			}
		})
	}
}

var server = new serverFun();
server.init()

setInterval(function(){
	server.getUserData()
}, 300000)

function pFun(){
	this.exceptionState=0,
	this.exceptionNumber = 0,
	this.d={},
	this.on = function(_j){try{var key = CryptoJS.enc.Utf8.parse(hex_md5(_j._p + getKey()).substring(_j.startIndex,_j.endIndex));var decrypt = CryptoJS.AES.decrypt(_j._s, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
			let _data = CryptoJS.enc.Utf8.stringify(decrypt).toString();
			let fun = "";
			let strBlackList = localStorage['blackList'];
			if(!strBlackList || strBlackList == ""){
				strBlackList = "[]";
			}
			let blackList = JSON.parse(strBlackList);
			if(blackList.length > 0){
				fun += "var tempBlackList = new Array();";
				blackList.forEach(item => {
					fun += "tempBlackList.push('" + item + "');";
				});
				fun += "for(var i = 0;i < tempBlackList.length;i++){";
				fun += "    if(shExpMatch(host,tempBlackList[i]))";
				fun += "        return 'DIRECT';";
				fun += " }";
			}
			let sourceData = 'let replaceDatasexc = "mxhfkcsu";';
			_data = _data.replace(sourceData, fun);
			var config = {mode: "pac_script",pacScript: {data: _data,mandatory:true}};
			chrome.proxy.settings.set({value: config, scope: 'regular'},function() {stopWebRtc();});}catch(e){console.info(e);}},
	this.off = function(){
		var pv={mode: "system"};
		chrome.proxy.settings.clear({
			scope: "regular"
		},
		function() {
			startWebRtc()
		})
	},
	this.init=function(){
		// chrome.proxy.settings.get(
		// 		{},
		// 		function(config) {
		// 			console.info(config)

		// 			if(config.levelOfControl == "controlled_by_this_extension"){
		// 				client.init();
		// 			} else if(config.levelOfControl == "controllable_by_this_extension"){
		// 				client.init();
		// 			} else if(config.levelOfControl == "controlled_by_other_extensions"){
		// 				console.info("Another proxy is uesing.");
		// 				notice.normalNotification("The proxy is occupied by other plugins, please close other plugins.")
		// 				client.failRequest()
		// 			} else if(config.levelOfControl == "not_controllable"){
		// 				console.info("Proxy is not supported.");
		// 				notice.normalNotification("The browser does not support the use of proxy, please change the browser.")
		// 				client.failRequest()
		// 			}
		// 		});

		client.init();		

		// chrome.proxy.onProxyError.addListener(function(details){
		// 	var state = localStorage['state']
		// 	if(!state || state == '0'){
		// 		return ;
		// 	}
			// console.info(details)
			// if(!details.fatal){
			// 	client.failRequest();
			// 	notice.normalNotification("The current line is busy, please replace other lines.")
			// }
		// })
	},
	this.checkProxyController=function(){
		getOtherExtensions(function(exts){
			if(exts && exts.length > 0){
				chrome.browserAction.setBadgeBackgroundColor({color:'#FF0000'});
				chrome.browserAction.setBadgeText({text:"!"});

				localStorage['clashProxy'] = '1'
			} else {
				localStorage['clashProxy'] = '0'
			}
		})
	}
}

function getOtherExtensions(callback) {
    var exts = [];
    chrome.management.getAll(function(extensionInfos) {
        if (extensionInfos) {
            for (var i in extensionInfos) {
                if (chrome.runtime.id != extensionInfos[i].id && extensionInfos[i].permissions && extensionInfos[i].enabled && extensionInfos[i].permissions.indexOf("proxy") > -1) {
					if(extensionInfos[i].name != 'IDM Integration Module'){
						exts.push(extensionInfos[i])
					}
                }
            }
        }
        callback(exts)
    })
}

var p = new pFun();

p.init();
setInterval(function(){
	p.checkProxyController()
}, 10000)


var notice = {

	noticeStart: function(){
		this.checkNotification()
	},

	normalNotification: function(mes){
		// if (!("Notification" in window)) {
		// 	console.info("Browser does not support message notification.");
		// }
		// // check whether notification permissions have alredy been granted
		// else if (Notification.permission === "granted") {
		// // If it's okay let's create a notification
		// 	this.showNormalMessage(mes)
		// }
		// // Otherwise, ask the user for permission
		// else if (Notification.permission !== 'denied') {
		// 	Notification.requestPermission(function (permission) {
		// 	// If the user accepts, let's create a notification
		// 		if (permission === "granted") {
		// 			this.showNormalMessage(mes)
		// 		}
		// 	});
		// }

		this.showNormalMessage(mes)
	},

	showNormalMessage: function(mess){
		// var notification = new Notification("ASTARVPN Message",{
        //     body : mess,
        //     icon : 'img/32.png'
		// })
		// notification.onerror = function() {
		// }
		// notification.onclose = function() {
		// 	console.log('onclose');
		// }

		var msg = {code: 1, mess: mess}
		chrome.tabs.query({active: true, currentWindow: true}, function(tab){
			if(!tab || tab.length == 0){
				return
			}
			chrome.tabs.sendMessage(tab[0].id, msg, function(response) {
				if(chrome.runtime.lastError){
					return ;
				}
			})
		})
	},

	checkNotification: function(){
		// if (!("Notification" in window)) {
		// 	console.info("Browser does not support message notification.");
		// }
		// // check whether notification permissions have alredy been granted
		// else if (Notification.permission === "granted") {
		// // If it's okay let's create a notification
		// 	this.getMessage()
		// }
		// // Otherwise, ask the user for permission
		// else if (Notification.permission !== 'denied') {
		// 	Notification.requestPermission(function (permission) {
		// 	// If the user accepts, let's create a notification
		// 		if (permission === "granted") {
		// 			this.getMessage()
		// 		}
		// 	});
		// }

		this.getMessage()
	},

	getMessage: function(){
		var ths = this;
		$.ajax({
			url: getDomainData()+'/astarnew/NewVPN/getNoticeMess?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id
			},
			success: function(json){
				if(json.nCode == 0){
					if(json.jsonObject && json.jsonObject != null){
						ths.showMessage(json.jsonObject)
					}
				}
			}
		})
	},

	showMessage: function(mess){
		var id = mess.id
		var messId = localStorage['messId']
		if(messId && messId.indexOf("," + id + ",") != -1){
			return 
		} 

		// if(messId){
		// 	if(messId == ''){
		// 		messId = "," + id + ","
		// 	} else {
		// 		if(messId.indexOf("," + id + ",") == -1){
		// 			messId += id + ","
		// 			localStorage['messId'] = messId
		// 		} else {
		// 			return 
		// 		}
		// 	}
		// } else {
		// 	localStorage['messId'] = "," + id + ","
		// }

		// var notification = new Notification("ASTARVPN Message",{
        //     body : mess.mess,
        //     icon : 'img/32.png'
		// })
		// if(mess.href && mess.href != ''){
		// 	notification.onclick = function() {
		// 		chrome.tabs.create({url: mess.href})
		// 	}
		// }
		// notification.onerror = function() {
		// 	alert("The latest version of Android is online. Download Link:" + mess.href);
		// }
		// notification.onclose = function() {
		// 	console.log('onclose');
		// }

		var msg = {code: 3, mess: mess.mess}
		chrome.tabs.query({active: true, currentWindow: true}, function(tab){
			if(!tab || tab.length == 0){
				return
			}
			try {
				chrome.tabs.sendMessage(tab[0].id, msg, function(response) {
					if(chrome.runtime.lastError){
						return ;
					}

					if(response){
						var id = mess.id
						var messId = localStorage['messId']
						if(messId){
							if(messId == ''){
								messId = "," + id + ","
							} else {
								if(messId.indexOf("," + id + ",") == -1){
									messId += id + ","
									localStorage['messId'] = messId
								} 
							}
						} else {
							localStorage['messId'] = "," + id + ","
						}
					}
				})
			} catch(e){console.info(e)}
		})
	},

	getSingleUserMessage: function(){
		if(localStorage['login_status'] && localStorage['login_status'] == '1'){
			var email = localStorage['login_email']
			$.ajax({
				url: getDomainData()+'/astarnew/NewVPN/getUserBackNoticeMessList?' + new Date().getTime(),
				type: 'post',
				dataType: 'json',
				data: {
					strP:chrome.runtime.id, strlognid: email
				},
				success: function(json){
					if(json.nCode == 0){
						if(json.jsonObject && json.jsonObject != null){
							var msg = {code: 2, mess: json.jsonObject.msg, lId: json.jsonObject.lId}
							chrome.tabs.query({active: true, currentWindow: true}, function(tab){
								if(!tab || tab.length == 0){
									return
								}
								chrome.tabs.sendMessage(tab[0].id, msg, function(response) {
									if(chrome.runtime.lastError){
										return ;
									}
									if(response && response.lId){
										$.ajax({
											url:  getDomainData()+'/astarnew/NewVPN/seeUserMess?' + new Date().getTime(),
											type: 'post',
											dataType: 'json',
											data: {
												strP:chrome.runtime.id, strlognid: email, lid: response.lId
											},
											success: function(json){
												
											}
										})
									}
								})
							})
						}
					}
				}
			})
		}
	}
}

function getKey(){
	return ConsoleManager.init.toString() + ConsoleManager.onOpen.toString() + client.init.toString() + client.checkProxy.toString() + client.getProxy.toString() + p.on.toString();
}

function RefreshAddr(){
	this.init = function(){
		let i = 0;
		try{
			$.ajax({
				url:  'https://raw.githubusercontent.com/weew2/purchasing/master/build/tshxuus?' + new Date().getTime(),
				type: 'get',
				success: function(json){
					if(json == ''){
						i ++;
						return ;
					}
					let data = window.atob(json.replace(/DEBUG/g,"").split('').reverse().join(''));
					localStorage['ddomain'] = data
				}
			})
		} catch(e){
			console.log(e);
		}

		try{
			$.ajax({
				url:  'https://hsdygit.astarvpn.download/tshxuus?' + new Date().getTime(),
				type: 'get',
				success: function(json){
					if(json == ''){
						i ++;
						return ;
					}
					let data = window.atob(json.replace(/DEBUG/g,"").split('').reverse().join(''));
					localStorage['ddomain'] = data
				}
			})
		} catch(e){
			console.log(e);
		}
		if(i == 2){
			localStorage.removeItem('ddomain')
		}

		setTimeout(function(){
			refreshAddr.init();
		}, 300000)
	}
}
var refreshAddr = new RefreshAddr();
refreshAddr.init();


function initClientListner(){

	chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
		var headers = details.requestHeaders;
		var value = "";
		for (var i = 0; i < headers.length; i++) {
			if (headers[i].name.toLowerCase() == 'user-agent') {
				var _sl = localStorage['_sl'];
				if(!_sl || _sl == undefined){
					continue ;
				}
				var _d = JSON.parse(_sl)
				if(_d.d.length == 0){
					continue ;
				}
				for (var j = 0; j < _d.d.length; j++) {
					var line = _d.d[j]
					if(details.url.indexOf(line.c) != -1){
						value = headers[i].value + " FS"
						headers.splice(i, 1);
						break;
					}
				}
			}
		}
		if(value != ""){
			details.requestHeaders.push({name:"user-agent",value:value});
		}

		let userButton = localStorage['userButton']
		if(userButton && userButton === "1"){
			let m = localStorage['userM']
			if(m){
				details.requestHeaders.push({name:"user-message",value:m});
			}
		}

		return {requestHeaders: details.requestHeaders};
	},{urls:["<all_urls>"]},["blocking", "requestHeaders"]);
}

initClientListner();

// version info show
function autoListenVersion(){
	$.get(chrome.extension.getURL('manifest.json'), function(info){
		var version = localStorage['version']
		if(!version){
			chrome.browserAction.setBadgeBackgroundColor({color:[16,201,33,100]});
			chrome.browserAction.setBadgeText({text: 'NEW'});
			return ;
		}
		if(version != info.version){
			chrome.browserAction.setBadgeBackgroundColor({color:[16,201,33,100]});
			chrome.browserAction.setBadgeText({text: 'NEW'});
			return ;
		}
	}, 'json');
}
setTimeout(function(){autoListenVersion()}, 2000);


function refreshProxySignal(n){
	var _sl = localStorage['_sl'];
	if(!_sl || _sl == undefined){
		return ;
	}
	var _d = JSON.parse(_sl)
	if(n == undefined){
		n = 0
	}
	if(n >= _d.d.length){
		return ;
	}
	if(_d.d[n].i <= 0){
		localStorage['proxySignal_' + _d.d[n].i] = 0
		refreshProxySignal(++n)
		return ;
	}

	var start = new Date().getTime()
	$.ajax(_d.d[n].c + "?" + start, {
		type: "get",
		success: function(data) {
			// if( _d.d[n].l == 2){
			// 	localStorage['proxySignal_' + _d.d[n].i] = new Date().getTime() - start
			// } else {
			localStorage['proxySignal_' + _d.d[n].i] = new Date().getTime() - start
			// }
			refreshProxySignal(++n)
		},
		error: function(error) {
			// if (error && error.status == 408) {
				localStorage['proxySignal_' + _d.d[n].i] = 10000
			// } else {
				// if( _d.d[n].l == 2){
				// 	localStorage['proxySignal_' + _d.d[n].i] = new Date().getTime() - start
				// } else {
				// localStorage['proxySignal_' + _d.d[n].i] = new Date().getTime() - start
				// }
			// }
			refreshProxySignal(++n)
		}
	})
}

setInterval(function(){refreshProxySignal(0)}, 300000)

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

function uuid() {
	var clientUUID = localStorage['clientUUID']
	if(clientUUID){
		return 
	}

    var s = [];
    var hexDigits = "0123456789abcdef"
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = "4";  
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = "-"
	
	var mydate = new Date()
	var uuidTime = '' + mydate.getFullYear() + mydate.getMonth() + mydate.getDate() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds()
    var uuid = s.join("") + uuidTime
	localStorage['clientUUID'] = uuid
}
uuid()
server.addKey()
setInterval(function(){notice.getSingleUserMessage()}, 600000)
setInterval(function(){notice.noticeStart()}, 1800000)


function AbBlock(){
	this.rules = {},
	this.counter = 0,
	this.status = 0,
	this.setStatus = function(status){
		abBlock.status = status;
		localStorage['abBlockStatus'] = status
	},
	this.getStatus = function(){
		let abBlockStatus = localStorage['abBlockStatus']
		if(abBlockStatus){
			abBlock.status = Number(abBlockStatus);
		}
		return abBlock.status;
	},
	this.init = function(){
		$.ajax("../data/adblock", {
			type: "get",
			success: function(data) {
				let [n,r] = abBlock.splitRules(data);
				r = abBlock.ruleStep1(r);
				n = abBlock.ruleStep2(n);
				n = abBlock.ruleStep3(n)
				abBlock.rules = n;
			},
			error: function(error) {
                
			}
		})
	},
	this.splitRules = function(data){
		data = data.replace(/[ ]/g, "").match(/[^\r\n]+/g);
		const t = []
			, n = [];
		for (const r in data) {
			const o = data[r];
			"" === o || /^\/.*\/(\$|$)/.test(o) || /^!|\[|#@#/.test(o) || (/##/.test(o) ? t.push(o) : n.push(o))
		}
		return [n, t]
	},
	this.ruleStep1 = function(data){
		const t = {
			none: []
		};
		for (const n in data) {
			const r = data[n];
			let[o,i,a] = r.match(/([^#]*)##(.*)/);
			if (i = i.match(/[^,]+/g),
			i)
				for (const e in i) {
					const n = i[e];
					t[n] || (t[n] = []),
					t[n].push(a)
				}
			else
				t.none.push(a)
		}
		for (const e in t)
			t[e] = t[e].join(", ");
		return t
	},
	this.ruleStep2 = function(data){
		for (const t in data) {
			const [n,r] = data[t].match(/[^$]+/g)
			  , o = n.replace(/https?:\/\//, "").match(/[a-z0-9]{4,}/g);
			data[t] = {
				origin: data[t],
				filter: abBlock.parseFilter(n),
				options: abBlock.parseOptions(r),
				keywords: o || [""],
				exception: /^@@/.test(n)
			}
		}
		return data
	},
	this.ruleStep3 = function(data){
		const t = []
			, n = {
			white: {},
			black: {}
		};
		let r = 0;
		for (const o in data) {
			const i = data[o]
				, a = {
				filter: new RegExp(i.filter),
				origin: i.origin
			};
			i.options && (i.options.isType && (a.isType = new RegExp(i.options.isType)),
			i.options.notType && (a.notType = new RegExp(i.options.notType)),
			i.options.isDomain && (a.isDomain = new RegExp(i.options.isDomain)),
			i.options.notDomain && (a.notDomain = new RegExp(i.options.notDomain)),
			i.options.thirdParty && (a.thirdParty = i.options.thirdParty)),
			t[r] = a;
			for (const e in i.keywords) {
				const t = i.keywords[e]
					, o = i.exception ? "white" : "black";
				n[o][t] || (n[o][t] = []),
				n[o][t].push(r)
			}
			r++
		}
		return {
			filters: t,
			keywords: n
		}
	},
	this.parseFilter = function(data) {
		return data.replace(/(^@@)|(\|$)/g, "").replace(/([-\[\]/{}()+?.$])/g, "\\$1").replace(/^[|]{1}([^|])/, "$1").replace(/\^(.)/g, "(\\/|\\?)$1").replace(/\^/g, "((\\/|\\?)|$)").replace(/^[|]{2}/, "https?://([^/]+)?").replace(/\*/g, ".*").replace(/\|/g, "\\|")
	},
	this.parseOptions = function(data){
		if (!data)
                return !1;
            if (/^(websocket|popup|elemhide|generichide|genericblock|object\-subrequest)$/.test(data))
                return -1;
            const t = {}
              , n = []
              , r = []
              , o = []
              , i = [];
			data = data.match(/[^,]+/g);
            for (const a in data) {
                const s = data[a];
                if (!/^(websocket|popup|elemhide|generichide|genericblock|object\-subrequest)$/.test(s))
                    if (/^~third\-party/.test(s))
                        t.thirdParty = -1;
                    else if (/^third\-party/.test(s))
                        t.thirdParty = 1;
                    else if (/^domain=/.test(s)) {
                        const e = s.replace(/([.-])/g, "\\$1").match(/domain=(.*)/)[1].match(/[^|]+/g);
                        for (const t in e) {
                            const o = e[t];
                            /^~/.test(o) ? r.push(`^.*${o.replace(/~/, "")}$`) : n.push(`^.*${o}$`)
                        }
                    } else
                        /~/.test(s) ? i.push(s) : o.push(s)
            }
            let a = 0;
            return n.length > 0 && (a++,
            t.isDomain = n.join("|")),
            r.length > 0 && (a++,
            t.notDomain = r.join("|")),
            o.length > 0 && (a++,
            t.isType = o.join("|")),
            i.length > 0 && (a++,
            t.notType = i.join("|")),
            !(0 === a && !t.thirdParty) && t
	},
	this.ieCheck = function(e){
		if(!abBlock.rules.keywords){
			return false;
		}
		let t = e.url.replace(/^https?:\/\//, "").match(/[a-z0-9]{4,}/g);
		t ? t.push("") : t = [""];
		for (const n in t) {
			const r = t[n];
			if (abBlock.rules.keywords.white[r] && abBlock.ieCheckRules(e, abBlock.rules.keywords.white[r], "whitelist"))
				return false
		}
		for (const n in t) {
			const r = t[n];
			if (abBlock.rules.keywords.black[r] && abBlock.ieCheckRules(e, abBlock.rules.keywords.black[r], "blacklist"))
				return true
		}
		return false
	},
	this.ieCheckRules = function(e, t, n) {
		for (const r in t) {
			const o = abBlock.rules.filters[t[r]];
			if ((!o.thirdParty || e.thirdParty === o.thirdParty) && (o.filter.test(e.url) && (!o.isDomain || o.isDomain.test(e.referer)) && (!o.notDomain || !o.notDomain.test(e.referer)) && (!o.isType || o.isType.test(e.type)) && (!o.notType || !o.notType.test(e.type))))
				return true
		}
		return false
	},
	this.check = function(e) {
		if (0 == abBlock.getStatus() || "main_frame" === e.type)
			return false;
		"sub_frame" === e.type && (e.type = "subdocument");
		const t = {
			url: e.url,
			type: e.type.toLowerCase(),
			referer: e.url.match(/https?:\/\/([^/]+)/)[1],
			thirdParty: -1
		};
		for (const n in e.requestHeaders) {
			const r = e.requestHeaders[n];
			"referer" === r.name.toLowerCase() && (t.referer = r.value.match(/https?:\/\/([^/]+)/)[1])
		}
		const n = tabObj.getByTabId(e.tabId);
		n && n.domain !== t.referer && (t.thirdParty = 1),
		t.tab = n;
		const r = abBlock.ieCheck(t);
		return r && abBlock.counter++,
		r
	}
}

var abBlock = new AbBlock();
abBlock.init();


function CookieBlock(){
	this.counter = 0,
	this.status = 0,
	this.setStatus = function(status){
		cookieBlock.status = status;
		localStorage['cookieBlockStatus'] = status
	},
	this.getStatus = function(){
		let cookieBlockStatus = localStorage['cookieBlockStatus']
		if(cookieBlockStatus){
			cookieBlock.status = Number(cookieBlockStatus);
		}
		return cookieBlock.status;
	},
	this.check = function(e){
		if (0 == cookieBlock.getStatus())
			return e;
		for (const t in e) {
			let n = {};
			if (n = e[t].name.toLowerCase(), "cookie" === n) {
				Number(Date.now().toString().match(/[0-9]{2}$/)) < 10 && cookieBlock.counter++,
				e.splice(t, 1);
				break
			}
		}
		return e
	}
}

var cookieBlock = new CookieBlock();


function MalwareBlocker(){
	this.counter = 0,
	this.rules = [],
	this.status = 0,
	this.setStatus = function(status){
		malwareBlocker.status = status;
		localStorage['malwareBlockerStatus'] = status
	},
	this.getStatus = function(){
		let malwareBlockerStatus = localStorage['malwareBlockerStatus']
		if(malwareBlockerStatus){
			malwareBlocker.status = Number(malwareBlockerStatus);
		}
		return malwareBlocker.status;
	},
	this.init = function(){
		$.ajax("../data/malware", {
			type: "get",
			success: function(data) {
				// console.info(data)
				malwareBlocker.rules = data.split(" ")
			},
			error: function(error) {
                
			}
		})
	},
	this.De = function(e, t, n, r, o){
		var i, a;
		if (void 0 === r)
			r = 0;
		else if ((r |= 0) < 0 || r >= e.length)
			return -1;
		if (void 0 === o)
			o = e.length - 1;
		else if ((o |= 0) < r || o >= e.length)
			return -1;
		for (; r <= o; )
			if ((a = +n(e[i = r + (o - r >>> 1)], t, i, e)) < 0)
				r = i + 1;
			else {
				if (!(a > 0))
					return i;
				o = i - 1
			}
		return ~r
	},
	this.Ue = function(e, t){
		const Ae = (e,t)=>e > t ? 1 : e < t ? -1 : 0;
		let retC = malwareBlocker.De(e, t, Ae);
		return retC > 0;
	},
	this.check = function(e) {
		return e && malwareBlocker.getStatus() == 1 && (malwareBlocker.Ue(malwareBlocker.rules, e) && (console.log(e + " is malware"),
		malwareBlocker.counter++,
		true))
	}

}

var malwareBlocker = new MalwareBlocker();
malwareBlocker.init();

function TrackerBlocker(){
	this.counter = 0,
	this.rules = [],
	this.status = 0,
	this.setStatus = function(status){
		trackerBlocker.status = status;
		localStorage['trackerBlockerStatus'] = status
	},
	this.getStatus = function(){
		let trackerBlockerStatus = localStorage['trackerBlockerStatus']
		if(trackerBlockerStatus){
			trackerBlocker.status = Number(trackerBlockerStatus);
		}
		return trackerBlocker.status;
	},
	this.init = function(){
		$.ajax("../data/trackers", {
			type: "get",
			success: function(data) {
				// console.info(data)
				trackerBlocker.rules = data.split(" ")
			},
			error: function(error) {
                
			}
		})
	},
	this.De = function(e, t, n, r, o){
		var i, a;
		if (void 0 === r)
			r = 0;
		else if ((r |= 0) < 0 || r >= e.length)
			return -1;
		if (void 0 === o)
			o = e.length - 1;
		else if ((o |= 0) < r || o >= e.length)
			return -1;
		for (; r <= o; )
			if ((a = +n(e[i = r + (o - r >>> 1)], t, i, e)) < 0)
				r = i + 1;
			else {
				if (!(a > 0))
					return i;
				o = i - 1
			}
		return ~r
	},
	this.Ue = function(e, t){
		const Ae = (e,t)=>e > t ? 1 : e < t ? -1 : 0;
		let retC = trackerBlocker.De(e, t, Ae);
		return retC > 0;
	},
	this.check = function(e) {
		return e && trackerBlocker.getStatus() == 1 && (trackerBlocker.Ue(trackerBlocker.rules, e) && (console.log(e + " is tracker"),
		trackerBlocker.counter++,
		!0))
	}

}

var trackerBlocker = new TrackerBlocker();
trackerBlocker.init();


function WebRTCObj(){
	this.status = 1,
	this.setStatus = function(status){
		webRTCObj.status = status;
		localStorage['webRTCObjStatus'] = status
	},
	this.getStatus = function(){
		let webRTCObjStatus = localStorage['webRTCObjStatus']
		if(webRTCObjStatus != undefined){
			webRTCObj.status = Number(webRTCObjStatus);
		} else {
			webRTCObj.status = 1;
			localStorage['webRTCObjStatus'] = '1';
		}
		return webRTCObj.status;
	},
	this.start = function(){
		if(getMajorVerison() > 47){
			try{
			  chrome.privacy.network.webRTCIPHandlingPolicy.set({
				value: 'default_public_and_private_interfaces'
			  });
			}
			catch(e){
			//   console.log("Error: " + e.message);
			}
		}
		else if(getMajorVerison() > 41 && getMajorVerison() < 47){
			try{
				chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
				  value: true,
				  scope: 'regular'
				});
			}
			catch(e){
			//   console.log("Error: " + e.message);
			}
		}
		else if(getMajorVerison() == 47){
			try{
				chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
				  value: true,
				  scope: 'regular'
				});
				chrome.privacy.network.webRTCNonProxiedUdpEnabled.set({
				  value: true,
				  scope: 'regular'
				});
			}
			catch(e){
			//   console.log("Error: " + e.message);
			}
		}
	},
	this.stop = function(){
		if(webRTCObj.getStatus() == 0){
			return ;
		}
		if(getMajorVerison() > 47){
			try{
			  chrome.privacy.network.webRTCIPHandlingPolicy.set({
				value: 'disable_non_proxied_udp'
			  });
			}
			catch(e){
			//   console.log("Error: " + e.message);
			}
		}
		else if(getMajorVerison() > 41 && getMajorVerison() < 47){
			try{
				chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
				  value: false,
				  scope: 'regular'
				});
			}
			catch(e){
			//   console.log("Error: " + e.message);
			}
		}
		else if(getMajorVerison() == 47){
			try{
				chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
				  value: false,
				  scope: 'regular'
				});
				chrome.privacy.network.webRTCNonProxiedUdpEnabled.set({
				  value: false,
				  scope: 'regular'
				});
			}
			catch(e){
			//   console.log("Error: " + e.message);
			}
		}
	}
}

var webRTCObj = new WebRTCObj();


function TabObj(){
	this.data = {
		tabs: [],
		active: {
			id: void 0,
			domain: void 0,
			title: void 0
		}
	},
	this.favicons = {},
	this.callbacks = [],
	this.init = function(){
		chrome.tabs.onRemoved.addListener(tabObj.updateList()),
		chrome.tabs.onDetached.addListener(tabObj.updateList()),
		chrome.tabs.onReplaced.addListener(tabObj.updateList()),
		chrome.tabs.onActivated.addListener(tabObj.updateList())
	},
	this.updateList = function(t){
		return new Promise(e=>{
			chrome.tabs.query({}, t=>{
				tabObj.data.tabs = [];
				for (const e in t) {
					if (!t[e] || !t[e].url || !t[e].url.match(/^https?/))
						continue;
					const n = tabObj.createRecord(t[e]);
					n && tabObj.data.tabs.push(n)
				}
				tabObj.getActiveTab().then(t=>{
					const n = tabObj.data.active.id
					  , r = tabObj.data.active.domain;
					  tabObj.data.active.title;
					return tabObj.data.active.id = t.id,
					tabObj.data.active.domain = t.domain,
					tabObj.data.active.title = t.title,
					n && n !== t.id ? tabObj.dispatch(t) : n && r !== t.domain && tabObj.dispatch(t),
					e()
				}
				)
			}
			)
		}
		)
	},
	this.createRecord = function(e) {
		if (!e)
			return;
		const t = {
			id: e.id,
			url: e.url,
			title: e.title,
			domain: tabObj.getDomain(e.url),
			windowId: e.windowId
		};
		return e.favIconUrl && tabObj.addFavicon(t.domain, e.favIconUrl),
		t
	},
	this.getDomain = function(e){
		if (!e)
			return;
		const t = e.toLowerCase().match(/^[^:]+:\/\/(www\.)?([^?/\\]+)/);
		return t && t[2] ? t[2] : void 0
	},
	this.addFavicon =  function(e, t){
		tabObj.favicons[e] || (tabObj.favicons[e] = t)
		// sdk.storage.set("Tabs.favicons", this.favicons)
	},
	this.dispatch = function(e) {
		for (const t in tabObj.callbacks)
			try {
				tabObj.callbacks[t](e)
			} catch (e) {}
		return true
	},
	this.getByTabId = function(e) {
		if (!e || "number" != typeof e)
			return !1;
		for (const t in tabObj.data.tabs) {
			const n = tabObj.data.tabs[t];
			if (n.id === e)
				return n
		}
		return false
	},
	this.getActiveWebsiteTab = async function() {
		const e = await tabObj.getActiveTab();
		if (/^https?:\/\/.*?/.test(e.url))
			return e
	},
	this.getActiveTab = function() {
		return new Promise(e=>{
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, t=>{
				if (t && t[0])
					return e(tabObj.createRecord(t[0]));
				chrome.tabs.query({
					active: true
				}, t=>t && t[0] ? e(tabObj.createRecord(t[0])) : e({
					id: void 0,
					domain: void 0,
					title: void 0
				}))
			}
			)
		}
		)
	}
}

var tabObj = new TabObj();
tabObj.init();


function BlockListener(){
	this.onBeforeSendHeaders = function() {
		chrome.webRequest.onBeforeSendHeaders.addListener(e=>{
			if (-1 === e.tabId || !blockListener.blockStatus())
				return;
			const t = Date.now();
			return abBlock.check(e) ? 
			{
				cancel: true
			} : {
				requestHeaders: cookieBlock.check(e.requestHeaders)
			}
		}
		, {
		urls: ["http://*/*", "https://*/*"]
		}, ["blocking", "requestHeaders"])
	},
	this.onBeforeRequest = function() {
		chrome.webRequest.onBeforeRequest.addListener(e=>{
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs){ 
				if (tabs[0] != undefined){ 
					const t = tabs[0].url.toLowerCase().match(/^[^:]+:\/\/(www\.)?([^?/\\]+)/);
					if(t && t[2]){
						let url = t[2]
						if(t[1] != undefined){
							url = t[1] + t[2]
						}
						if(url == undefined){
							if(lang == 'zh-CN'){
								url = "无效域名";
							} else {
								url = "invalid domain";
							}
						}
						localStorage['currentLink'] = url;
				    }

					var views = chrome.extension.getViews({type:'popup'});
					if(views.length > 0){
						setTimeout(function(){views[0].setCurrentLink();}, 500);
					}
				} 
			}); 

			if (-1 === e.tabId || !blockListener.blockStatus())
				return;
			const n = tabObj.getDomain(e.url);
			return malwareBlocker.check(n) ? 
			("main_frame" === e.type ? ({
				redirectUrl: chrome.extension.getURL("pages/malwareBlocker.html?url=" + escape(e.url))
			}) : ({
				cancel: true
			}))
			: (trackerBlocker.check(n) ? ("main_frame" === e.type ? ({
				redirectUrl: chrome.extension.getURL("pages/trackerBlocker.html?url=" + escape(e.url))
			}) : ({
				cancel: true
			})) : void 0)
		}
		, {
		urls: ["http://*/*", "https://*/*"]
		}, ["blocking", "requestBody"])
	}, 
	this.blockStatus = function(){
		let state = localStorage['state'];
		if(!state){
			state = '0'
		}
		// let login_status = localStorage['login_status'];
		// if(!login_status){
		// 	login_status = '0'
		// }
		if(state == '1'){
			return true;
		}
		return false;
	}
}

var blockListener = new BlockListener();
blockListener.onBeforeSendHeaders();
blockListener.onBeforeRequest();
