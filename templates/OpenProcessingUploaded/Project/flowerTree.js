let gravity = 1;
let timeUnit = 0.5;
let windy = false;
let landScape = null;
let humanicon;
let currentstage = 0;
// sound effects
let glow;
let bgm1;
let wind1;
let wind2;
var SunY_change = 0;
var moonY_change = 1;

////////////////////////////////////////////////////////////////////////
//star variables
var starX = [10, 100, 3000, 40];
var starY = [];
var radius = [];
var maxRadius = [];
var speed = [];
var numStar = 20;
var SunY = 50;
var moonY = 0;
var SunY_change = 0;
var moonY_change = 1;

//wave variables
var yOffset = 0;

//cloud variables
var cloudX = [];
var cloudY = [];
var cloudSpeed = [];
////////////////////////////////////////////////////////////////////////

var httpRequest = new XMLHttpRequest();
var state = "unknown";
var userEntered = false;
function invoke() {
    httpRequest.open('GET', 'http://127.0.0.1:5000/read', true);
    httpRequest.send();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(24);

  httpRequest.onreadystatechange = function() {
        state = httpRequest.responseText;
    }
  ////////////////////////////////////////////////////////////////////////
  moonY = 2 * windowHeight;
  //Initialise star variables
  for (var i = 0; i < numStar; i++) {
    starX[i] = random(width);
    starY[i] = random(height / 2);
    radius[i] = 0;
    maxRadius[i] = random(5, 15);
    speed[i] = random(0.05, 0.25);
  }
  //Initialise cloud variables
  for (var i = 0; i < 5; i++) {
    cloudX[i] = random(width);
    cloudY[i] = 50 + i * 100;
  }
  ////////////////////////////////////////////////////////////////////////
  landScape = new LandScape([], []);
  humanicon = loadImage('humanicon.png');
  glow = loadSound('glow.wav');
  bgm1 = loadSound('bgm1.mp3');
  wind1 = loadSound('wind1.mp3');
  wind2 = loadSound('wind2.mp3');

}









let transparency = 255;
let iconscale = 2;
let humaniconcolor = 'grey';
function draw() {
  let wind = createVector(0, 0);
  if (windy) {
    wind = createVector(random(5, 15), 0);
  }
  ////////////////////////////////////////////////////////////////////////
  
	if (SunY > 2.5*windowHeight){
	SunY_change = 1;}
	else if (SunY < -0.5*windowHeight){SunY_change = 0;}
	if (SunY_change == 0){
	SunY = SunY + 0.8;}
	else if(SunY_change == 1){SunY = SunY - 0.8;}

	if (moonY > 2.5*windowHeight){
	moonY_change = 1;}
	else if (moonY < -0.5*windowHeight){moonY_change = 0;}
	if (moonY_change == 0){
	moonY = moonY + 0.8;}
	else if(moonY_change == 1){moonY = moonY - 0.8;}
	//Day/night cycle background colours
	var cycle = map(SunY*0.7, 0, height, 0, 1);
	var night = color(82, 77, 130);
	var day = color(255, 205, 168);
	var gradient = lerpColor(day, night, cycle);

	background(gradient);

  //clouds have jitter movement in y-axis


  //when clouds reach beyond edge of screen, clouds reset to original side

  fill(247, 247, 156);
  ellipse(windowWidth - 360, SunY, 200);

  fill(255);
  ellipse(360, moonY, 200);

  //create numStars amount of stars
  for (var i = 0; i < numStar; i++) {
    //stars change size (pulse)
    radius[i] += speed[i];

    //stars slow down when the raidus is greater than maxRadius
    if (radius[i] > maxRadius[i]) {
      speed[i] *= -1;
    }

    //stars reappear in a random location and grow in size, after the radius is no longer visible (<0) 
    if (radius[i] < 0) {
      speed[i] *= -1;
      starX[i] = random(width);
      starY[i] = random(0, height / 2);
    }

    //stars disppear during the day
    var starOpacity = map(SunY, 0, height, 0, 255);

    push();
    fill(255, starOpacity);
    strokeWeight(2);
    stroke(255, starOpacity - 200);
    ellipse(starX[i], starY[i], radius[i] * 1.5);
    pop();
  }
  //clouds
  fill(255);

  //drawing clouds
  for (var i = 0; i < 5; i++) {
    clouds(cloudX[i], cloudY[i]);
    cloudX[i] = cloudX[i] + 0.5;
    //clouds have jitter movement in y-axis
    cloudY[i] = cloudY[i] + random(-0.5, 0.5);

    //when clouds reach beyond edge of screen, clouds reset to original side
    if (cloudX[i] > width + 50) {
      cloudX[i] = -50;
    }
  }

  /*---------- WATER ----------*/


  //Subtle colour placed ontop of the whole sketch to give it atmosphere
  //have to change the color from the original to have an opacity level
  night = color(82, 77, 130, 60);
  day = color(255, 205, 168, 60);
  gradient = lerpColor(day, night, cycle);
  fill(gradient);
  rect(0, 0, width, height);
  ////////////////////////////////////////////////////////////////////////
  landScape.update(wind);
  landScape.checkUp();
  landScape.display();
  //////////////////////////////////////////////////////////////////////// water
  for (var i = 0; i < 4; i++) {
    push();

    //mapping water colour to mouse, to match time of day
    colorMode(HSB, 360, 100, 100, 100);
    //"i" is used for the colour gradient
    var from = color(209, 26, 95 - (i * 10), 95);
    var to = color(178, 10, 95 - (i * 5), 95);
    var waterCol = lerpColor(from, to, cycle); //cycle is already mapped from 0 to 1
    fill(waterCol);

    //drawing waves from the top layer to the bottom
    waves(height- windowHeight / 6+ ((i-1) * windowHeight / 6 / 4), height - windowHeight / 20 + ((i-1) * windowHeight / 6 / 4), i);
    pop();
  }
  ////////////////////////////////////////////////////////////////////////
  fill([0, 0, 0, transparency]);
  rect(0, 0, windowWidth, windowHeight);
  image(humanicon, windowWidth / 2 - humanicon.width / iconscale / 2, windowHeight / 2 - humanicon.width / iconscale / 2, humanicon.width / iconscale, humanicon.height / iconscale);
  if (humaniconcolor == 'grey') {
    tint([100, 100, 100, transparency]);
  }
  else {

    tint([255, 255, 2555, transparency]);
  }
  if (currentstage == 0) {
    return;
  }
  if (currentstage == 1) {
    transparency -= 5;
    if (transparency < 0) {
      currentstage = 2;
      bgm1.loop();
      createTree();
      setInterval(() => {
        createTree();
      }, 10000);
    }
  }

  setInterval(() => {
    treeBloom();
  }, 5000);

  //Arduino web interface
  //invoke();
  /*console.log(state);
  if (state == 'NBD') {
      if (userEntered) {
          userEntered = false;
          onLeave();
      } else {
          //
      }
  } else if (state == 'MOV') {
      if (userEntered) {
          windy = true;
          wind1.loop();
          wind2.play();
      }
  } else if (state == 'STL') {
      if (userEntered) {
          windy = false;
          wind1.stop();
          wind2.stop();
      } else {
          userEntered = true;
          onEnter();
      }
  }*/
}
function onEnter() {
  humaniconcolor = 'white';
  glow.play();
  setTimeout(() => {
    currentstage = 1;
  }, 3000);
}
function onLeave() {
  windy = true;
  humaniconcolor = 'grey';
}
function mousePressed() {
  if (currentstage == 0) {
    onEnter();
  } else {
    windy = !windy;
    if (windy) {
      wind1.loop();
      wind2.play();
    } else {
      wind1.stop();
      wind2.stop();
    }
  }
}

function keyPressed() {
  if (key == 'm') {
      if (state != 'm'){
          state = 'm';
          windy = true;
          wind1.loop();
          wind2.play();
      }
  } else if (key == 's') {
      if (state != 's'){
          state = 's';
          windy = false;
          wind1.stop();
          wind2.stop();
      }
  } else if (key == 'b') {
      if (state != 'b'){
          state = 'b';
          treeBloom();
      }
  } else if (key == 'e') {
      if (state != 'e'){
          state = 'e';
          onEnter();
      }
  }
}
function treeBloom() {
  if (windy) {
    return;
  }
  for (let tree of landScape.trees) {
    tree.bloom(() => {
      return max(floor(randomGaussian(24, 12)), 0) * 10;
    });
  }
}

function createTree() {
  let strength = floor(random(6, 8));
  let x_position;
  let tree_height;
  let middle = 1;
  switch (landScape.trees.length) {
    case 0:
      x_position = windowWidth * random(0.45, 0.55);
      tree_height = 0.9;
      middle = 2; // Bigger flowers.
      break;

    case 1:
      x_position = windowWidth * random(0.15, 0.25);
      tree_height = random(0.5, 0.6);
      break;

    case 2:
      x_position = windowWidth * random(0.75, 0.85);
      tree_height = random(0.5, 0.6);
      break;

    default:
      return
      break;
  }
  landScape.addTree(new Tree(
    rootPos = createVector(x_position, windowHeight * 5 / 6),
    totalHeight = windowHeight * 5 / 6 * tree_height,
    depth = strength,
    angleMean = -PI / 2,
    angleRange = PI / 2.5,
    asymmetry = 0.1,
    divergence = 0.8,
    precocity = 0.25,
    limit = 0.2,
    rubust = 0.2,
    damping = 0.5,
    lineColor = [96, 96, 72,],
    bloomDepth = 0,
    flowerRubust = 0.01,
    flowerMass = () => {
      return random(10, 100) * middle;
    },
    flowerColor = () => {
      return [
        random(192, 216),
        random(96, 144),
        random(64, 96),
        192,
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


function waves(minHeight, maxHeight, nStart) {

  beginShape();
  /* xOffset - x parameter for noise
     * yOffset - y parameter for noise */
  var xOffset = nStart;
  for (var x = 0; x <= width; x += 20) {
    //using noise to determine water flow/waves
    var y = map(noise(xOffset, yOffset), 0, 1, minHeight, maxHeight);
    vertex(x, y);
    xOffset += 0.05;
  }
  yOffset += 0.001;
  vertex(width, height);
  vertex(0, height);

  endShape(CLOSE);
}

/* Description - Drawing cloud shape with ellipses */
function clouds(x, y) {
  ellipse(x, y - 10, 40);
  ellipse(x + 10, y - 10, 30);
  ellipse(x + 10, y - 10 - 10, 40);
  ellipse(x + 20, y - 10, 35);
  ellipse(x + 30, y - 10, 30);
}