 // via http://www.netlobo.com/url_query_string_javascript.html
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

// via http://meyerweb.com/eric/tools/dencoder/
function encode(unencoded)
{
  return encodeURIComponent(unencoded);
}

function decode(encoded)
{
  return decodeURIComponent(encoded.replace('/\+/g',  " ")).replace(/['"]/g,'');
}