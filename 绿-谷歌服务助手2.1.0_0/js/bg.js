var mzk_config = {
    base_domain: "https://api.ijomo.net/",
    vip_base_domain:"",
    app_ver: "1.0.0",
    browser_ver:"",
    device_name: "chrome",
    curr_server_id: "",
    lang:chrome.i18n.getUILanguage(),
    'notice' : {title:"开通VIP可获取更高速加速通道",url:"login.html"},
    'vip_notice' : {title:"IGG官方网站 https://iguge.xyz",url:"https://iguge.xyz"},
    api_ver:"1.0",
    uninstall_url: "",
    read_vip_exp_count:0,
    is_ff_privateBrowsingAllowed:false,
    proxy_permissions_namewhilelist: ["IDM Integration Module"]
};
var mzk_pac_config = {
    geoip_data:"",
    testdomain:{},
    test_pac_domain:[],
    auto_test_server_rank:[],
    geoip_switch : true,
};
var mzk_user_token = "";
var mzk_is_connect = false;
var mzk_select_server_info = false;
var mzk_connect_mode = "smart";
var mzk_user_info = {};
var mzk_server_id = '';
mzk_config.read_vip_exp_count = 1;


function getChromeVersion () {     
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
}

function getFirefoxVersion () {     
    var raw = navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    return raw ? parseInt(raw[1], 10) : false;
}

function getEdgeVersion () {     
    var raw = navigator.userAgent.match(/Edg\/([0-9]+)\./);
    return raw ? parseInt(raw[1], 10) : false;
}

function getOperaVersion () {     
    var raw = navigator.userAgent.match(/OPR\/([0-9]+)\./);
    return raw ? parseInt(raw[1], 10) : false;
}

function user_uninstall(){
    if(typeof mzk_user_info.u_type !== "undefined" && mzk_user_info.u_type === "parent") {
        user_logout();
    }
}

function load_default_data(){
    $.get(chrome.extension.getURL("/localdb/geoip.txt"),function(data){
        mzk_pac_config.geoip_data = data;
    });
}

function get_localdb_cache(key , localdata , _rcallback){
    var cache_str = localStorage.getItem("localcache_"+key);
    if(cache_str) {
        localdata = JSON.parse(cache_str);
        localdata.data = JSON.parse(atob(localdata.data));
        if (_rcallback) 
            _rcallback(localdata);
    }else{
        $.get(chrome.extension.getURL("/localdb/"+key+".txt"),function(data){
            localdata.data = JSON.parse(atob(data));
            set_localdb_cache(key,data,localdata.last_update);
            if (_rcallback) 
                _rcallback(localdata);
        });
    }
}
function set_localdb_cache(key , data , update){
    localStorage.setItem("localcache_"+key,JSON.stringify({data:data,last_update:update}));
}
chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.cmd == "get_base_domain") {
                sendResponse({url: mzk_config.base_domain});
            } else if (request.cmd == "check_proxy_permissions") { // 检测冲突app
                sendResponse({result: 'ok'});
                check_proxy_permissions();
            }  else {
                sendResponse({result: "error", message: "Invalid 'cmd'"});
            }
            return true;
        });

var mzk_backup_server = [
            "https://service.iggapi.me/",
            "https://v2.iggapi.xyz/",
            "https://api100.ctinets.net/",
            "https://api.igghelper.com/",
            "https://api.igghelper.net/",
            "http://cdn.iggapi.xyz/",
            "http://cdn.igghelper.com/",
            "http://cdn.igghelper.net/",
            "http://apiv2.ctinets.net/",
];
        
var mzk_vip_backup_server = [
            "https://api.hw-dns.com/",
            "https://service.jjxiangya.xyz/",
 ];

mzk_config.vip_base_domain = "https://v2.shyonghui.xyz/";


chrome.storage.local.get(['mzk_is_connect',"mzk_server_id", 'mzk_select_server_info','uinfo',"mzk_geoip_switch","proxy_permissions_namewhilelist","backup_url_domain","backup_vip_domain"], function (result) {
    mzk_is_connect = result.mzk_is_connect;
    mzk_server_id = result.mzk_server_id;
    if (result.mzk_select_server_info) {
        mzk_select_server_info = result.mzk_select_server_info;
    }

    if(typeof result.mzk_geoip_switch !== "undefined"){
        mzk_pac_config.geoip_switch = result.mzk_geoip_switch;
    }

    if(typeof result.backup_url_domain !== "undefined"){
        mzk_backup_server = result.backup_url_domain;
    }

    if(typeof result.backup_vip_domain !== "undefined"){
        mzk_vip_backup_server = result.backup_vip_domain;
    }

    if(typeof result.proxy_permissions_namewhilelist !== "undefined"){
        mzk_config.proxy_permissions_namewhilelist = result.proxy_permissions_namewhilelist;
    }

    if(result.uinfo) {
        mzk_user_info = JSON.parse(result.uinfo);
    }

    var browser_ver = getFirefoxVersion();
    if(browser_ver) {
        mzk_config.device_name = "firefox";
        mzk_config.browser_ver = browser_ver;
        check_firefox_privateBrowsingAllowed();
    }else if(navigator.userAgent.match(/Edg\/([0-9]+)\./)){
        browser_ver = getEdgeVersion();
        mzk_config.device_name = "edge";
        mzk_config.browser_ver = browser_ver;
    }else if(navigator.userAgent.match(/OPR\/([0-9]+)\./)){
        browser_ver = getOperaVersion();
        mzk_config.device_name = "opera";
        mzk_config.browser_ver = browser_ver;
    }else{
        mzk_config.browser_ver = getChromeVersion();
    }

    var Manifest = chrome.runtime.getManifest();
    mzk_config.app_ver = Manifest.version;

    check_proxy_permissions();
    get_user_token(function(){
        load_default_data();
        if(mzk_is_connect && mzk_user_info.u_type == "parent") {
            open_vpn();
        }else if(mzk_user_info.is_vip && mzk_user_info.u_type != "parent"){
            close_vpn(function(){
                must_email_login_tips();
            });
        }else if(mzk_user_token && mzk_user_info.u_type != "parent"){
            must_email_login_tips();
            user_logout();
        }
    });
});

function MZK_getJSON_DATA(API, send_data, _rcallback) {
    if (!send_data)
        send_data = {};
    send_data.appver = mzk_config.app_ver;
    send_data.device_name = mzk_config.device_name;
    send_data.token = mzk_user_token;
    send_data.curr_server_id = mzk_config.curr_server_id;
    send_data.runtime_id = chrome.runtime.id;
    send_data.lang = mzk_config.lang;
    if(mzk_user_info.is_vip) {
        var curr_api_url = mzk_config.vip_base_domain;
        var curr_backup_server_list = mzk_vip_backup_server;
    }else{
        var curr_api_url = mzk_config.base_domain;
        var curr_backup_server_list = mzk_backup_server;
    }
    var curr_retryLimit = curr_backup_server_list.length;
    $.ajax({
            url: curr_api_url + API,
            type : 'POST', 
            dataType: "json",
            data: send_data,
            timeout:6000,
            tryCount : 0,
            retryLimit : curr_retryLimit,
            success : function (data) {
                
                if(typeof data.msgtype !== "undefined" && typeof data.msgdata !== "undefined" && data.msgtype == "Encrypt"){
                    data = JSON.parse(CryptoJSAesDecrypt(data.msgdata));
                }
                if (_rcallback) {
                    _rcallback(data);
                }
            },
            error : function(xhr, textStatus, errorThrown ) {
                var err = textStatus + ", " + errorThrown;
                console.log("Err:" + err);
                    if (this.tryCount < this.retryLimit) {
                        this.url = curr_backup_server_list[this.tryCount] + API;
                        if(mzk_user_info.is_vip) mzk_config.vip_base_domain = curr_backup_server_list[this.tryCount];else mzk_config.base_domain = curr_backup_server_list[this.tryCount];
                        this.tryCount++;
                        $.ajax(this);
                        return;
                    }else{
                        if(!/getsession/igm.test(API)) {
                            var err = textStatus + ", " + errorThrown;
                            show_notifications_msg('network_error_'+Math.random(),get_lan_msg("error_network"));
                        }
                    }            
                    return;
            }
        });
}

function CryptoJSAesDecrypt(encrypted_json_string){
    var obj_json = JSON.parse(encrypted_json_string);
    var encrypted = obj_json.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(obj_json.salt);
    var iv = CryptoJS.enc.Hex.parse(obj_json.iv);   
    var key = CryptoJS.PBKDF2(mzk_user_token, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64/8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function get_user_token(_acallback) {
    chrome.storage.local.get(['mzk_token','uinfo'], function (result) {
        if (!result.mzk_token || !result.uinfo) {
            window.open(chrome.runtime.getURL("login.html?/muser/login"),"igglogin");
        } 
        if(result.mzk_token) mzk_user_token = result.mzk_token;
        if (_acallback)
            _acallback();
    });
}



function user_logout(_acallback) {
    MZK_getJSON_DATA("chromeext/muser/logout", {},
            function (data) {
                close_vpn(function () {
                    chrome.storage.local.remove(['uinfo', 'mzk_select_server_info', 'mzk_is_connect', 'mzk_connect_mode','mzk_token'], function () {
                        if (_acallback)
                            _acallback();
                            mzk_server_id = '';
                            mzk_user_token = "";
                            mzk_user_info = {};
                            Mzk_iTestSpeed.top_server = [];
                    });
                });
            }
    );
}


var calls = {};
var DEFAULT_RETRY_ATTEMPTS = 5;
chrome.webRequest.onAuthRequired.addListener(
        function (details,callbackFn) {
            var idstr = details.requestId.toString();
            if (details.isProxy === true) {
                if (!(idstr in calls)) {
                    calls[idstr] = 0;
                }
                calls[idstr] = calls[idstr] + 1;
                var retry = parseInt(localStorage["proxy_retry"]) || DEFAULT_RETRY_ATTEMPTS || 5;
                if (calls[idstr] >= retry) {
                    calls = {};
                    return({
                        cancel: true
                    });
                }
                var username = "";
                var password = "";
                if(typeof mzk_user_info.p_user !== "undefined"){
                    username = mzk_user_info.p_user;
                    password = mzk_user_info.p_pass;
                }else if(typeof mzk_select_server_info.p_user !== "undefined"){
                    username = mzk_select_server_info.p_user;
                    password = mzk_select_server_info.p_pass;
                }else{
                    db_select_server = localStorage.getItem("select_server");
                    if(db_select_server){
                        db_select_server = JSON.parse(decodeURIComponent(btoa(db_select_server)));
                        username = db_auth.p_user;
                        password = db_auth.p_pass;
                    }
                }
                if (username && password) {
                    return({
                        authCredentials: {
                            'username': username,
                            'password': password
                        }
                    });
                }
                callbackFn({
                    authCredentials: {"username": username, "password": password}
                });
            }
        },
        {urls: ["<all_urls>"]},["blocking"]
        //{urls: ["<all_urls>"]},["asyncBlocking"]
        );

function goto_vip_tips_func(details){
    var redirectUrl = chrome.extension.getURL("/helper/only_vip_site.html");
    if(details.type == "main_frame") {
        if(mzk_config.device_name == "firefox") {
            return {cancel:true};    
        } else return {redirectUrl: redirectUrl};
    }else {
        return {cancel:true};
    }
}        

function enable_vip_site_tips(){
    if(mzk_user_info.is_vip) {
        disabled_vip_site_tips();
        return;
    }
    if(typeof Mzk_iTestSpeed.ipinfo !== "undefined" && typeof Mzk_iTestSpeed.ipinfo.data !== "undefined" && typeof Mzk_iTestSpeed.ipinfo.data.country !== "undefined" && Mzk_iTestSpeed.ipinfo.data.country != "中国") {
        disabled_vip_site_tips();
        return;
    }
    if(chrome.webRequest.onBeforeRequest.hasListener(goto_vip_tips_func)) {
        return;
    }
    chrome.webRequest.onBeforeRequest.addListener(
        goto_vip_tips_func,
        {
          urls: [
              "*://*.facebook.com/*",
              "*://twitter.com/*",
              "*://drive.google.com/*",
              "*://*.youtube.com/*"
          ]
        },
        ["blocking"]
      );
 }
 
 function disabled_vip_site_tips(){
    if(chrome.webRequest.onBeforeRequest.hasListener(goto_vip_tips_func)) {
        chrome.webRequest.onBeforeRequest.removeListener(goto_vip_tips_func);
    }
 }

class Mzk_Kepplive_Service{
    static sync_current_server_info(sid){
        if(mzk_select_server_info) {
            MZK_getJSON_DATA("chromeext/v2/get_server_info", {sid:sid}, function (data) {
                if (data.result == "ok") {
                    if(typeof data.server.line_sn === "undefined"){
                        get_default_server(function(){
                            if(mzk_is_connect) open_vpn();
                        });
                    }else{
                        mzk_select_server_info = data.server;
                        chrome.storage.local.set({mzk_select_server_info: data.server}, function () {
                            mzk_server_id = data.server.line_sn;
                            mzk_select_server_info = data.server;
                            if(mzk_is_connect) open_vpn();
                        });
                    }
                } 
            });
        }
    }
    static sync_testdomain(auto_test_server){
        mzk_pac_config.testdomain = auto_test_server;
        var test_pac_domain = {};
        $.each(auto_test_server,function(i,k){
            test_pac_domain[k.testdomain] = k.server;
        });
        mzk_pac_config.test_pac_domain = test_pac_domain;
        open_vpn(function(){
            Mzk_iTestSpeed.Start();
        });
    }
}


function KeepLive_Session() {
    if(!mzk_is_connect) return;
    var ipdata = {};
    if(typeof Mzk_iTestSpeed.ipinfo !== "undefined" && typeof Mzk_iTestSpeed.ipinfo.data !== "undefined") ipdata = Mzk_iTestSpeed.ipinfo.data;
    MZK_getJSON_DATA("chromeext/v2/getsession/token/"+mzk_user_token+"?appver=" + mzk_config.app_ver, {geoip_info:ipdata}, function (data) {
        if (data.result == "ok") {
            if(data.is_user_change || data.uinfo.vip_level != mzk_user_info.vip_level) { 
                get_default_server(function(){
                    open_vpn();
                });
            }
            chrome.storage.local.set({uinfo: JSON.stringify(data.uinfo)});
            mzk_user_info = data.uinfo;

            if((mzk_select_server_info.vip_level > mzk_user_info.vip_level) || (mzk_user_info.vip_level > 1 && mzk_select_server_info.vip_level < 2)){
                get_default_server(function(){
                    open_vpn();
                });
            }

            mzk_config.vip_notice = data.notice;
            if(mzk_select_server_info && data.server_last_update !== mzk_select_server_info.last_update) {
                Mzk_Kepplive_Service.sync_current_server_info(mzk_select_server_info.line_sn);
            }

            if(data.auto_test_server.length > 2 && mzk_select_server_info.line_mode == "smart") { 
                Mzk_Kepplive_Service.sync_testdomain(data.auto_test_server);
            }

            if(typeof data.vip_tips_status !== "undefined" && data.vip_tips_status == "open") {
                enable_vip_site_tips();
            }

            if(typeof data.backup_domain_server !== "undefined") {
                chrome.storage.local.set({"backup_url_domain":data.backup_domain_server});
                mzk_backup_server = data.backup_domain_server;
            }

            if(typeof data.vip_backup_domain_server !== "undefined") {
                chrome.storage.local.set({"backup_vip_domain":data.vip_backup_domain_server});
                mzk_vip_backup_server = data.vip_backup_domain_server;
            }

            if(typeof data.proxy_namewhilelist !== "undefined") {
                chrome.storage.local.set({"proxy_permissions_namewhilelist":data.proxy_namewhilelist});
                mzk_config.proxy_permissions_namewhilelist = data.proxy_namewhilelist;
            }

            if(typeof data.vip_exp_tips !== "undefined" && data.vip_exp_tips == "open" && mzk_config.read_vip_exp_count <= 3) {
                vip_exp_tips();
                mzk_config.read_vip_exp_count++;
            }

            if(data.uinfo.u_type !== "parent"){
                must_email_login_tips();
                user_logout();
            }
        } else {
            show_notifications_msg('user_token_error',"您的用户信息有误,请您重新登录.");
            user_logout();
        }
    });
}

function get_default_server(_rcallback) {
    var ipdata = {};
    if(typeof Mzk_iTestSpeed.ipinfo !== "undefined" && typeof Mzk_iTestSpeed.ipinfo.data !== "undefined") ipdata = Mzk_iTestSpeed.ipinfo.data;
    MZK_getJSON_DATA("chromeext/v2/get_default_location", {geoip_info:ipdata}, function (data) {
        if (data.result == 'ok') {
            chrome.storage.local.set({mzk_select_server_info: data.server}, function () {
                mzk_server_id = data.server.line_sn;
                mzk_select_server_info = data.server;
                if (_rcallback) {
                    _rcallback();
                }
            });
        } else {
            console.log(data.msg);
        }
    });
}

 
function check_proxy_permissions() {
    if(mzk_config.device_name === "firefox" && typeof browser !== "undefined") {
        browser.management.getAll(function(ExtensionInfo){
            ExtensionInfo.forEach(check_clash_app);
        });
    }else{
        chrome.management.getAll(function(ExtensionInfo){
            ExtensionInfo.forEach(check_clash_app);
        });
    }
}

function check_clash_app(ExtensionInfo){
    if(ExtensionInfo.id != chrome.runtime.id && typeof ExtensionInfo.permissions !== "undefined"  && ExtensionInfo.permissions.indexOf('proxy') !== -1 && ExtensionInfo.enabled === true && ExtensionInfo.id !== chrome.runtime.id) {
        if(!mzk_config.proxy_permissions_namewhilelist.includes(ExtensionInfo.name)) chrome.management.setEnabled(ExtensionInfo.id,false);
    }
}

function check_firefox_privateBrowsingAllowed(_rcallback){
    chrome.management.get(chrome.runtime.id,function(result){
        mzk_config.is_ff_privateBrowsingAllowed = result.permissions.includes("internal:privateBrowsingAllowed");
        if (_rcallback) {
            _rcallback(data);
        }
    });
}

chrome.alarms.create("KeepLive_Session", {delayInMinutes: 60, periodInMinutes: 60});
chrome.alarms.create("KeepLive_Session_Init", {delayInMinutes: 2});


chrome.alarms.onAlarm.addListener(function (alarm) {
    switch (alarm.name) {
        case "KeepLive_Session":
        case "KeepLive_Session_Init":
            KeepLive_Session();
            if(mzk_user_info.is_vip) {
                Mzk_Kepplive_Service.sync_current_server_info(mzk_select_server_info.line_sn);
            }
            break;
        case "TestSpeed_Run":
            Mzk_iTestSpeed.Start(1);
            break;
        case "TestSpeed_ApplyVPN":
            Mzk_iTestSpeed.ApplyVPN();
            break;
        default:
    }
});


function open_vpn(_acallback) {
    applyChanges('production', function () {
        mzk_config.curr_server_id = mzk_server_id;
        mzk_is_connect = true;
        chrome.storage.local.set({mzk_is_connect: true});
        chrome.storage.local.set({mzk_server_id: mzk_server_id});
        set_badge_on();
        localStorage.setItem("select_server",btoa(encodeURIComponent(JSON.stringify(mzk_select_server_info))));
        console.log('vpn Connected');
        //enable_vip_site_tips();
        if (_acallback)
            _acallback();
    });
}

function close_vpn(_acallback) {
    applyChanges("system", function () {
        chrome.storage.local.remove("mzk_is_connect");
        mzk_is_connect = false;
        set_badge_off();
        disabled_vip_site_tips();
        if (_acallback)
            _acallback();
        console.log('vpn Disconnect');
    });
}

function onlyUniqueArray(value, index, self) { 
    return self.indexOf(value) === index;
}

function applyChanges(mode, cb) {
    switch(mzk_config.device_name) {
        case 'edge':
        case 'chrome':
            applyPacData(mode,cb);
            break;
        case 'firefox':
            var browser_proxy = new Mzk_Firefox_proxy();
            var base_domain = "";
            if(mzk_user_info.is_vip) base_domain = mzk_config.vip_base_domain;else base_domain = mzk_config.base_domain;
            var pac_url = base_domain + "chromeext/pac/show/token/"+mzk_user_token+"?sid="+mzk_select_server_info.line_sn+"&pmode="+mzk_connect_mode+"&geoip="+mzk_pac_config.geoip_switch+"&rd="+Math.random().toString();
            var config = browser_proxy.generateProxyConfig(mode , pac_url);
            var re = /HTTPS ([^;]+)/g;
            var firefox_server = mzk_select_server_info.address.split(re);
            var ff_info = firefox_server[1].split(":");
            mzk_select_server_info.ff_server = {server:ff_info[0],port:ff_info[1]};
            browser_proxy.applyChanges(config,cb);
            break;
        default:
    }
}

function applyPacData(mode,cb){
    if("production" === mode) {
        MZK_getJSON_DATA("chromeext/pac/show", {sid:mzk_select_server_info.line_sn,gpd:1,geoip:mzk_pac_config.geoip_switch,top_server:JSON.stringify(Mzk_iTestSpeed.curr_top_ranking_server)}, function (data) {
            if (data.result == 'ok') {
                var browser_proxy = new Mzk_Chrome_proxy();
                data.tpl = data.tpl.replace('__GEOIP_LIST__', mzk_pac_config.geoip_data);
                var config = browser_proxy.generateProxyConfig(mode , data.tpl);
                browser_proxy.applyChanges(config,cb);
            } 
        });
    }else{
        var browser_proxy = new Mzk_Chrome_proxy();
        var config = browser_proxy.generateProxyConfig(mode , '');
        browser_proxy.applyChanges(config,cb);
    }
}

function set_badge_on(){
    chrome.browserAction.setBadgeText({text: 'ON'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
}

function set_badge_off(){
    chrome.browserAction.setBadgeText({text: 'OFF'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#fa7d3c'});
}

/**
 * 
 * @param string msg_type_id
 * @param string msg
 */
function show_notifications_msg(msg_type_id, msg) {
    //msg_type_id += Math.floor(Math.random() * 1000) + 1;
    chrome.notifications.create(msg_type_id, {
        'type': 'basic',
        'iconUrl': 'img/128ico.png',
        'title': 'IGuGe',
        'message': msg,
        'isClickable': true,
        'priority': 2
    }, function (id) {
        console.log("Last error:", chrome.runtime.lastError);
    });
}

function vip_exp_tips(){
    if(!mzk_user_info.is_vip && mzk_user_info.u_type == "parent") {
        chrome.notifications.create("mzk_vip_is_exp", {
            'type': 'basic',
            'iconUrl': 'img/128ico.png',
            'title': 'VIP已经过期',
            'message': "您的VIP已经过期,只能免费访问谷歌系列网站哦,点此续费.",
            'isClickable': true,
            'priority': 2
        }, function (id) {
            console.log("Last error:", chrome.runtime.lastError);
        });

        chrome.notifications.onClicked.addListener(function(id) {
            chrome.notifications.clear(id);
            window.open(chrome.extension.getURL("/helper/payment.html?pid=2"),"iggpayment");
        });
    }
}

function must_email_login_tips(){
    if(mzk_user_info.u_type != "parent") {
        chrome.notifications.create("igg_mustemaillogin", {
            'type': 'basic',
            'iconUrl': 'img/128ico.png',
            'title': '请登录绑定邮箱账号',
            'message': "您的登陆信息已经丢失,点此重新登陆。",
            'isClickable': true,
            'priority': 2
        }, function (id) {
            console.log("Last error:", chrome.runtime.lastError);
        });

        chrome.notifications.onClicked.addListener(function(id) {
            chrome.notifications.clear(id);
            window.open(chrome.extension.getURL("login.html?/muser/login"),"igglogin");
        });
    }
}


function get_lan_msg(msgkey , substitutions){
    if(typeof substitutions === "undefined") substitutions = [];
    return chrome.i18n.getMessage(msgkey,substitutions);
}

class Mzk_Chrome_proxy {
    applyChanges(config, cb) {
        chrome.proxy.settings.set({
            value: config,
            scope: 'regular'
        }, cb);
    }
    
    generateProxyConfig(s_mode , pac_data) {
        switch (s_mode) {
            case 'system':
                return {mode: 'system'}
            case 'production':
                if (pac_data)
                return {
                    mode: 'pac_script',
                    pacScript: {
                        data: pac_data,
                        mandatory: true
                    }
                }
        }
        return {mode: 'system'}
    }
};

class Mzk_iTestSpeed {
    static RunTestspeed(){
        if(typeof Mzk_iTestSpeed.task_count === "undefined") Mzk_iTestSpeed.task_count = 0;
        if(Mzk_iTestSpeed.task_count > 0 || mzk_select_server_info.line_mode != "smart") return;
        Mzk_iTestSpeed.task_count = Object.keys(mzk_pac_config.test_pac_domain).length;
        if(Mzk_iTestSpeed.task_count > 2 && mzk_is_connect) {
            var mzk_ping = new Ping({favicon:"/img/128ico.png",timeout:3000});
            mzk_pac_config.auto_test_server_rank = [];
            Mzk_iTestSpeed.top_server = [];
            $.each(mzk_pac_config.testdomain,function(i,k){
                mzk_ping.ping("http://" + k.testdomain,function(err, data){
                    console.log("speed:"+data+" err:"+err);
                    if(err !== null) {
                        mzk_pac_config.auto_test_server_rank.push({server:k.server,ranking:data,result:err});
                    }else{
                        var trank = Math.round(data*k.load);
                        if(trank < 3000) {
                            mzk_pac_config.auto_test_server_rank.push({server:k.server,ranking:data,result:"ok"});
                            Mzk_iTestSpeed.top_server.push({server:k.server,ranking:trank,result:"ok"});
                        }
                    }
                    if(Mzk_iTestSpeed.task_count > 0) Mzk_iTestSpeed.task_count--;
                });
            });
        }
    }

    static Start(times){
        if(typeof mzk_select_server_info.address === "undefined" || mzk_select_server_info.line_mode != "smart" || Mzk_iTestSpeed.task_count > 0) return false;
        Mzk_iTestSpeed.curr_top_ranking_server = undefined;
        Mzk_iTestSpeed.RunTestspeed();
        if(typeof times === "undefined") {
            chrome.alarms.create("TestSpeed_Run", {delayInMinutes: 1});
            //if(typeof Mzk_iTestSpeed.ipinfo === "undefined") Mzk_iTestSpeed.GetCurrentIpinfo();
            Mzk_iTestSpeed.last_test_user_isvip  = mzk_user_info.is_vip;
        }else{
            chrome.alarms.create("TestSpeed_ApplyVPN", {delayInMinutes: 1});
        }
    }

    static ApplyVPN(){
        if(Object.keys(mzk_pac_config.auto_test_server_rank).length < 1 || Mzk_iTestSpeed.top_server.length < 2) return;
        if(typeof Mzk_iTestSpeed.last_test_user_isvip !== "undefined" && Mzk_iTestSpeed.last_test_user_isvip  != mzk_user_info.is_vip) return;
        Mzk_iTestSpeed.top_server.sort(Mzk_iTestSpeed.compare("ranking"));
        Mzk_iTestSpeed.curr_top_ranking_server = Mzk_iTestSpeed.top_server.slice(0,2);

        if(Mzk_iTestSpeed.curr_top_ranking_server[0].server == Mzk_iTestSpeed.curr_top_ranking_server[1].server) {
            Mzk_iTestSpeed.curr_top_ranking_server = undefined;
            return;
        }
        if(Object.keys(Mzk_iTestSpeed.curr_top_ranking_server).length < 2) return;
        var newserver = "HTTPS " + Mzk_iTestSpeed.curr_top_ranking_server[0].server + ";HTTPS " + Mzk_iTestSpeed.curr_top_ranking_server[1].server + ";";
        if(typeof mzk_select_server_info.address !== "undefined" && mzk_select_server_info.line_mode == "smart") {
            if(newserver == mzk_select_server_info.address) return;
            mzk_select_server_info.address = newserver;
            chrome.storage.local.set({mzk_select_server_info: mzk_select_server_info});
            if(mzk_is_connect) {
                if(mzk_config.device_name == "firefox"){
                    Mzk_iTestSpeed.SendReport(function(){
                        open_vpn();
                    });
                }else{
                    open_vpn();
                }
            }
        }
    }

    static SendReport(_rcallback){
        MZK_getJSON_DATA("chromeext/pac/report_testspeed", {ipinfo:JSON.stringify(Mzk_iTestSpeed.ipinfo),sid:mzk_select_server_info.line_sn,report:JSON.stringify(mzk_pac_config.auto_test_server_rank),top_server:JSON.stringify(Mzk_iTestSpeed.curr_top_ranking_server)}, function (data) {
            if (data.result == 'ok') {
                if (_rcallback) {
                    _rcallback();
                }
            } else {
                console.log(data.msg);
            }
        });
    }

    static GetCurrentIpinfo(){
        ;
    }

   static compare(p){ 
        return function(m,n){
            var a = m[p];
            var b = n[p];
            return a - b; 
        }
    }
};

class Mzk_Firefox_proxy {
     applyChanges(config, cb) {
         if(mzk_config.is_ff_privateBrowsingAllowed){
            chrome.proxy.settings.set({
                value: config,
                scope: 'regular'
            }, cb);
            if(browser.proxy.onRequest.hasListener(Mzk_Firefox_proxy.handleProxyRequest)){
                browser.proxy.onRequest.removeListener(Mzk_Firefox_proxy.handleProxyRequest);
            }
         }else {
            if(config.proxyType === "autoConfig") {
                browser.proxy.onRequest.addListener(Mzk_Firefox_proxy.handleProxyRequest, {urls: ["<all_urls>"]});
            }else{
                browser.proxy.onRequest.removeListener(Mzk_Firefox_proxy.handleProxyRequest);
            }   
        }
        if(cb) cb();
    }
    
     generateProxyConfig(s_mode , pac_url) {
        switch (s_mode) {
            case 'system':
                return {proxyType: 'system'}
            case 'production':
                return {
                    proxyType: 'autoConfig',
                    autoConfigUrl: pac_url
                }
        }
    }
      
    static handleProxyRequest(requestInfo) {
        var url_info = new URL(requestInfo.url);
        var api_url_info = new URL(mzk_config.base_domain);
        if(Mzk_Firefox_proxy.isPrivateIp(url_info.hostname)){
            return {type: "direct"};
        }

        return {type: "direct"};
      }

      static testDomain(target, domains, cnRootIncluded) {
            if(typeof domains === "undefined") return false;
        var idxA = target.lastIndexOf('.');
        var idxB = target.lastIndexOf('.', idxA - 1);
        var suffix = cnRootIncluded ? target.substring(idxA + 1) : '';
        if (suffix === 'cn') {
            return true;
        }
        while (true) {
            if (idxB === -1) {
                if (domains.includes(target)) {
                    return true;
                } else {
                    return false;
                }
            }
            suffix = target.substring(idxB + 1);
            if (domains.includes(suffix)) {
                return true;
            }
            idxB = target.lastIndexOf('.', idxB - 1);
        }
    }

    static isPrivateIp(ip) {
        return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
        /^f[cd][0-9a-f]{2}:/i.test(ip) ||
        /^fe80:/i.test(ip) ||
        /^::1$/.test(ip) ||
        /^::$/.test(ip);
      }
};

// soure by https://github.com/alfg/ping.js/blob/master/src/ping.js
/**
 * Creates a Ping instance.
 * @returns {Ping}
 * @constructor
 */
 var Ping = function(opt) {
    this.opt = opt || {};
    this.favicon = this.opt.favicon || "/favicon.ico";
    this.timeout = this.opt.timeout || 0;
    this.logError = this.opt.logError || false;
};

/**
 * Pings source and triggers a callback when completed.
 * @param {string} source Source of the website or server, including protocol and port.
 * @param {Function} callback Callback function to trigger when completed. Returns error and ping value.
 * @returns {Promise|undefined} A promise that both resolves and rejects to the ping value. Or undefined if the browser does not support Promise.
 */
Ping.prototype.ping = function(source, callback) {
    var promise, resolve, reject;
    if (typeof Promise !== "undefined") {
        promise = new Promise(function(_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
    }

    var self = this;
    self.wasSuccess = false;
    self.img = new Image();
    self.img.onload = onload;
    self.img.onerror = onerror;

    var timer;
    var start = new Date();

    function onload(e) {
        self.wasSuccess = true;
        pingCheck.call(self, e);
    }

    function onerror(e) {
        self.wasSuccess = false;
        pingCheck.call(self, e);
    }

    if (self.timeout) {
        timer = setTimeout(function() {
            pingCheck.call(self, undefined);
    }, self.timeout); }


    /**
     * Times ping and triggers callback.
     */
    function pingCheck() {
        if (timer) { clearTimeout(timer); }
        var pong = new Date() - start;

        if (!callback) {
            if (promise) {
                return this.wasSuccess ? resolve(pong) : reject(pong);
            } else {
                throw new Error("Promise is not supported by your browser. Use callback instead.");
            }
        } else if (typeof callback === "function") {
            // When operating in timeout mode, the timeout callback doesn't pass [event] as e.
            // Notice [this] instead of [self], since .call() was used with context
            if (!this.wasSuccess) {
                if (self.logError) { console.error("error loading resource"); }
                if (promise) { reject(pong); }
                return callback("error", pong);
            }
            if (promise) { resolve(pong); }
            return callback(null, pong);
        } else {
            throw new Error("Callback is not a function.");
        }
    }

    self.img.src = source + self.favicon + "?" + (+new Date()); // Trigger image load with cache buster
    return promise;
};

if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Ping;
    }
} else {
    window.Ping = Ping;
}