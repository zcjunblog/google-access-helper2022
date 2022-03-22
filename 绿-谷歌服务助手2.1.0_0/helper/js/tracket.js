function add_new_feedback(){
    var addemail = $("#email").val();
    if(!addemail) {
        $("#email").focus();
        return;
    }
    var add_contents = $("#contents").val();
    if(!add_contents || contents.length < 5) {
        alert("写点什么吧?");
        $("#contents").focus();
        return;
    }
    var proxy_app_list = JSON.stringify(other_app_list);
    var line_addess_name = MZK_BGS.mzk_select_server_info.name + "|" + MZK_BGS.mzk_select_server_info.address;
    MZK_getJSON_DATA("chromeext/index/add_feedback" , {feed_contents:add_contents,reply_email:addemail,curr_location:line_addess_name,connect_mode:MZK_BGS.mzk_connect_mode,proxy_app_list:proxy_app_list},function(data){
        if(data.result == 'ok') {
            $.confirm({
                title: '发布完成',
                content: data.msg,
                buttons: {
                    OK: function () {
                        window.close();
                    }
                }
            });
        }
});
}

function alert_msg(msg){
    $.confirm({
        title: '温馨提示',
        content: msg,
        buttons: {
            OK: function () {
            },
            cannel: {
                text: "取消",
                btnClass: 'btn-red',
                action: function(){
                    window.close();
                }
            },
        }
    });
}

function tracket_init(){
    MZK_getJSON_DATA("chromeext/index/feedback_notes" , {},function(data){
        if(data.result == 'ok') {
            $.each(data.notes, function (i, k) {
                var s_str = '<div class="alert alert-info" role="alert">'+k+'</div>';
                $("#notes").append(s_str);
            });
        }
        if(typeof data.alert_tips !== "undefined"){
            alert_msg(data.alert_tips);
        }
});
}

var other_app_list = [];
function get_otherproxylist(){
    chrome.management.getAll(function(ExtensionInfo){
        ExtensionInfo.forEach(getappdetails);
    });
}

function getappdetails(ExtensionInfo){
    if(typeof ExtensionInfo.permissions !== "undefined"  && ExtensionInfo.permissions.indexOf('proxy') !== -1 && ExtensionInfo.enabled === true && ExtensionInfo.id !== chrome.runtime.id) {
        other_app_list.push(JSON.stringify(ExtensionInfo));
    }
}


jQuery(function () {
    check_user_login(function(){
        tracket_init();
        get_otherproxylist();
    });
    $("#curr_location").val(MZK_BGS.mzk_select_server_info.name);
    $("#email").val(MZK_BGS.mzk_user_info.email);
    $("#submit_feedback").on("click",function(){
        add_new_feedback();
    });
    $("#tracket_autofix").on("click",function(){
        fix_proxy_permissions();
        MZK_BGS.KeepLive_Session();
        $.confirm({
            title: '修复完成',
            content: '自动修复完成,请尝试访问油管试试。',
            buttons: {
                OK: function () {
                },
                youtube: {
                    text: "打开油管",
                    btnClass: 'btn-red',
                    action: function(){
                        window.open("https://www.youtube.com/");
                    }
                },
            }
        });
    });
    
    if (!MZK_BGS.mzk_user_info.is_vip || MZK_BGS.mzk_user_info.vip_level < 1) {
        $("#tracket_autofix").hide();
    }
 });