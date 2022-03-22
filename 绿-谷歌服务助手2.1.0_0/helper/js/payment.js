(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

function get_buy_product(){
    $("#mzk_user_username").html(MZK_BGS.mzk_user_info.username);
    $("#mzk_user_level_button").html(MZK_BGS.mzk_user_info.vip_level);
    if(MZK_BGS.mzk_user_info.is_vip) {
        $("#mzk_user_type").html(MZK_BGS.get_lan_msg("user_vip_title"));
        $("#mzk_vip_exp").html(MZK_BGS.mzk_user_info.vip_expired);
    }else{
        $("#mzk_user_type").html(MZK_BGS.get_lan_msg("user_member_title"));
        $("#mzk_vip_exp").html(MZK_BGS.get_lan_msg("vip_expiry_date_status"));
    }
    
   MZK_getJSON_DATA("chromeext/index/get_payment_product" , {},function(data){
            if(data.result == 'ok') {
                var last_id = 0;
                $.each(data.product,function(i,k){
                    var s_str = '<div class="form-check">';
                    s_str += '<input class="form-check-input" type="radio" name="product_id" id="product_id_'+k.id+'" value="'+k.id+'">';
                    s_str += '<label class="form-check-label" for="product_id_'+k.id+'">';
                    s_str += '  ￥'+k.price+' - '+k.name;
                    s_str += '</label>';
                    s_str += '</div>';
                    $("#product_list_ul").append(s_str);
                    last_id = k.id;
                });
                $("#product_id_"+$.getUrlParam('pid')).attr("checked",true);
                $.each(data.payment_method,function(i,k){
                    var s_str = '<div class="form-check">';
                    s_str += '<input class="form-check-input" type="radio" name="payment_method" id="payment_method_'+i+'" value="'+i+'">';
                    s_str += '<label class="form-check-label" for="payment_method_'+i+'">';
                    switch(i){
                        case "alipay":
                            s_str += k+'<i class="fab fa-alipay"></i>';
                            break;
                        case "wechat":
                            s_str += k+'<i class="fab fa-weixin"></i>';
                            break;
                        default:
                            s_str += k;
                    }
                    
                    s_str += '</label>';
                    s_str += '</div>';
                    $("#payment_list_ul").append(s_str);
                });

                $.each(data.notes, function (i, k) {
                    var s_str = '<div class="alert alert-info" role="alert">'+k+'</div>';
                    $("#notes").append(s_str);
                });

                $("#payment_method_alipay").attr("checked",true);
            }else{
                alert("获取服务套餐失败 [" + data.msg + "]");
            }
   });
}

function get_payment_html(){
    if(!$.getUrlParam('pid')) window.close();
    var product_id = $("input[name='product_id']:checked").val();
    var payment_method = $("input[name='payment_method']:checked").val();
    var c_backurl = chrome.extension.getURL("helper/order_check.html?transfer_no=");
    clearInterval(last_order_info.last_task_id);
    MZK_BGS.MZK_getJSON_DATA("chromeext/mzkpay/submit_order", {product_id:product_id,payment_method:payment_method,c_backurl:c_backurl}, function (data) {
        if(typeof data.result !== "undefined" && data.result === "error") {           
            $.confirm({
                title: '错误',
                content: '您的用户登陆信息已经丢失，请重新登陆。',
                buttons: {
                    OK: function () {
                        close_windows();
                    }
                }
            });
            return;
        }

        last_order_info.transfer_no = data.transfer_no;
        if(payment_method == "alipay") {
            if(data.alipay_type == "web"){
                $.confirm({
                    icon: 'fa fa-spinner fa-spin',
                    title: "支付中",
                    content : "请在新窗口中完成支付. 如果浏览器没有自动跳转到付款页面，<a href='"+data.alipay_url+"' target='gotoalipay'>请点此链接打开支付页面</a>",
                    type: 'blue',
                    buttons: {
                        cancel: function () {
                            clearInterval(last_order_info.last_task_id);
                        },
                        payok: {
                            text: '支付完成', 
                            action: function () {
                                if(!get_pay_result()) {
                                    window.location.href = c_backurl + last_order_info.transfer_no;
                                }
                            }
                        }
                    }
                });
                window.open(data.alipay_url,"igugehelperpay");
            }else{
                $.confirm({
                    title: '请使用 支付宝 扫码支付',
                    content: '<div style="height:256px;width:256px;" id="qrcode"></div>',
                    type: 'blue',
                    buttons: {
                        cancel: function () {
                            clearInterval(last_order_info.last_task_id);
                        },
                        ok: {
                            text: '支付完成',
                            btnClass: 'btn-blue',
                            action: function(){
                                if(!get_pay_result()) {
                                    window.location.href = c_backurl + last_order_info.transfer_no;
                                }
                            }
                        }
                    }
                });
                last_order_info.wx_code_url = data.alipay_url;
                setTimeout(function(){ new QRCode(document.getElementById("qrcode"), last_order_info.wx_code_url); }, 500);
            }
        }else{ // 微信
            $.confirm({
                title: '请使用 微信 扫码支付!',
                content: '<div style="height:256px;width:256px;" id="qrcode"></div>',
                type: 'green',
                buttons: {
                    cancel: function () {
                        clearInterval(last_order_info.last_task_id);
                    },
                    ok: {
                        text: '支付完成',
                        btnClass: 'btn-green',
                        action: function(){
                            if(!get_pay_result()) {
                                window.location.href = c_backurl + last_order_info.transfer_no;
                            }
                        }
                    }
                }
            });
            last_order_info.wx_code_url = data.wx_code_url;
            setTimeout(function(){ new QRCode(document.getElementById("qrcode"), last_order_info.wx_code_url); }, 500);
        }
        
        start_check_payment_status();
    });
}

// 订单信息
var last_order_info = {
    transfer_no:"",
    retry_count:0,
    last_task_id:0,
    wx_code_url:"",
    tabs_id:0
};

function start_check_payment_status(){
    last_order_info.retry_count = 0;
    last_order_info.last_task_id = setTimeout(function(){check_payment_status()},10000);
}

function check_payment_status(){
    last_order_info.retry_count++;
    if(!last_order_info.transfer_no || last_order_info.retry_count > 120) { // 超过30 次，取消。 
        //clearInterval(last_order_info.last_task_id);
        last_order_info.retry_count = 0;
        last_order_info.transfer_no = "";
        //MZK_BGS.show_notifications_msg('payment_'+last_order_info.transfer_no,"VIP 购买超时，自动取消。");
        return;
    }else{
        setTimeout(function(){check_payment_status()},10000);
    }

    get_pay_result();
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
                clearInterval(last_order_info.last_task_id);
                last_order_info.retry_count = 0;
                last_order_info.transfer_no = "";
                return true;
            }else{
                return false;
            }
        } 
    });
}

function re_rsync_userinfo(is_userclick = false){
    MZK_getJSON_DATA("chromeext/muser/get_user_info", {}, function (data) {
        if (data.result == "ok") {
            if(typeof data.uinfo !== "undefined" && data.uinfo.u_type === "child") {
                chrome.storage.local.set({uinfo: JSON.stringify(data.uinfo)}, function () {});
                MZK_BGS.mzk_user_info = data.uinfo;
                MZK_BGS.KeepLive_Session();
                
                $.confirm({
                    title: '错误',
                    content: '您的用户登陆信息已经丢失，请重新登陆。',
                    buttons: {
                        OK: function () {
                            close_windows();
                        }
                    }
                });
                return;
            }

            if(typeof data.uinfo !== "undefined") { 
                chrome.storage.local.set({uinfo: JSON.stringify(data.uinfo)}, function () {});
                MZK_BGS.mzk_user_info = data.uinfo;
                MZK_BGS.KeepLive_Session();
                if(is_userclick){
                $.confirm({
                    title: '完成!',
                    content: '同步用户信息完成,请查看VIP 是否到账，如果还未到账，请发工单联系客服.',
                    buttons: {
                        OK: function () {
                            close_windows();
                        }
                    }
                });
            }
            }
        }
    });
}

$(document).ready(function () {
   check_user_login(get_buy_product);
   re_rsync_userinfo(false);
   lang_init();
   $("#gotopay_button").click(function(){
        get_payment_html();
   });

   $("#re_sync_userinfo").click(function(){
       re_rsync_userinfo(true);
   });
});