function disableBackspace(event) 
{ 
  if(event.keyCode == 8 )
    event.preventDefault(); 
} 
 
document.addEventListener("keydown", disableBackspace, false);