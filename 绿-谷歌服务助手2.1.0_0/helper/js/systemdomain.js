function systemdomain_init(){
    MZK_getJSON_DATA("chromeext/pac/get_systemdomain_list",{},function(data){
        if(data.result == "ok") {
            $.each(data.list,function(i,k){
                    var s_str = '<tr id="mzk_tr_'+k.id+'"><td>'+(i+1)+'</td><td>'+k.domain+'</td></tr>';
                    $("#mzk_domain_tbody_list").append(s_str);
            });
        }else{
            console.log(data.msg);
        }
    });
}

jQuery(function () {
    check_user_login(systemdomain_init);
});