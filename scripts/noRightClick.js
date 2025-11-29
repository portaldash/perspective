document.oncontextmenu=RightMouseDown;
document.onmousedown = mouseDown; 

function mouseDown(e) {
  if (e.which==3) {//righClick
  }
}

function RightMouseDown() { return false; }
