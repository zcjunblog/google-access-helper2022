var mzk_base_domain = '';
function get_base_api(){
    if(!mzk_base_domain) {
        mzk_base_domain = localStorage.getItem("mzk_base_domain");
    }
    return mzk_base_domain;
}
var MZK_BGS = chrome.extension.getBackgroundPage();


document.oncontextmenu = document.body.oncontextmenu = function() {return false;}

function start_loading(){
    $.LoadingOverlay("show");
}

function stop_loading(){
    $.LoadingOverlay("hide");
}

function register_token(_acallback) {
    chrome.runtime.sendMessage({cmd:"register_token"}, function(response) {
           if(response.result == "ok") if(_acallback) _acallback();
    });
}

$("#mzk_back").on("click",function () {
    window.location.href = "main.html";
});


function check_user_login(will_login) {
    if(typeof chrome === "undefined" || typeof chrome.runtime === "undefined" || typeof chrome.runtime.id === "undefined") {
        window.close();
        return false;
    }
    if (!MZK_BGS.mzk_user_info || !MZK_BGS.mzk_user_token) {
        window.location.href = "welcome.html";
        return;
    } else {
        mzk_user_info = MZK_BGS.mzk_user_info;
        mzk_user_token = MZK_BGS.mzk_user_token;
        if (!MZK_BGS.mzk_user_info.vip_expired)
            MZK_BGS.mzk_user_info.vip_expired = MZK_BGS.get_lan_msg("vip_expiry_date_status");
        if (will_login)
            will_login();
    }
}


function MZK_getJSON_DATA(API , send_data , _rcallback){
    start_loading();
    MZK_BGS.MZK_getJSON_DATA(API , send_data,function(data){
        if(_rcallback) _rcallback(data);
        stop_loading();
    });
}

function add_new_whitedomain(newdomain ,add_remarks, __rcallback){
    MZK_getJSON_DATA("chromeext/pac/add_white_domain",{domain:newdomain,remarks:add_remarks},function(data){
           if(data.result == "ok") {
               var index = MZK_BGS.mzk_pac_config.user_custom_proxydomain.data.indexOf(newdomain);
               if(index === -1) {
                   var custom_data = MZK_BGS.mzk_pac_config.user_custom_proxydomain.data;
                   custom_data.push(newdomain);
                   MZK_BGS.mzk_pac_config.user_custom_proxydomain.data = custom_data;
               }
               if(MZK_BGS.mzk_is_connect) {
                   MZK_BGS.close_vpn(function(){
                       MZK_BGS.open_vpn();
                   });
               }
               if(__rcallback) {
                    __rcallback(data);
                }
           }
       });
}

function lang_init(){
    $("[class^='lang_']").each(function(i) {
        var lang_index = $(this).attr("class").toString();
        lang_index = lang_index.split(" ",1)[0].replace(/^lang_/,"");
        $(this).html(MZK_BGS.get_lan_msg(lang_index));
    });
}

if(("#mzk_about_us").length > 0) {
    lang_init();
    $("#mzk_server_police").on("click",function(){
        window.open("https://iguge.xyz/helper/?page_id=210","igugehelper");
    });
    
    $("#mzk_privacy_police").on("click",function(){
        window.open("https://iguge.xyz/helper/?page_id=215","igugehelper");
    });
}

function only_vip_tips(){
    $.confirm({
        title: MZK_BGS.get_lan_msg("error_code"),
        content: MZK_BGS.get_lan_msg("only_vip_tips"),
        type: 'red',
        typeAnimated: true,
        buttons: {
            ok: {
                text: MZK_BGS.get_lan_msg("to_buy_vip"),
                btnClass: 'btn-red',
                action: function(){
                    window.location.href = "buyvip.html";
                }
            },
            close: function () {
            }
        }
    });
}

var mzk_containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);

function CheckIsValidDomain(domain) { 
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
    return domain.match(re);
} 

function close_windows(){
    chrome.tabs.getCurrent(function(tab){
        chrome.tabs.remove(tab.id);
    });
}

function JqueryAlertMsg(msg) {
    $.confirm({
        title: 'Success',
        content: msg,
        type: 'green',
        buttons: {
            OK: function () {
                ;
            }
        }
    });
}

function fix_proxy_permissions(){
    chrome.management.getAll(function(ExtensionInfo){
        ExtensionInfo.forEach(disable_clash_app);
    });
}

function disable_clash_app(ExtensionInfo){
    if(typeof ExtensionInfo.permissions !== "undefined"  && ExtensionInfo.permissions.indexOf('proxy') !== -1 && ExtensionInfo.enabled === true && ExtensionInfo.id !== chrome.runtime.id) {
        chrome.management.setEnabled(ExtensionInfo.id,false);
    }else if(ExtensionInfo.name == "Tampermonkey"){
        chrome.management.setEnabled(ExtensionInfo.id,false);
    }
}