// reference

function startup() {
  
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("pointerdown", handleStart, false);
  el.addEventListener("pointerup", handleEnd, false);
  el.addEventListener("pointercancel", handleCancel, false);
  el.addEventListener("pointermove", handleMove, false);
 
  var card_b = document.getElementsByTagName("canvas")[2];
  card_b.addEventListener("pointerdown", handleStart, false);
  card_b.addEventListener("pointerup", handleEnd, false);
  card_b.addEventListener("pointercancel", handleCancel, false);
  card_b.addEventListener("pointermove", handleMove, false); 
  
  
  log("initialized.");
} 

var ongoingTouches = new Array();

function handleStart(evt) {
    
  log("pointerdown.");
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
        
  log("pointerdown: id = " + evt.pointerId);
  ongoingTouches.push(copyTouch(evt));
  var color = colorForTouch(evt);
  ctx.beginPath();
  // ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
  // ctx.arc(evt.clientX, evt.clientY, 4, 0, 2 * Math.PI, false);  // a circle at the start
  ctx.fillStyle = color;
  ctx.fill();
}

function handleMove(evt) {
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var color = colorForTouch(evt);
  var idx = ongoingTouchIndexById(evt.pointerId);

  log("continuing touch: idx =  " + idx);
  if (idx >= 0) {
    ctx.beginPath();
    log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
    ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
    log("ctx.lineTo(" + evt.clientX + ", " + evt.clientY + ");");
    ctx.lineTo(evt.clientX, evt.clientY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.stroke();

    ongoingTouches.splice(idx, 1, copyTouch(evt));  // swap in the new touch record
    log(".");
  } else {
    log("can't figure out which touch to continue: idx = " + idx);
  }
}

function handleEnd(evt) {
  log("pointerup");
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var color = colorForTouch(evt);
  var idx = ongoingTouchIndexById(evt.pointerId);

  if (idx >= 0) {
    ctx.lineWidth = 4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
    ctx.lineTo(evt.clientX, evt.clientY);
    // ctx.fillRect(evt.clientX - 4, evt.clientY - 4, 8, 8);  // and a square at the end
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  } else {
    log("can't figure out which touch to end");
  }
} 

function handleCancel(evt) {
  log("pointercancel: id = " + evt.pointerId);
  var idx = ongoingTouchIndexById(evt.pointerId);
  ongoingTouches.splice(idx, 1);  // remove it; we're done
} 

function colorForTouch(touch) {
  var r = touch.pointerId % 16;
  var g = Math.floor(touch.pointerId / 3) % 16;
  var b = Math.floor(touch.pointerId / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  log("color for touch with identifier " + touch.pointerId + " = " + color);
  return color;
}

function copyTouch(touch) {
  return { identifier: touch.pointerId, pageX: touch.clientX, pageY: touch.clientY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
} 

function log(msg) {
  var p = document.getElementById('log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}