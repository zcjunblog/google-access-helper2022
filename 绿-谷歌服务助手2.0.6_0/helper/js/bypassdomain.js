function white_init() {
    MZK_getJSON_DATA("chromeext/pac/get_bypassdomain_list", {}, function (data) {
        if (data.result == "ok") {
            $.each(data.list, function (i, k) {
                var s_str = '<tr id="mzk_tr_' + k.id + '"><td>' + (i + 1) + '</td><td>' + k.domain + '</td><td>' + k.remarks + '</td><td><button id="' + k.id + '" domain="' + k.domain + '" class="btn button-delete btn-outline-danger">Del</button></td></tr>';
                $("#mzk_domain_tbody_list").append(s_str);
            });

            $(".button-delete").on("click",function () {
                remove_doamin(this.id, $(this).attr("domain"));
            });
        } else {
            console.log(data.msg);
        }
    });
}

function remove_doamin(id, domain) {
    MZK_getJSON_DATA("chromeext/pac/remove_white_domain", { domain_id: id, domain_type: "user_bypassdomain" }, function (data) {
        if (data.result == 'ok') {
            $("#mzk_tr_" + id).remove();
        } else {
            console.log(data.msg);
        }
    });
}

$(document).ready(function () {
    check_user_login(white_init);
    stop_loading();
    $("#add_new_domain_button").on("click",function () {
        var add_domain = $("#add_new_domain").val();
        if (!CheckIsValidDomain(add_domain)) {
            $.confirm({
                title: '域名格式错误!',
                content: '请填写正确的域名,如 www.google.com 只需要填写 google.com 即可。不需要http等其他参数. 我们目前不支持包含中文等特殊字符的域名。',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    close: function () {
                        $("#add_new_domain").focus();
                    }
                }
            });
            return false;
        }
        var add_marks = $("#add_new_remarks").val();
        if (mzk_containSpecial.test(add_marks)) {
            $.confirm({
                title: '备注格式错误!',
                content: '备注不能包含特殊字符，并且长度在20个字符以内。',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    close: function () {
                        $("#add_new_remarks").focus();
                    }
                }
            });
            return false;
        }

        MZK_getJSON_DATA("chromeext/pac/add_white_domain", { domain: add_domain, remarks: add_marks, domain_type: "user_bypassdomain" }, function (data) {
            if (data.result == "ok") {
                location.reload();
            } else {
                alert(data.msg);
            }
        });
    });
});