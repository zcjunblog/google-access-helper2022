var view_page = "";
function page_init(){
    if(typeof chrome === "undefined" ||  typeof chrome.runtime === "undefined") {
        window.close();
        return false;
    }
    var curr_page = window.location.href.split("?",2);
    if(curr_page.length < 2) {
        window.close();
        close_windows();
        return false;
    }
    view_page = curr_page[1];
    MZK_getJSON_DATA("page" + view_page,{},function(data){
        if(typeof data.content !== "undefined"){
            $("#page_content").html(data.content);
            $("title").html(data.title);
            var pre_url = chrome.runtime.getURL("page.html?");
             $("a").each(function(){
                var _url = $(this).attr("href");
                if(/^\/client/ig.test(_url)) {
                    _url = pre_url + _url;
                    $(this).attr("href",_url);
                }
             });
            __page_init(view_page);
        }
    });
}

function __page_init(page_views){
    switch(page_views) {
        case "/client/feed":
            $(".qrcodedata").click(function(){
                show_client_address_qrcode($(this).attr("data-source"),$(this).attr("data-title"));
            });
            var sub_clipboard = new ClipboardJS('#copy_sub_address');
            sub_clipboard.on('success', function(e) {
                JqueryAlertMsg("复制成功");
                e.clearSelection();
            });
            $("#apply_open_client_button").click(function(){
                apply_client();
            });
            $("#scan_sub_address").click(function(){
                show_client_address_qrcode($(this).attr("data-scan-text"),"订阅地址");
            });
            $("#reset_sub_address").click(function(){
                reset_feed_link();
            });
            break;
        case "/client/download":
            __download_page_init();
            break;
        default:
    }
}

function __download_page_init(){
    $(function () {
        $('#myList a:last-child').tab('show')
      });
      $(".qrcodedata").click(function(){
        show_client_address_qrcode($(this).attr("data-source"),$(this).attr("data-title"));
    });
}

function reset_feed_link(){
    $.confirm({
        title: '注意!',
        content: '确定要重置订阅链接吗？,重置订阅链接后，所有客户端都需要重新添加新的订阅地址才可正常使用。',
        type: 'red',
        buttons: {
            tryAgain: {
                text: '我确认',
                btnClass: 'btn-red',
                action: function(){
                    confirm_reset_feed_link();
                }
            },
            cancel: {
                text: '算了',
                action: function(){
                    ;
                }
            },
        }
    });
}

function confirm_reset_feed_link(){
    MZK_getJSON_DATA("page/client/resetfeedlink", {}, function (data) {
        if (data.result == "ok") {
            $.confirm({
                title: '完成',
                content: data.msg,
                type: 'green',
                buttons: {
                    OK: function () {
                        location.reload();
                    }
                }
            });
        }else{
            $.confirm({
                title: 'Error!',
                content: data.msg,
                type: "red",
                buttons: {
                    OK: function () {
                        close_windows();
                    }
                }
            });
        }
    });
}

function apply_client(){
    MZK_getJSON_DATA("page/client/applyopenclient", {}, function (data) {
        if (data.result == "ok") {
            $.confirm({
                title: '账户已经成功开通',
                content: data.msg,
                type: 'green',
                buttons: {
                    OK: function () {
                        location.reload();
                    }
                }
            });
        }else{
            $.confirm({
                title: 'Error!',
                content: data.msg,
                type: "red",
                buttons: {
                    OK: function () {
                        close_windows();
                    }
                }
            });
        }
    });
}

function show_client_address_qrcode(address , title){
    $.confirm({
        title: title,
        content: '' +
        '<div class="form-group">' +
        '<textarea class="form-control"  rows="3" readonly>'+address+'</textarea>' +
        '<br>请使用相关手机客户端扫码此二维码或者手动复制上面的链接 <br>'+
        '<div style="height:256px;width:256px;" id="qrcode"></div>' +
        '</div>',
        buttons: {
            Copy: {
                text: '复制',
                btnClass: 'btn-blue',
                action: function(){
                    new ClipboardJS('.btn', {
                        text: function() {
                            return address;
                        }
                    });
                }
            },
            OK: function () {
                //close
            },
        },
        onContentReady: function () {
            setTimeout(function(){ new QRCode(document.getElementById("qrcode"), address); }, 500);
        }
    });
    
}

jQuery(function () {
    check_user_login(page_init);
    lang_init();
 });