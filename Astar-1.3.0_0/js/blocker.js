function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return decodeURI(r[2]);
    return null;
}

function setLanguage(){
	let lang = window.navigator.language
	let defaultLang = "en";
	if(lang == 'zh-CN'){
		defaultLang = "cn";
	} 
	$("[i18n]").i18n({
		defaultLang: defaultLang,
		filePath: "/i18n/",
		filePrefix: "i18n_",
		fileSuffix: "",
		forever: true,
		callback: function(res) {}
	});
}

$(function(){
    setLanguage();

    let url = GetQueryString("url");
    $("#source_url").html(unescape(url));
})