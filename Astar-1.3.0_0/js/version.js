$(function(){
    
    $("#account_foot").bind("click", function(){
		chrome.tabs.create({url: "account.html"})
    })
    
    $("#Recharge_foot").bind("click", function(){
		chrome.tabs.create({url: "astar.html"})
    })
    
})