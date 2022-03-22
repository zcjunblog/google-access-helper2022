if (document && document.location && document.location.pathname) {
    var iframe = null;

    var iframeStyle = {
        overflow : 'hidden',
        position : 'fixed',
        height : '155px',
        width : '400px',
        bottom : '20px',
        right : '20px',
        background : 'none',
        border : 'none',
        zIndex : '2147483646',
        visibility: 'hidden',
        '-webkit-user-select' : 'none'
    };
    iframe = document.createElement('iframe');
    iframe.src = chrome.extension.getURL("widget.html") ;
    for ( var k in iframeStyle) {
        var v = iframeStyle[k];
        iframe.style[k] = v;
    }
    document.body.appendChild(iframe);

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if(!request.code){
            return 
        }
        if(iframe){
            if(request.code == -99){
                iframe.style.visibility = 'hidden'
            } else {
                iframe.style.visibility = 'visible'
            }
        } else{
            iframe = document.createElement('iframe');
            iframe.src = chrome.extension.getURL("widget.html") ;
            for ( var k in iframeStyle) {
                var v = iframeStyle[k];
                iframe.style[k] = v;
            }
            document.body.appendChild(iframe);
        }
    })
}