let gravity = 1;
let timeUnit = 0.5;
let windy = false;
let landScape = null;

let treecreated = false;
let bloomed = false;
//face
var tracker;
var ds = 2; // downsampling
var w = 640,
	h = 480;
//motion
let previousFrame;
let threshold = 15;
threshold = threshold * threshold;
let r1, g1, b1, r2, g2, b2, diff, motionColor;

//
var httpRequest = new XMLHttpRequest();
var state = "unknown";
function invoke() {
	httpRequest.open('GET', 'http://127.0.0.1:5000/read', true);
	httpRequest.send();
}
function onEnter() {
	createTree();
}
function onLeave() {
	windy = true;
}
//

let detected = false;
function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(24);
	landScape = new LandScape([], []);
	video = createCapture(VIDEO);
	video.size(w / ds, h / ds);
	video.hide();

	// this is the tracker thing
	//tracker = new clm.tracker();
	//tracker.init(pModel);
	//tracker.start(video.elt);

	//motion
	//prevFrame = createImage(video.width, video.height);
	//prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

	//
	httpRequest.onreadystatechange = function () {
		if (httpRequest.responseText == "ETR") {
			onEnter();
		} else if (httpRequest.responseText == "LVE") {
			onLeave();
		}
	    state = httpRequest.responseText;
	}
	//
}

function draw() {
	//
	invoke();
	//
	let wind = createVector(0, 0);
	if (windy) {
		wind = createVector(random(5, 15), 0);
	}
	landScape.update(wind);
	landScape.checkUp();
	landScape.display();
	//face
	/*
	positions = tracker.getCurrentPosition();
	if (positions.length == 71 & !detected) {
		detected = true;
		if (!treecreated) {
			treecreated = true;
			createTree();
		}
		if (treecreated & !bloomed) {
			bloomed = true;
			setTimeout(() => {
				for (let tree of landScape.trees) {
					pointToATree = true;
					tree.bloom(() => {
						return max(floor(randomGaussian(24, 12)), 0);
					});
				}
				// grow automatically
				setInterval(() => {
					if (treecreated) {
						if (bloomed) {
							if (landScape.flowers.length < 10) {
								for (let tree of landScape.trees) {
									pointToATree = true;
									tree.bloom(() => {
										return max(floor(randomGaussian(24, 12)), 0);
									});
								}
							}
						}
					}
				}, 10000);
			}, 5000);
		}
	} else {
		detected = false;
	}

	//motion
	//translate(width, 0); // move to far corner
	//scale(-1.0, 1.0);    // flip x-axis backwards
	prevFrame.loadPixels();
	video.loadPixels();

	//loop through every pixel	every four is a new pixel
	//to speed it up we are checking every other pixel
	for (let i = 0; i < video.pixels.length; i += 4) {
		//compare colors (previous vs. current)
		r1 = video.pixels[i];
		g1 = video.pixels[i + 1];
		b1 = video.pixels[i + 2];
		r2 = prevFrame.pixels[i];
		g2 = prevFrame.pixels[i + 1];
		b2 = prevFrame.pixels[i + 2];
		motionColor = (isMoving(r1, g1, b1, r2, g2, b2));

		// FUN SECTION
		//no motion detected
		windy = false;
		// Motion Detected
		if (motionColor >= threshold) {
			windy = true;
		}

	}
*/
	setTimeout(function () {
		prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
	}, 200)


}

function mousePressed() {
	if (!landScape.checkBloom(mouseX)) {
		createTree();
	}
}

function keyPressed() {
	if (key == ' ') {
		windy = !windy;
	} else {
		removeAll();
	}
}

function createTree() {
	let strength = floor(random(8, 10));
	landScape.addTree(new Tree(
		rootPos = createVector(windowWidth / 2, windowHeight * 5 / 6),
		totalHeight = windowHeight * 5 / 6,
		depth = strength,
		angleMean = -PI / 2,
		angleRange = PI / 2,
		asymmetry = 0.2,
		divergence = 0.8,
		precocity = 0.25,
		limit = 0.2,
		rubust = 0.2,
		damping = 0.5,
		lineColor = [96, 96, 72,],
		bloomDepth = 0,
		flowerRubust = 0.5,
		flowerMass = () => {
			return random(30, 50);
		},
		flowerColor = () => {
			return [
				random(192, 216),
				random(96, 144),
				random(64, 96),
				random(0, 255),
			];
		},
		flowerShape = () => {
			ellipse(0, 0, 1.2, 1.2);
		}
	));
}

function removeAll() {
	landScape.removeAll();
}

function outOfScreen(pos) {
	return pos.x < 0 || pos.y < 0 || pos.x > windowWidth || pos.y > windowHeight;
}

//motion
function isMoving(r1, g1, b1, r2, g2, b2) {
	return ((r2 - r1) * (r2 - r1)) + ((g2 - g1) * (g2 - g1)) + ((b2 - b1) * (b2 - b1));
	// return ((r2 - r1) * (r2 - r1)) + ((g2 - g1) * (g2 - g1)) + ((b2 - b1) * (b2 - b1))%15 > threshold;
}