class Icon {
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.held = false;
		this.id = id;
	}

	update() {
		var size = 25;
		var hSize = size/2;

		var [x,y] = [this.x,this.y];

		var inside = (
			mx >= x-hSize &&
			mx <= x+hSize &&
			my >= y-hSize &&
			my <= y+hSize
		)

		//console.log(m == 1, inside, !checkCharActive(this.id))
		if (m == 1 && inside && !checkCharActive(this.id)) {
			this.held = true;
			console.log("h")
		}
		if (m == 0 && this.held) {
			polo.forEach((p, i) => {
				if (p.mouseInside()) {
					placeCharAt(i, this.id);
					return;
				}
			})
			this.held = false;
		}
	}

	draw() {
		c.fillStyle = "#D0D0D0";
		if (checkCharActive(this.id))
			c.fillStyle = "#EEE";

		var [dx, dy] = [0,0];
		if (this.held) {
			dx = mx;
			dy = my;
		} else {
			dx = this.x;
			dy = this.y;
		}
		var size = 25;
		var hSize = size/2;
		c.fillRect(dx-hSize,dy-hSize,size,size);
	}
}

class Polo {
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.showDelay = Math.floor(Math.random() * 25);
		this.blinkTime = Math.random();
	}

	update() {
		this.showDelay --;
		this.blinkTime -= ms;
		if (Math.random() < 0.008) {
			this.blinkTime = Math.random() * 0.2;
		}

		var iconHeldId = -1;
		icons.forEach((ico, i) => {
			if (ico.held) {
				iconHeldId = i;
				return;
			}
		});

		if (this.mouseInside() && activeSlots[this.id] >= 0 && m == 1) {
			stopCharSound(activeSlots[this.id]);
			activeSlots[this.id] = -1;
			placeCharAt(this.id, -1);
		}
	}

	draw() {
		if (this.showDelay > 0) return

		var charId = activeSlots[this.id];
		if (charId >= 0) {
			var y = this.y - 20;

			var filename = charImgFilenames[charId];
			var char = img[filename];
			var center = this.x - (char.naturalWidth/2);

			if (charId == 9) {
				y -= Math.sin(timer * 0.4) * 15 + 10;

				var size = 1.2;

				var glo = (Math.abs(Math.sin(timer * 0.6)) * 6);
				c.filter = `blur(${glo}px)`;

				c.drawImage(char, center, y);
			}

			c.filter = 'none';
			c.drawImage(char, center, y);

			return;
		}

		var body = img.polo_body;
		var head = this.blinkTime > 0 ? img.polo_head2 : img.polo_head;

		var centerB = this.x - (body.naturalWidth/2);
		var centerH = this.x - (head.naturalWidth/2);

		c.drawImage(body, centerB, this.y)
		c.drawImage(head, centerH, this.y - 20)
	}

	mouseInside() {
		var body = img.polo_body;
		var centerB = (body.naturalWidth/2);

		var inside = (
			mx >= this.x - centerB &&
			mx <= this.x + centerB &&
			my >= this.y - 20 &&
			my <= sh - 150
		);

		return inside;
	}
}

var charImgFilenames = [
	"char_b1",
	"char_b2",
	"char_b3",
	"char_b4",
	"char_b5",
	"char_e1",
	"char_e2",
	"char_e3",
	"char_e4",
	"char_e5",
	"char_m1",
	"char_m2",
	"char_m3",
	"char_m4",
	"char_m5",
	"char_v1",

	"char_v4",
	"char_v5",
]
var img = {
	loopa1: new Image(),
	loopa2: new Image(),
	loopb1: new Image(),
	loopb2: new Image(),

	polo_body: new Image(),
	polo_head: new Image(),
	polo_head2: new Image(),

	char_b1: new Image(),
	char_b2: new Image(),
	char_b3: new Image(),
	char_b4: new Image(),
	char_b5: new Image(),
	char_e1: new Image(),
	char_e2: new Image(),
	char_e3: new Image(),
	char_e4: new Image(),
	char_e5: new Image(),
	char_m1: new Image(),
};

var cv = document.getElementById("cv");
var c  = cv.getContext('2d');

var sw = cv.width;
var sh = cv.height;

var mx = my = 0;
var m = 0;

cv.addEventListener('mousemove', (e) => {
	var rect = cv.getBoundingClientRect();
	mx = (e.clientX - rect.left) * 0.58;
	my = (e.clientY - rect.top) * 0.67;
});
cv.addEventListener('mousedown', () => {
	m = 1;
});
cv.addEventListener('mouseup', () => {
	m = 0;
});


var otherSnd = {
	startup: new Audio("sound/other/startup.mp3"),
}

var bpm = 136;
var beat = 60 / bpm;
var loopDur = beat * 8 * 2;
var curLoop = 1;
var soundCharactersLoopA = [
	new Audio("sound/b1a.wav"), // 0
	new Audio("sound/b2.wav"), // 1
	new Audio("sound/b3.wav"), // 2
	new Audio("sound/b4a.wav"), // 3
	new Audio("sound/b5.wav"), // 4
	new Audio("sound/e1a.wav"), // 5
	new Audio("sound/e2.wav"), // 6
	new Audio("sound/e3.wav"), // 7
	new Audio("sound/e4.wav"), // 7
	new Audio("sound/e5a.wav"), // 7
	new Audio("sound/m1a.wav"), // 7
];
var soundCharactersLoopB = [
	new Audio("sound/b1b.wav"), // 0
	new Audio("sound/b2.wav"), // 1
	new Audio("sound/b3.wav"), // 2
	new Audio("sound/b4b.wav"), // 3
	new Audio("sound/b5.wav"), // 4
	new Audio("sound/e1b.wav"), // 5
	new Audio("sound/e2.wav"), // 6
	new Audio("sound/e3.wav"), // 7
	new Audio("sound/e4.wav"), // 8
	new Audio("sound/e5b.wav"), // 9
	new Audio("sound/m1b.wav"), // 9
];

var activeSlots = [
	-1, // 0
	-1, // 1
	-1, // 2
	-1, // 3
	-1, // 4
	-1, // 5
	-1, // 6
	-1, // 7
	-1, // 8
];

var bonReq = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	//7,
]
var bonusProgTxt = [
	"none",

	"not twice",
	"not e nough",
	"need     more",
	"no even close",
	"close",
	"good"
];
var bonTxt = bonusProgTxt[0];
var bonTxtGuideShow = 0;

function checkCharActive(id) {
	return activeSlots.some(i => id == i);
}

function stopCharSound(id) {
	if (id < 0) return;
	//console.log(id);
	soundCharactersLoopA[id].pause();
	soundCharactersLoopA[id].currentTime = 0;
	soundCharactersLoopB[id].pause();
	soundCharactersLoopB[id].currentTime = 0;
}

function refreshDisplay(fr=0) {
	var frames = (Math.random() * 40);
	if (fr > 0) {
		frames = fr;
	}

	polo.forEach((p, i) => {
		p.showDelay = Math.floor(Math.random() * frames);
	});
	uiFramesUnshow = Math.random() * (frames * 1.3);
}

function placeCharAt(poloId, charId = -1) {
	var p = activeSlots[poloId];
	if (p <= -1) {
		activeSlots[poloId] = charId;

		var rqFound = 0;
		bonReq.forEach((cId, i) => {
			if (activeSlots.some(ID => cId == ID)) {
				rqFound ++;
			}
			if (allPolosCleared(activeSlots)) {
				loopTimer = loopDur - 1.5;
			}
		});
		bonTxt = bonusProgTxt[rqFound];
	}
}

var allPolosCleared = arr => arr.every(v => v == -1);

function playLoop() {
	activeSlots.forEach((s, i) => {
		if (s <= -1) return;


		if (curLoop == 0) {
			soundCharactersLoopA[s].currentTime = 0;
			soundCharactersLoopA[s].play();
		} else if (curLoop == 1) {
			soundCharactersLoopB[s].currentTime = 0;
			soundCharactersLoopB[s].play();
		}

	});
}

var icons = [];
for (var i = 0; i < 10; i++) {
	icons.push(new Icon(i * 30 + 35,sh - 100, i))
};
for (var i = 10; i < 15; i++) {
	icons.push(new Icon((i - 10) * 30 + 35,sh - (100 - 30), i))
};
var polo = [];
for (var i = 0; i < activeSlots.length; i++) {
	var margin = 10;
	var slice = (sw - margin) / activeSlots.length;
	polo.push(new Polo((i+0.5) * slice + margin, 130, i))
};

var dt = 1;
var ms = 0.016;
var lastTime = 0;
var loopTimer = loopDur - 1.5;
var timeUntilRf = Math.random() * 35;
var timer = 0;

var uiFramesUnshow = 0;
function loop(now) {
	dt = now - lastTime;
	lastTime = now;
	ms = dt / 1000;

	if (activeSlots.some(pId => pId >= 0)) loopTimer += ms;
	timer += ms;
	timeUntilRf -= ms;

	uiFramesUnshow -= Math.random() * 1;

	if (timeUntilRf <= 0) {
		timeUntilRf = Math.random() * 15;
		if (!checkCharActive(9)) refreshDisplay();
	}

	if (loopTimer >= loopDur) {
		loopTimer = 0;
		curLoop = 1 - curLoop;
		console.log(curLoop + "is song state");

		playLoop();
	}

	if (m >= 1 && mx >= sw - img.loopa1.naturalWidth && my <= 50) {
		polo.forEach((p, i) => {
			stopCharSound(activeSlots[i]);
			activeSlots[i] = -1;
			placeCharAt(i,-1);
		})
	}

	icons.forEach((ico, i) => {
		ico.update();
	});
	polo.forEach((p, i) => {
		p.update();
	})

	bonTxtGuideShow -= ms;


	if (m >= 1) {
		m ++;
	}

	// drawing
	c.fillStyle = "#DDD";
	c.fillRect(0, 0, 999,999);

	polo.forEach((p, i) => {
		p.draw();
	})

	// ui
	c.fillStyle = "#fff";
	if (uiFramesUnshow < 0) {
		c.fillRect(0, 0, 999,50);
		c.fillRect(0, sh-150, 999,150);
	}

	var imageLop = img.loopa1;
	if (curLoop == 0) {
		if (loopTimer > loopDur / 2) {
			imageLop = img.loopa2;
		}
	} else if (curLoop == 1) {
		imageLop = img.loopb1
		if (loopTimer > loopDur / 2) {
			imageLop = img.loopb2;
		}
	}
	if (allPolosCleared(activeSlots)) {
		imageLop = img.loopa1;
	}
	c.drawImage(imageLop,(sh * 1.75)-img.loopa1.naturalWidth,0);

	// square
	icons.forEach((ico, i) => {
		ico.draw();
	});

	// b
	c.font = "13px sans-serif";
	c.fillStyle = "#132";
	c.fillText(bonTxt,0,12);

	if (bonTxtGuideShow > 0) {
		c.fillText("no cheating", 0, sh - 150);
	} else {
		if (mx < 100 && my < 20 && m == 2) { // 2 since m add + 1 before draw
			bonTxtGuideShow = 1;
		}
	}

	requestAnimationFrame(loop);
}

function introScreen() {
	c.fillStyle = "#000";
	c.fillRect(0, 0, sw,sh);

	c.fillStyle = "#FFF";
	c.font = '30px sans-serif';
	c.fillText("Game creator", 100, 100);
	c.font = '10px sans-serif';
	c.fillText("production", 100, 200);


	c.fillText("wait", 200, 200);

	var imgKeys = Object.keys(img);
	imgKeys.forEach((key, i) => {
		img[key].src = "images/" + key + ".png";
	})
}
function cover() {
	c.fillStyle = "#000";
	c.fillRect(0, 0, sw,sh);

	c.fillStyle = "#FFF";
	c.font = '30px sans-serif';
	c.fillText("miusic mixer", 100, 100);
	c.font = '10px sans-serif';
	c.fillText("cool", 130, 120);

	requestAnimationFrame(cover);
}

var loadedImgs = 0;
var totalLoadedImgs = Object.keys(img).length;
function checkImgsLoaded() {
	if (loadedImgs == totalLoadedImgs) {

	}
}

var delay = Math.floor(Math.random() * 3000);
introScreen();
setTimeout(() => {
	requestAnimationFrame(loop);
	otherSnd.startup.play();
}, delay);