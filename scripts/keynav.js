var VK_UP = 38;
var VK_DOWN = 40;
var VK_W = 87;
var VK_S = 83;
var VK_ENTER = 13;
var VK_A = 65;
var VK_D = 68;

$(document).ready( function() {
    $('li').mousemove(function() {
      if($(this).hasClass('withfocus'))
        return;
      $('li.withfocus').addClass('withoutfocus');
      $('li.withfocus').removeClass('withfocus');
      $(this).addClass('withfocus');
      $(this).removeClass('withoutfocus');
      SendMessageToEngine("AudioEventStr", "PlayMenuHover");
    });
  }
);

// binding behavior for moving using arrow keys.
$(document).keydown(function(e) {

  if(e.keyCode == VK_UP || e.keyCode == VK_W) {
    var prev=$('li.withfocus').prev();

    if(prev.length > 0) {
      if (!prev.is(':visible'))
        prev=prev.prev();
      $('li.withfocus').addClass('withoutfocus');
      $('li.withfocus').removeClass('withfocus');
      SendMessageToEngine("AudioEventStr", "PlayMenuHover");
      prev.addClass('withfocus');
      prev.removeClass('withoutfocus');

    }
  }
  if(e.keyCode == VK_DOWN || e.keyCode == VK_S) {
    var next=$('li.withfocus').next();
    if(next.length > 0) {
      if (!next.is(':visible'))
        next=next.next();
      $('li.withfocus').addClass('withoutfocus');
      $('li.withfocus').removeClass('withfocus');
      SendMessageToEngine("AudioEventStr", "PlayMenuHover");
      next.addClass('withfocus');
      next.removeClass('withoutfocus');
    }
  }
  if(e.keyCode == VK_ENTER)
  {
    $('li.withfocus').click();
  }
}); // keydown.