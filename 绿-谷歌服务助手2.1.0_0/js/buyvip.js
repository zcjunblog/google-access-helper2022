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
                $.each(data.product,function(i,k){
                    var s_str = '<li><div class="package-price"><h4>'+k.price+'</h4><h6>'+k.retail+'</h6></div><div class="package-inform"><div class="package-inform-txt"><h4>'+k.name+'</h4><p></p></div>';
                    s_str += '<div class="package-inform-btn"><a class="payment_link_class" id="'+k.id+'" href="#id='+k.id+'">'+MZK_BGS.get_lan_msg("buy_button")+'</a></div></div></li>';
                    $("#product_list_ul").append(s_str);
                });
                $(".payment_link_class").click(function(){
                    gotopaylink(this.id);
                });
            }else{
                alert("获取服务套餐失败 [" + data.msg + "]");
            }
   });
}

function gotopaylink(payid){
    if(MZK_BGS.mzk_user_info.u_type == "child") {
        $.confirm({
            title: "未登录",
            content: '亲，您必须先登录绑定邮箱账号才能购买VIP哦，要不然插件重新安装后，VIP信息就没有了哦。',
            type: 'red',
            buttons: {
                specialKey: {
                    text: '去登陆',
                    btnClass: 'btn-blue',
                    action: function(){
                        window.location.href = "login.html";
                    }
                },
                alphabet: {
                    text: '取消',
                    action: function(){
                        ;
                    }
                }
            }
        });
    }else{
        window.open(chrome.runtime.getURL("helper/payment.html?pid="+payid),"igugehelperpaymentpage");
    }
}

$(document).ready(function () {
   check_user_login(get_buy_product);
   lang_init();
});