function send_auth_code(uemail , _acallback){
    if(check_parent_user_islogin()) return;
    var curr_sec = new Date().getTime()/1000;
    if(typeof MZK_BGS.mzk_user_info.last_send_email !== "undefined" && MZK_BGS.mzk_user_info.last_send_email == uemail && (curr_sec - MZK_BGS.mzk_user_info.last_sendmail_time) < 120) {
        $.confirm({
            title: "没有收到验证码？",
            content: "请先检查垃圾箱! 垃圾箱也没有的话， 请再次确认邮件账号填写是否正确哦。",
            type:"orange",
            buttons: {
                OK: function () {
                    $("#login_mail_username").focus();
                }
            }
        }); 
        return;
    }
    var postData = GetFormBbject();
    MZK_getJSON_DATA("chromeext/email/sendcode_v2",postData,
        function( data ) {
            if(typeof data.result !== "undefined" && data.result != 'ok' && typeof data.msg !== "undefined") {
                $.confirm({
                    title: "Error",
                    content: data.msg,
                    type:"red",
                    buttons: {
                        OK: function () {
                            ;
                        }
                    }
                }); 
            }else{
                if(typeof data.reg_status !== "undefined" && data.reg_status != "open" && !MZK_BGS.mzk_user_info.is_vip) {
                    close_register_note(data.close_msg);
                    return;
                }
                
                $("#get_email_code").text(MZK_BGS.get_lan_msg("email_auth_send_ok")).prop('disabled', true);
                $.confirm({
                    title: MZK_BGS.get_lan_msg("success_title"),
                    type: "green",
                    content: MZK_BGS.get_lan_msg("email_auth_send_ok_tips"),
                    buttons: {
                        OK: function () {
                            $("#login_authcode").focus();
                            localStorage.setItem("last_email_username",$("#login_mail_username").val());
                            localStorage.setItem("last_email_domain",$("#login_mail_ext").val());
                        }
                    }
                });
                chrome.browserAction.setPopup({popup:"login.html"});
                MZK_BGS.mzk_user_info.last_sendmail_time = new Date().getTime()/1000;
                MZK_BGS.mzk_user_info.last_send_email = uemail;
            }
            if(_acallback) _acallback();
        }
    );
}


function GetFormBbject(){
    var paramObj = {};
    $.each($('#iggloginform').serializeArray(), function(_, kv) {
        paramObj[kv.name] = kv.value;
    });
    return paramObj;
}


function login_page_init(){
    if(check_parent_user_islogin()) return;
    $("#login_mail_username").on('paste', function(e){return false;});
   $("#get_email_code").on("click",function (){
        var email_username = $("#login_mail_username").val();
        if(!email_username || !/^[a-z0-9\._-]{2,36}$/igm.test(email_username)) {
            $.confirm({
                title: "Error",
                type: "red",
                content: MZK_BGS.get_lan_msg("email_username_error"),
                buttons: {
                    OK: function () {
                        $("#login_mail_username").focus();
                    }
                }
            }); 
            return;
        }
        var email_domain_ext = $("#login_mail_ext").val();
        if(email_domain_ext === "@gmail.com") {
            email_username = email_username.replace(".","");
            $("#login_mail_username").val(email_username);
        }
        var email_address = email_username.toLowerCase() + email_domain_ext;

        if(/^([0-9]+)$/ig.test(email_username) && email_domain_ext === "@gmail.com" && isExistOption("login_mail_ext","@qq.com")){
            $.confirm({
                title: "注意",
                content: "亲，您输入的是纯数字账号,但选择的邮箱后缀是Gmail。请注意这是您的Gmail邮箱而不是QQ.com邮箱吗？",
                buttons: {
                    OK: {
                        text : "是Gmail",
                        action: function () {
                            continue_send_code(email_address);
                        },
                    },
                    NO : {
                        text : "是QQ.com",
                        action: function () {
                            $("#login_mail_ext").val("@qq.com");
                            $("#login_mail_username").focus();
                        },
                    },
                    OTHER : {
                        text : "都不是",
                        action: function () {
                            $("#login_mail_username").focus();
                        },
                    },
                }
            }); 
            return;
        }
        continue_send_code(email_address);
    });

    function continue_send_code(email_address){
        $("#login_authcode").val('');
        send_auth_code(email_address , function(){});
    }

    function isExistOption(id,value) {  
        var isExist = false;  
        var count = $('#'+id).find('option').length;  
    
          for(var i=0;i<count;i++)     
          {     
             if($('#'+id).get(0).options[i].value == value)     
                 {     
                       isExist = true;     
                            break;     
                      }     
            }     
            return isExist;  
    }
    
    $("#submit_login").on("click",function(){
        if(check_parent_user_islogin()) return;
        var email_username = $("#login_mail_username").val();
        if(!email_username || !/^[a-z0-9\._-]{2,36}$/igm.test(email_username)) {
            $.confirm({
                title: "Error",
                content: MZK_BGS.get_lan_msg("email_username_error"),
                buttons: {
                    OK: function () {
                        $("#login_mail_username").focus();
                    }
                }
            }); 
            return;
        }
        var email_domain_ext = $("#login_mail_ext").val();
        if(email_domain_ext === "@gmail.com") {
            email_username = email_username.replace(".","");
        }
        var email_address = email_username.toLowerCase() + email_domain_ext;
        
        var auth_code = $("#login_authcode").val();
        if(!auth_code) {
            $("#login_authcode").focus();
            return;
        }
        var postData = GetFormBbject();
        /***
         * 注册写完，开始 处理用户退出逻辑
         * 还需要处理， 如果用户token 失效，则自动删除所有本地信息 让用户重新注册。
         * 待续
         */
        MZK_getJSON_DATA("chromeext/v2/email_login" , postData,function(data){
            if(data.result == 'ok') {
                MZK_BGS.mzk_user_info = data.uinfo;
                MZK_BGS.mzk_user_token = data.token;
                chrome.storage.local.set({mzk_token: data.token ,uinfo: JSON.stringify(data.uinfo)}, function () {
                    localStorage.setItem("last_email_username",email_username);
                    localStorage.setItem("last_email_domain",$("#login_mail_ext").val());
                    MZK_BGS.mzk_select_server_info = false;
                    MZK_BGS.mzk_is_connect = false;
                    chrome.browserAction.setPopup({popup:"main.html"});
                    MZK_BGS.mzk_user_info.last_sendmail_time =undefined;
                    MZK_BGS.mzk_user_info.last_send_email = undefined;
                    MZK_BGS.check_proxy_permissions();
                    MZK_BGS.get_default_server(function () {
                        MZK_BGS.open_vpn();
                        if (MZK_BGS.mzk_user_info.is_vip) {
                            MZK_BGS.KeepLive_Session();
                        }
                    });
                    $.confirm({
                        title: MZK_BGS.get_lan_msg("success_title"),
                        type: "green",
                        content: "登录成功.",
                        buttons: {
                            OK: function () {
                                window.close();
                                close_windows();
                            }
                        }
                    });
                });
            }else{
                $.confirm({
                    title: "Error",
                    content: data.msg,
                    type:"red",
                    buttons: {
                        OK: function () {
                            ;
                        }
                    }
                }); 
            }
        });
    });
}

function  check_parent_user_islogin(){
    if(MZK_BGS.mzk_user_token && typeof MZK_BGS.mzk_user_info.u_type !== "undefined" && "parent" === MZK_BGS.mzk_user_info.u_type) {
        $.confirm({
            title: MZK_BGS.get_lan_msg("success_title"),
            type: "green",
            content: "亲，你已经登录过了.",
            buttons: {
                OK: function () {
                    window.close();
                    close_windows();
                }
            }
        });
        return true;
    }else {
        return false;
    }
}

jQuery(function () {
    lang_init();
    page_init({"iggaction":"login"});
    view_page_init_func = login_page_init;
});