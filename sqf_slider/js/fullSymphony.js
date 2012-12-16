var SOUND_1a = null;
var SOUND_1b = null;

var SOUND_2a = null;
var SOUND_2b = null;

var SOUND_3a = null;
var SOUND_3b = null;

var SOUND_4a = null;
var SOUND_4b = null;

// var SOUND_5a = null;
// var SOUND_5b = null;

var context = new webkitAudioContext();

//#################
//# First Sound - SOUND_1a
//#################

var SOUND_1a_request = new XMLHttpRequest();
SOUND_1a_request.open('GET', "/sqf_slider/sounds/SOUND_1a.mp3", true);
SOUND_1a_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_1a_request.onload = function() {
  context.decodeAudioData(SOUND_1a_request.response, function(buffer) {
    SOUND_1a = buffer;
    
  });
}
SOUND_1a_request.send();

//#################
//# Next Sound - SOUND_1b
//#################

var SOUND_1b_request = new XMLHttpRequest();
SOUND_1b_request.open('GET', "/sqf_slider/sounds/SOUND_1b.mp3", true);
SOUND_1b_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_1b_request.onload = function() {
  context.decodeAudioData(SOUND_1b_request.response, function(buffer) {
    SOUND_1b = buffer;
    
  });
}
SOUND_1b_request.send();


//#################
//# Next Sound - SOUND_2a
//#################

var SOUND_2a_request = new XMLHttpRequest();
SOUND_2a_request.open('GET', "/sqf_slider/sounds/SOUND_2a.mp3", true);
SOUND_2a_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_2a_request.onload = function() {
  context.decodeAudioData(SOUND_2a_request.response, function(buffer) {
    SOUND_2a = buffer;
    
  });
}
SOUND_2a_request.send();

//#################
//# Next Sound - SOUND_2b
//#################

var SOUND_2b_request = new XMLHttpRequest();
SOUND_2b_request.open('GET', "/sqf_slider/sounds/SOUND_2b.mp3", true);
SOUND_2b_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_2b_request.onload = function() {
  context.decodeAudioData(SOUND_2b_request.response, function(buffer) {
    SOUND_2b = buffer;
    
  });
}
SOUND_2b_request.send();


//#################
//# Next Sound - SOUND_3a
//#################

var SOUND_3a_request = new XMLHttpRequest();
SOUND_3a_request.open('GET', "/sqf_slider/sounds/SOUND_3a.mp3", true);
SOUND_3a_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_3a_request.onload = function() {
  context.decodeAudioData(SOUND_3a_request.response, function(buffer) {
    SOUND_3a = buffer;
    
  });
}
SOUND_3a_request.send();

//#################
//# Next Sound - SOUND_3b
//#################

var SOUND_3b_request = new XMLHttpRequest();
SOUND_3b_request.open('GET', "/sqf_slider/sounds/SOUND_3b.mp3", true);
SOUND_3b_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_3b_request.onload = function() {
  context.decodeAudioData(SOUND_3b_request.response, function(buffer) {
    SOUND_3b = buffer;
    
  });
}
SOUND_3b_request.send();



//#################
//# Next Sound - SOUND_4a
//#################

var SOUND_4a_request = new XMLHttpRequest();
SOUND_4a_request.open('GET', "/sqf_slider/sounds/SOUND_4a.mp3", true);
SOUND_4a_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_4a_request.onload = function() {
  context.decodeAudioData(SOUND_4a_request.response, function(buffer) {
    SOUND_4a = buffer;
    
  });
}
SOUND_4a_request.send();

//#################
//# Next Sound - SOUND_4b
//#################

var SOUND_4b_request = new XMLHttpRequest();
SOUND_4b_request.open('GET', "/sqf_slider/sounds/SOUND_4b.mp3", true);
SOUND_4b_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_4b_request.onload = function() {
  context.decodeAudioData(SOUND_4b_request.response, function(buffer) {
    SOUND_4b = buffer;
    
  });
}
SOUND_4b_request.send();


//#################
//# Next Sound - SOUND_5a
//#################

var SOUND_5a_request = new XMLHttpRequest();
SOUND_5a_request.open('GET', "/sqf_slider/sounds/SOUND_5a.mp3", true);
SOUND_5a_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_5a_request.onload = function() {
  context.decodeAudioData(SOUND_5a_request.response, function(buffer) {
    SOUND_5a = buffer;
    
  });
}
SOUND_5a_request.send();

//#################
//# Next Sound - SOUND_5b
//#################

var SOUND_5b_request = new XMLHttpRequest();
SOUND_5b_request.open('GET', "/sqf_slider/sounds/SOUND_5b.mp3", true);
SOUND_5b_request.responseType = 'arraybuffer';

// Decode asynchronously
SOUND_5b_request.onload = function() {
  context.decodeAudioData(SOUND_5b_request.response, function(buffer) {
    SOUND_5b = buffer;
    
  });
}
SOUND_5b_request.send();


//#################
//# Handle Playing
//#################
function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = thisSound;                 // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.noteOn(0);                          // play the source now
}