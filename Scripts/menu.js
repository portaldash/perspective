var VK_ESC = 27;
var VK_LEFT = 37;
var VK_UP = 38;
var VK_RIGHT = 39;
var VK_DOWN = 40;
var VK_ENTER = 13;
$(document).ready(function() {

	$("ul li").click( function () {
	  SendMessageToEngine("AudioEventStr", "PlayMenuClick");
	});
  
});
    
function gotoUrl(url) {
  SendMessage("GoToUrl", url);
}