var view_page = "";
var view_page_init_func = function(){};
function page_init(init_args){
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
    if(!init_args) init_args = {};
    MZK_getJSON_DATA("page" + view_page,init_args,function(data){
        console.log("get page:" + view_page);
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
             view_page_init_func();
        }
    });
}