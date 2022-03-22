function accountObject(){
	this.showMessage = function(){
		let login_email = localStorage['login_email']
        $.ajax({
			url: getDomainData()+'/astarnew/NewVPN/getNoticeMessList?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: login_email
			},
			success: function(json){
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
                }
                console.info(json)
                let list = json.jsonObject.list
                if(!list || list.length == 0){
                    return 
                }

                var tr = ""
                for(let i = 0;i < list.length;i++){
                    let list_data = list[i]
                    tr += "<tr>"
                    tr += "<td>" + list_data.strMessage + "</td>"
                    tr += "<td>" + list_data.dtValidTime + "</td>"
                    tr += "</tr>"
                }
                $("#message_table").html(tr)

                $("#notice_number").html(list.length)
			},
			error: function(){
				console.info("service net exception");
			}
		})    
	},
	this.userInfo = function(){
		let login_email = localStorage['login_email']
		$("#emailAccount").html(login_email)
		$("#email").val(login_email)

		$.ajax({
            url: getDomainData()+'/astarnew/user/userInfo?' + new Date().getTime(),
            type: 'post',
            dataType: 'json',
            data: {
                strP:chrome.runtime.id, strlognid: login_email
            },
            success: function(json){
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
				var data = json.jsonObject
				if(data.nCurrValidTime == "0"){
					$("#time").val(data.nCurrValidTime + " second")
				} else {
					$("#time").val(data.nCurrValidTime)
					$("#vip_img_user").show()
				}
				$("#subEmailData").val(data.subEmailData)
				localStorage['subEmailData'] = data.subEmailData;
				localStorage['nCurrValidTime'] = data.nCurrValidTime;
            },
            error: function(){
				console.info("service net exception");
            }
        })
	}
}

var account = new accountObject();

function showMessage(mess, cnMess){
	let showMess = mess;
	let lang = window.navigator.language
	if(lang == 'zh-CN' && cnMess){
		showMess = cnMess;
	}
	$("#message_dialog_div").html(showMess)
	$("#dialog_button").hide()
	$("#myModal").modal("show")
}

function validateEmail(email){
	var reg=/^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]{1,}){0,}@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,}){1,})$/;

	if( !reg.test( email ) ) 
		return false
	else 
		return true
}

function setLanguage(){
	let lang = window.navigator.language
	let defaultLang = "en";
	if(lang == 'zh-CN'){
		defaultLang = "cn";
	} 
	$("[i18n]").i18n({
		defaultLang: defaultLang,
		filePath: "./i18n/",
		filePrefix: "i18n_",
		fileSuffix: "",
		forever: true,
		callback: function(res) {}
	});
}

function getDomainData(){
	let domainL = '.iosedge.com'
	var d = new Date();
	var time = 'w' + (d.getMonth()+1) + '' + d.getDate() + '' + d.getHours() + 's'
	domainL = time + domainL 
	if(localStorage['ddomain'] && localStorage['ddomain'] != ''){
		domainL = localStorage['ddomain']
	}
	return 'https://' + domainL
}

$(function(){
	setLanguage();

    let login_status= localStorage['login_status']
    if(!login_status || login_status == '0'){
        showMessage("Please log in again", "请先登陆")
        return 
	}
	
	// account info
	account.userInfo()
	// message
    account.showMessage()

    $("#RechargeSubmit").bind("click", function(){
		chrome.tabs.create({url: "astar.html"})
    })
    
    $("#recharge-href").bind("click", function(){
		chrome.tabs.create({url: "astar.html"})
    })
    
    $("#Recharge_foot").bind("click", function(){
		chrome.tabs.create({url: "astar.html"})
    })
    
    $("#account-href").bind("click", function(){
        $("[name='tab_href']").removeClass("kt-widget__item--active")
        $("[name='message_div']").hide()
        $("#account-href").addClass("kt-widget__item--active")
        $("#accountInfo").show()
    })

    $("#password-href").bind("click", function(){
        $("#change-password-old").val("")
        $("#change-password").val("")
        $("#change-password-confirmation").val("")

        $("[name='tab_href']").removeClass("kt-widget__item--active")
        $("[name='message_div']").hide()
        $("#password-href").addClass("kt-widget__item--active")
        $("#changePasswordDiv").show()
    })

    $("#rechargeRecord-href").bind("click", function(){
        $("[name='tab_href']").removeClass("kt-widget__item--active")
        $("[name='message_div']").hide()
        $("#rechargeRecord-href").addClass("kt-widget__item--active")
        $("#rechargeRecordDiv").show()

        var email = localStorage['login_email']
		$.ajax({
			url: getDomainData()+'/astarnew/user/rechargeRecord?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: email
			},
			success: function(json){
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
                }
                let list = json.jsonObject.list
                if(!list || list.length == 0){
                    return 
                }

                var tr = ""
                for(let i = 0;i < list.length;i++){
                    let list_data = list[i]
                    tr += "<tr>"
                    tr += "<td>" + list_data.strsn + "</td>"
					tr += "<td>$" + list_data.lamount + "</td>"
					
					if(list_data.nstate === 10){
						tr += "<td>pendding</td>"
					} else if(list_data.nstate === 20){
						tr += "<td>success</td>"
					} else if(list_data.nstate === 30){
						tr += "<td>fail</td>"
					} else {
						tr += "<td>unknown</td>"
					}

                    tr += "<td>" + list_data.dtcreatetime + "</td>"
                    tr += "</tr>"
                }
                $("#record_table").html(tr)
			},
			error: function(){
				console.info("service net exception");
			}
		})    

    })


    $("#messageNotification-href").bind("click", function(){
        $("[name='tab_href']").removeClass("kt-widget__item--active")
        $("[name='message_div']").hide()
        $("#messageNotification-href").addClass("kt-widget__item--active")
        $("#messageNotificationDiv").show()
    })

    $("#informationFeedback-href").bind("click", function(){
        $("#informationFeedbackData").val("")
        $("[name='tab_href']").removeClass("kt-widget__item--active")
        $("[name='message_div']").hide()
        $("#informationFeedback-href").addClass("kt-widget__item--active")
        $("#informationFeedbackDiv").show()
    })

	$("#SubscribeEmail-href").bind("click", function(){
		if(localStorage['subEmailData'] && localStorage['subEmailData'] != ''){
			$("#subEmailData").val(localStorage['subEmailData'])
		} else {
			$("#subEmailData").val("")
		}

        $("[name='tab_href']").removeClass("kt-widget__item--active")
        $("[name='message_div']").hide()
        $("#SubscribeEmail-href").addClass("kt-widget__item--active")
        $("#subEmailDiv").show()
    })
    
    $("#changePasswordSubmit").bind("click", function(){
		$("#load_div").show()
		var oldPassword = $("#change-password-old").val()
		var newPassword = $("#change-password").val()
		var newPasswordConfirmation = $("#change-password-confirmation").val()
		if(oldPassword == ''){
			$("#load_div").hide()
			showMessage('old password must exist', "旧密码不能为空")
			return ;
		}
		if(newPassword == ''){
			$("#load_div").hide()
			showMessage('new password must exist', "新密码不能为空")
			return ;
		}
		if(newPassword != newPasswordConfirmation){
			$("#load_div").hide()
			showMessage('new password confirmation is error', "新密码二次确认不一致")
			return ;
		}
		var email = localStorage['login_email']
		$.ajax({
			url: getDomainData()+'/astarnew/user/changePassword?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: email, oldPassword: oldPassword, newPassword: newPassword
			},
			success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
                showMessage("change password is success!", "密码修改成功")
                
                $("#password-href").removeClass("kt-widget__item--active")
                $("#changePasswordDiv").hide()
                $("#account-href").addClass("kt-widget__item--active")
                $("#accountInfo").show()
			},
			error: function(){
				$("#load_div").hide()
				// console.info("service net exception");
			}
		})
    })
    
    $("#informationFeedbackSubmit").bind("click", function(){
		$("#load_div").show()
		var informationFeedbackData = $("#informationFeedbackData").val()
		if(informationFeedbackData == ''){
			$("#load_div").hide()
			showMessage('Feedback Data must exist', "反馈信息不能为空")
			return ;
		}
		
		var time = new Date()
		var temp_time = time.getTime()
		var feedback_time = localStorage['feedback_time']
		if(feedback_time && temp_time < Number.parseInt(feedback_time)){
			$("#load_div").hide()
			showMessage('Send frequently, please try again later', "频繁发送，请稍后再试")
			return ;
		}


		var email = localStorage['login_email']
		$.ajax({
			url: getDomainData()+'/astarnew/user/informationFeedback?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: email, message: informationFeedbackData
			},
			success: function(json){
				$("#load_div").hide()
				localStorage['feedback_time'] = temp_time + 600 * 1000
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
                showMessage("submit is success!", "提交成功")
                
                $("#informationFeedback-href").removeClass("kt-widget__item--active")
                $("#informationFeedbackDiv").hide()
                $("#account-href").addClass("kt-widget__item--active")
                $("#accountInfo").show()
			},
			error: function(){
				$("#load_div").hide()
				console.info("service net exception");
			}
		})
    })

	$("#subEmailSubmit").bind("click", function(){
		$("#load_div").show()
		var subEmailData = $("#subEmailData").val()
		if(subEmailData == ''){
			$("#load_div").hide()
			showMessage('Email must exist', "邮箱不能为空")
			return ;
		}

		if(localStorage['subEmailData'] && localStorage['subEmailData'] == subEmailData){
			$("#load_div").hide()
			showMessage('The email has been bound', "邮箱已绑定")
			return ;
		}

		if(!validateEmail(subEmailData)){
			$("#load_div").hide()
			showMessage("Email format error!", "邮箱格式错误")
			return ;
		}

		var email = localStorage['login_email']
		$.ajax({
			url: getDomainData()+'/astarnew/user/setSubEmail?' + new Date().getTime(),
			type: 'post',
			dataType: 'json',
			data: {
				strP:chrome.runtime.id, strlognid: email, subEmail: subEmailData
			},
			success: function(json){
				$("#load_div").hide()
				if(json.nCode != 0){
					showMessage(json.strText)
					return ;
				}
                showMessage("Bind successfully!", "绑定成功")
				localStorage['subEmailData'] = subEmailData
			},
			error: function(){
				$("#load_div").hide()
				// console.info("service net exception");
			}
		})
    })

})