$(document).ready(function () {

  $("#check").prop('checked', localStorage.check === "true")

  $('body').on('click', 'a', function () {
    chrome.tabs.create({ url: $(this).attr('href') });
    return false;
  });

  $("#check").click(function () {
    chrome.runtime.sendMessage($("#check").prop('checked'), function (response) {
      
    });
  });

});

