var imgURL = chrome.extension.getURL("img/128.png");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(!request.code){
		return 
	}
	if(request.code == 1){
		showErrorMsg(request.mess)
	}
	if(request.code == 2){
		showUserMsg(request.mess)
	}
	if(request.code == 3){
		showSysMsg(request.mess)
	}
	sendResponse(request)
})

var notifyObj = null;

function showUserMsg(msg){
    notifyObj = Lobibox.notify('info', {
        title: 'Information Reply',
        img: imgURL,
        size: 'large',
        closeButton: false,
        closeOnEsc: false,
        delay: false,  
        sound: false,
        showClass: 'fadeInDown',
        hideClass: 'fadeUpDown',
        msg: msg
    });
}

function showSysMsg(msg){
    notifyObj = Lobibox.notify('info', {
        title: 'System Information',
        img: imgURL,
        size: 'large',
        closeButton: false,
        closeOnEsc: false,
        delay: false,  
        sound: false,
        showClass: 'fadeInDown',
        hideClass: 'fadeUpDown',
        msg: msg
    });
}

function showErrorMsg(msg){
    notifyObj =  Lobibox.notify('warning', {
        title: 'Warn Information',
        img: imgURL,
        size: 'large',
        closeButton: false,
        closeOnEsc: false,
        sound: false,
        showClass: 'fadeInDown',
        hideClass: 'fadeUpDown',
        msg: msg
    });
}

$(function(){
    $("#close-iframe").bind("click", function(){
        if(notifyObj != null){
            notifyObj.remove()
        }
        chrome.runtime.sendMessage({code : -99}, function(response) {
        })
    })
})