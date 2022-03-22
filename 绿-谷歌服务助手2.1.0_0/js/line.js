var server_list = new Array();
function get_server_list(){
    MZK_getJSON_DATA("chromeext/v2/getserver" , {},function(data){
            if(data.result == 'ok') {
                var dis_class = "";
                $.each(data.server,function(i,k){
                    if(k.vip_level === 0) {
                        var s_str = '<li><div class="line-inform"><div class="line-inform-txt" id="'+k.line_sn+'"><h4 id="server_name_'+k.line_sn+'">'+k.name+'</h4><p>'+k.line_desc+'</p></div></div></li>';
                        $("#free_server_list_ul").append(s_str);
                        server_list[k.line_sn] = k;
                    }
                });

                $.each(data.server,function(i,k){
                    if(k.vip_level > 0) {
                        if(k.vip_level <= MZK_BGS.mzk_user_info.vip_level && MZK_BGS.mzk_user_info.is_vip) dis_class = "line-inform-txt"; else dis_class = "line-inform-txt line-inform-free";
                        var s_str = '<li><div class="line-inform"><div class="'+dis_class+'" id="'+k.line_sn+'"><h4 id="server_name_'+k.line_sn+'">'+k.name+'</h4><p>'+k.line_desc+'</p></div></div></li>';
                        $("#server_list_ul").append(s_str);
                        server_list[k.line_sn] = k;
                    }
                });
                $(".line-inform-txt").click(function(){
                        select_server(this.id);
                    });
                $(".line-inform-free").css({cursor:"not-allowed"}).unbind("click");
                $(".line-inform-free > h4").css({color:"#e5e5e5"});
            }else{
                alert("获取服务器列表失败 [" + data.msg + "]");
            }
   });
}

function select_server(sid){
    var server_info = server_list[sid];
    chrome.storage.local.set({mzk_select_server_info: server_info}, function () {
        MZK_BGS.mzk_server_id = sid;
        MZK_BGS.mzk_select_server_info = server_info;
        MZK_BGS.open_vpn(function (){
            if(server_info.line_mode == "smart"){
                MZK_BGS.KeepLive_Session();
            }
        });
        window.location.href = "main.html";
    });
}

jQuery(function () {
   check_user_login(get_server_list);
   lang_init();
});