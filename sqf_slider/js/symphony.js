var firstSound = null;
var secondSound = null;
var context = new webkitAudioContext();


var request1 = new XMLHttpRequest();
request1.open('GET', "/sqf_slider/sounds/ding2.ogg", true);
request1.responseType = 'arraybuffer';

// Decode asynchronously
request1.onload = function() {
  context.decodeAudioData(request1.response, function(buffer) {
	//console.log(request1.response)
    firstSound = buffer;
    
  });
}
request1.send();

var request2 = new XMLHttpRequest();
request2.open('GET', "/sqf_slider/sounds/dingc.ogg", true);
request2.responseType = 'arraybuffer';

// Decode asynchronously
request2.onload = function() {
  context.decodeAudioData(request2.response, function(buffer) {
	//console.log(request2.response)
    secondSound = buffer;
    
  });
}
request2.send();


function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = thisSound;                 // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.noteOn(0);                          // play the source now
}