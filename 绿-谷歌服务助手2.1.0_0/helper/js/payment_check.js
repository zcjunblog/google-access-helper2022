(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

// 订单信息
var last_order_info = {
    transfer_no:"",
    retry_count:0,
    last_task_id:0,
    wx_code_url:"",
    tabs_id:0
};

if(!$.getUrlParam('transfer_no')) window.close();
 else{
    last_order_info.transfer_no = $.getUrlParam('transfer_no');
 }

function get_pay_result(){
    MZK_BGS.MZK_getJSON_DATA("chromeext/payment/get_pay_status", {transfer_no:last_order_info.transfer_no}, function (data) {
        if (data.result == "ok") {
            if(data.pay_status == "paid" && typeof data.uinfo !== "undefined") { 
                chrome.storage.local.set({uinfo: JSON.stringify(data.uinfo)}, function () {});
                MZK_BGS.mzk_user_info = data.uinfo;
                MZK_BGS.KeepLive_Session();
                $.confirm({
                    title: '完成!',
                    content: '购买成功 , VIP 已到账!',
                    buttons: {
                        OK: function () {
                            close_windows();
                        }
                    }
                });
                last_order_info.retry_count = 0;
                last_order_info.transfer_no = "";
                return true;
            }else{
                setTimeout(function(){ window.location.reload(); }, 10000);
            }
        } 
    });
}

$(document).ready(function () {
    lang_init();
    get_pay_result();
 });