var cv = document.getElementById("cv");
var c  = cv.getContext('2d');

var bpm = 136;
var beat = bpm / 60;
var loopDur = beat * 4 * 8;
var soundCharacters = [
	new Audio("sound/b1.wav"), // 0
	new Audio("sound/b1.wav"), // 1
];

var dt = 1;
var ms = 0.016;
var lastTime = 0;

function loop(now) {
	dt = now - lastTime;
	ms = dt / 1000;
}