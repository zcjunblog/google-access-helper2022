//localStorage string
if (localStorage.check === undefined) {
    localStorage.check = "true"
}
//disable
if (localStorage.check==="true") {
    chrome.management.getAll(function (extensionInfos) {
        let ourExt = chrome.app.getDetails();
        for (let key in extensionInfos) {
            let ext = extensionInfos[key];
            if (ext.enabled == true && ext.permissions.indexOf("proxy") != -1 && ext.name != ourExt.name) {
                chrome.management.setEnabled(ext.id, false, function () {
                });
            }
        }
    })
}
//default
if (localStorage.check ==="true") {
    setTimeout(function () {
        setProxy(true);
    }, 4000)
}
function setProxy(b) {
    if (b) {
        chrome.proxy.settings.set(
            { value: data_config, scope: 'regular' },
            function () { });
    } else {
        chrome.proxy.settings.set(
            { value: sys_config, scope: 'regular' },
            function () { });
    }
}
//checkbox
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message,typeof message)
    localStorage.check = String(message);
    sendResponse('recieved');
    setProxy(message);
});

//sys_config
sys_config = { mode: "system" }
//data_Config
data_config = {
    mode: "pac_script",
    pacScript: {
        data:'function FindProxyForURL(url, host) {\n'+
        '    let domains = {\n'+
        '        "google.com": 1,\n'+
        '        "google.hk": 1,\n'+
        '        "google.co.kr": 1,\n'+
        '        "google.jp": 1,\n'+
        '        "google.com.hk": 1,\n'+
        '        "google.com.sg": 1,\n'+
        '        "google.co.jp": 1,\n'+
        '        "gmail.com": 1,\n'+
        '        "gstatic.com": 1,\n'+
        '        "googleusercontent.com": 1,\n'+
        '        "youtu.be": 1,\n'+
        '        "youtube.com": 1,\n'+
        '        "ytimg.com": 1,\n'+
        '        "googlevideo.com": 1,\n'+
        '        "ggpht.com": 1,\n'+
        '        "youtube-nocookie.com": 1,\n'+
        '        "googleadservices.com": 1,\n'+
        '        "googleapis.com": 1,\n'+
        '        "googleartproject.com": 1,\n'+
        '        "googleblog.com": 1,\n'+
        '        "googlebot.com": 1,\n'+
        '        "googlechinawebmaster.com": 1,\n'+
        '        "googlecode.com": 1,\n'+
        '        "googlecommerce.com": 1,\n'+
        '        "googledomains.com": 1,\n'+
        '        "googlearth.com": 1,\n'+
        '        "googleearth.com": 1,\n'+
        '        "googledrive.com": 1,\n'+
        '        "googlegroups.com": 1,\n'+
        '        "googlehosted.com": 1,\n'+
        '        "googleideas.com": 1,\n'+
        '        "googleinsidesearch.com": 1,\n'+
        '        "googlelabs.com": 1,\n'+
        '        "googlemail.com": 1,\n'+
        '        "googlemashups.com": 1,\n'+
        '        "googlepagecreator.com": 1,\n'+
        '        "googlescholar.com": 1,\n'+
        '        "googlesource.com": 1,\n'+
        '        "googlesyndication.com": 1,\n'+
        '        "googleweblight.com": 1,\n'+
        '        "googlezip.net": 1,\n'+
        '        "gvt0.com": 1,\n'+
        '        "gvt1.com": 1,\n'+
        '        "gvt2.com": 1,\n'+
        '        "gvt3.com": 1,\n'+
        '        "youtubeeducation.com": 1,\n'+
        '        "youtubegaming.com": 1,\n'+
        '        "yt.be": 1,\n'+
        '        "zynamics.com": 1,\n'+
        '        "android.com": 1,\n'+
        '        "twimg.com": 1,\n'+
        '        "twitter.com": 1,\n'+
        '        "fbcdn.net": 1,\n'+
        '        "facebook.com": 1,\n'+
        '        "facebook.net": 1,\n'+
        '        "wikimedia.org": 1,\n'+
        '        "pinterest.com": 1,\n'+
        '        "accountkit.com": 1,\n'+
        '        "pinimg.com": 1,\n'+
        '        "wikipedia.org": 1,\n'+
        '        "ipip.net": 1,\n'+
        '        "golang.org": 1,\n'+
        '        "freenet.pro": 1,\n'+
        '        "appspot.com": 1,\n'+
        '        "chromium.org": 1,\n'+
        '        "google-analytics.com": 1,\n'+
        '        "doubleclick.net": 1,\n'+
        '        "googletagmanager.com": 1,\n'+
        '        "t.co": 1,\n'+
        '        "goo.gl": 1,\n'+
        '        "you.tb": 1,\n'+
        '        "telegram.me": 1,\n'+
        '        "t.me": 1,\n'+
        '        "telegram.org": 1,\n'+
        '        "blogspot.com": 1,\n'+
        '        "blogger.com": 1,\n'+
        '        "chrome.com": 1\n'+
        '    };\n'+
        '    let p = {\n'+
        '        ini: "HTTPS kuomu.xyz:443;",\n'+
        '    }\n'+
        '    let direct = "DIRECT;";\n'+
        '    let hasOwnProperty = Object.hasOwnProperty;\n'+
        '    let suffix;\n'+
        '    let pos = host.lastIndexOf(".");\n'+
        '    if (url.substring(0, 6) !== "https:") {\n'+
        '        return direct\n'+
        '    }\n'+
        '    while (1) {\n'+
        '        suffix = host.substring(pos + 1);\n'+
        '        if (hasOwnProperty.call(domains, suffix)) {\n'+
        '            return p.ini\n'+
        '        }\n'+
        '        if (pos <= 0) {\n'+
        '            break;\n'+
        '        }\n'+
        '        pos = host.lastIndexOf(".", pos - 1);\n'+
        '    }\n'+
        '    return direct;\n'+
        '}'
        
    }
}



