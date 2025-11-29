var levelCount;
var requesting;
var difficulties = [ "<div class='beginner'>Beginner</div>", "<div class='advanced'>Advanced</div>", "<div class='expert'>Expert</div>" ];
var host;
var selectedLevelName;
var g_downloaded;
var g_levelData;
var g_levelCard;
var g_levelCardCount;
var g_downloadsDir;
var CARD_SEPARATION = 352;
var NUM_CARD_ADD = 40;

$(document).ready( function() {
  host = typeof GetHost == 'function' ? GetHost() : "localhost";
  
  g_downloaded = jQuery.parseJSON(GetDownloaded());
  g_downloadsDir = GetDownloadsDir();
  
  $('#card_dummy').load('level_card.htm #level_card', function(responseText, textStatus, xhr) {
    getLevels();
  });
});

function setWidth() {
  var container = document.getElementById("level_card_container");
	var width = container.childNodes.length * CARD_SEPARATION + 120;
	container.setAttribute("style","width:" + width + "px;");
}

function getLevels() {
  showDialog('#loading_dialog', true);
  document.getElementById("level_filter").disabled = getOrdering() == 4;
  document.getElementById("levels_wrapper").scrollLeft = 0; 
  levelCount = 0;
  g_levelCardCount = 0;
	$('#level_card_container').empty();
  addCards();
	requestLevels();
}

function requestLevels() {
  var ordering = getOrdering();
  var filter = document.getElementById("level_filter").value;
  if (ordering == 4) { // downloaded 
		getLevelsCB(g_downloaded);
	} else {
		var url = "http://"+host+"/user_created.php?ordering=" + ordering + "&n=" + levelCount + "&callback=?";
    if (filter != null && filter.length > 0) {
      url += "&filter=" + filter;
    }
    
		$.ajax({
		  url: url,
		  dataType: 'json',
		  success: getLevelsCB,
		  error: notConnected,
		  timeout: 5000
		});
    requesting = true;
	}
}

function notConnected(event, request, settings) {
	var orderSelect = document.getElementById("order_select");
	orderSelect.selectedIndex = 4; // downloaded
	getLevelsCB(g_downloaded);
  document.getElementById("order_select").disabled = true;
  document.getElementById("level_filter").disabled = true;
  showDialog('#loading_dialog', false);
  showDialog('#error_dialog', true);
  //$('error_reason').html(settings);
  }

  
function getStar(enabled) {
  return '<img class="star" width="24px" height = "14px" src="img/star_'+ (enabled ? 'en': 'dis') +'abled.png"></img>'
}

function getLevelsCB(data) {
  showDialog('#loading_dialog', false);
  if (getOrdering() != 4) {
    g_levelData = data;
    }
  requesting = false;
  levelCount += data.length;
  
  var prop = levelCount == g_levelCardCount ? '' : 'none';
  $('#show_more').css('display',prop);

  for (var i = 0; i < data.length; i++) {
    addLevel(data[i]);
	}
  
  
  $(".report").unbind('hover');
  $(".report").hover( function() { 
    SendMessageToEngine("AudioEventStr", "PlayMenuHover");
    this.src = "img/report_hover.png";
  }, function() { 
    this.src = "img/report.png";
  });

  enableLevelHover(true);
}

function addLevel(level) {
  if (level == null)
    return;
  //alert("Name: " + level.name + ", Author: " + level.author);
  var lvlUrl = "Levels/"+level.name+"/"+level.name+".trr";
  var imgUrl = "Levels/"+level.name+"/"+level.name+"_preview.png";
  var dir = getOrdering() == 4 ? g_downloadsDir : "http://"+host+"/";
  
  if (level.popularity == "-1")
    level.popularity = "-";
  else
    level.popularity = Math.round(level.popularity);
    
  if (level.rating == "-1")
    level.rating = "-";
  else
    level.rating = Math.round(level.rating);
  
  var popStars = "";
  var ratingStars = "";
  for (var j = 1; j <= 5; j++) {
    popStars += getStar(level.popularity >= j);
    ratingStars += getStar(level.rating >= j);
  }
  
  var card = $('.level[style="opacity:0"]').first();
  card.attr('style', 'opacity:1');
  var content = $('.level_card_content[style="display:none"]').first();
  content.attr('style', 'display:visible');
  var card = content.html();
  card = card.replace(/\$name/g, level.name);
  card = card.replace('$author', level.author); 
  card = card.replace(/\$host/g, host);
  card = card.replace(/\$lvlUrl/g, lvlUrl);
  card = card.replace('$imgUrl', imgUrl);
  card = card.replace(/\$dir/g, dir);
  card = card.replace('$difficulty', difficulties[level.difficulty]);
  card = card.replace('$popularity', popStars);
  card = card.replace('$rating', ratingStars);
  card = card.replace('$description', level.description);
  card = card.replace('$dateAdded', level.dateAdded);
  content.html(card);
}

function addCards() {
  var card = $('#card_dummy').html();
  g_levelCardCount += NUM_CARD_ADD;
  for (var i = 0; i < NUM_CARD_ADD; i++)
    $('#level_card_container').append(card);
  setWidth();
}

function downloadLevel(levelName) { 
  showDialog('#loading_dialog', true);
  // find level
  var level;
  for (var i = 0; i < g_levelData.length; i++) {
    if (g_levelData[i] == null)
      continue;
    if (g_levelData[i].name == levelName) {
      level = g_levelData[i]
      break;
    }
  }
  // check for duplicate and replace
  for (var i = 0; i < g_downloaded.length; i++) {
    if (g_downloaded[i] == null)
      continue;
    if (g_downloaded[i].name == levelName) {
      g_downloaded[i] = level;
      return;
    }
  }
  // not found, add
  g_downloaded.push(g_levelData[i]);
   
  SendMessage("SaveDownloaded", JSON.stringify(g_downloaded));
}

function showComments(show, levelName) {
  showDialog("#comments_dialog_outer", show);
  if (show)
    getComments(levelName);
}

function showReport(show, levelName) {
  selectedLevelName = levelName;
  showDialog("#report_dialog", show);
  // TODO: Add level name
}

function showDialog(dialog, show) {
  var levelsWrapper = document.getElementById("levels_wrapper");
  var visibility = show ? "display:visible;" : "display:none;";
  $("#dark_overlay").attr("style", visibility);
  $(dialog).attr("style", visibility);
  enableLevelHover(!show);
  document.onmousewheel = show ? null : uclOnWheel;
  levelsWrapper.onscroll = show ? null : uclOnScroll;
}

function uclOnScroll() {
  var offset = document.getElementById("levels_wrapper").scrollLeft;
  if (offset > -1385 + levelCount * CARD_SEPARATION && !requesting && getOrdering() != 4 && levelCount < g_levelCardCount) {
      requestLevels();
  } 
}

function uclOnWheel(event){
	var levelsWrapper = document.getElementById("levels_wrapper"); 
  levelsWrapper.scrollLeft -= event.wheelDelta;
}

function getComments(levelName) {
  document.getElementById("comments_dialog_inner").innerHTML = "<h3>No Comments</h3>";
  var url = "http://"+host+"/ratings.php?name="+levelName+"&callback=?";
  jQuery.getJSON(url, getCommentsCB);  
}

function getCommentsCB(data) {
  if (data.length == 0)
    return;
  var commentFrame = document.getElementById("comments_dialog_inner");
  commentFrame.innerHTML = "";
  
  for (var i = 0; i < data.length; i++) {
    var ratingStars = "";
    for (var j = 1; j <= 5; j++) {
      ratingStars += getStar(data[i].rating >= j);
    }
    commentFrame.innerHTML += " \
    <div class='comment_wrapper'> \
      <h3>"+data[i].author+"</h3> \
      <div class='comment_rating'>Rating:"+ratingStars+"</div>  \
      <p class='comment'>"+data[i].comment+"</p>  \
    </div>";
  }
}

function enableLevelHover(enable) {
  $(".levelFrame").unbind('hover');
  if (enable) {
    $(".levelFrame").hover(function(){
       $(this).attr("style","opacity:.5;");
       SendMessageToEngine("AudioEventStr", "PlayMenuHover");
     },function(){
       $(this).attr("style","opacity:0;");
    });
  } else {
    $(".levelFrame").attr("style","opacity:0;");
  }
}

function filterLevels(event, filter) {
  if (event.keyCode == VK_ENTER)
    getLevels();
}

function getOrdering() {
  return orderSelect = document.getElementById("order_select").selectedIndex;
}

function submitReport() {
var reason = document.getElementById("report_select").selectedIndex;
var url = "http://"+host+"/report.php?name="+selectedLevelName+"&reason=" + reason;
jQuery.ajax(url);
//alert("report submitted");
showReport(false);
}

function showMore() {
  addCards();
  requestLevels();
}