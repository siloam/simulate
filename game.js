enchant();

//Helpers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)};

function generateColor() {
    var r =  getRandomInt(0,225);
	var g =  getRandomInt(0,225);
	var b =  getRandomInt(0,225);
	return "rgb(" + r + "," + g + "," + b + ")"
};

//Core Settings
var game = new Core(320, 440);

game.preload('lock1.wav','lock2.wav', 'lock3.wav', 'lock4.wav', 'se2.wav', 'se3.wav');

game.fps = 30;

var waitingForInput = false;
var currentStep;
var score = 0;


//RGBs
var WHITE        = "rgb(255, 255, 255)";
var BLACK        = "rgb(0, 0, 0)";
var BRIGHTRED    = "rgb(255,  0,  0)";
 var RED          = "rgb(155, 0, 0)";
var BRIGHTGREEN  = "rgb(0, 255, 0)";
var GREEN = "rgb(0, 155, 0)";
var BRIGHTBLUE   = "rgb(0,0, 255)";
var BLUE = "rgb(0, 0, 155)";
var BRIGHTYELLOW = "rgb(255, 255, 0)";
var YELLOW = "rgb(155, 155, 0)";
var DARKGRAY = "rgb( 40,  40,  40)";
var bgColor = BLACK;
var pattern = [];
var clickedButton;

var COLORS = [YELLOW, GREEN, BLUE, RED];

//Label
var l = new Label();
l.font = "26px sans-serif";
l.text = "Score: " + score.toString();
l.x = 5;
l.y = 20;
l.color = "white";
l.textAlign = "center";
l._style.textShadow = "-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black";


//Brick
var Brick = function(x,y, color1, color2, sound) {
	var b = new Sprite(100, 100);
	//
	var s =  new Surface(100, 100);
	s.context.fillStyle = color1;
	s.context.fillRect(0, 0, 100,100);
	s.context.fill();
	//
	var z =  new Surface(100, 100);
	z.context.fillStyle = color2;
	z.context.fillRect(0, 0, 100,100);
	z.context.fill();
	//
	b.image = s;
	b.x = x;
	b.y =y;
	
	b.play = function() {
	this.image=z;
	game.assets[sound].play(true);
	this.tl.delay(15).then(function() {
	this.image=s;})};
	
	b.on('touchstart', function(e) {
	  if (waitingForInput === true) {  
		this.image=z;
		game.assets[sound].play();
		this.tl.delay(15).then(function() {
		this.image=s; });
		
		clickedButton = this;
		
		if ((clickedButton !== null) && (clickedButton !== undefined) && (clickedButton === pattern[currentStep])) {
			currentStep+=1;
			
			if (currentStep  === pattern.length) {
			score+=1;
			waitingForInput = false;
			l.text = "Score: " + score.toString()
			game.rootScene.tl.delay(60).then(function() {game.computerTurn()});
			game.assets['se2.wav'].play();
			};
		}
		else {
		  console.log("You've lost");
		  score = 0;
		  pattern = [];
		  l.text = 'Score: ' + score.toString()
		  waitingForInput = false;
		  game.rootScene.tl.delay(60).then(function() {game.computerTurn()});
		  game.assets['se3.wav'].play();
		}
	  
	  };
	});
	return b;
}
//Scene

//Background
//var Bg = function() {
//	bg = new Sprite(200, 220);
//	bg.x = 100;
//	bg.y = 100;
//	var x =  new Surface(200, 220);
//	x.context.fillStyle = "rgba(0,255,0,100)";
//	x.context.fillRect(0,0,320,440);
//	bg.image = x;
//	return bg
//	}


game.onload = function() {
var r = new Brick(55,200, RED, BRIGHTRED, "lock1.wav");
var y = new Brick(165,200, YELLOW, BRIGHTYELLOW,"lock2.wav");
var b = new Brick(165,90, BLUE, BRIGHTBLUE, "lock3.wav");
var g = new Brick(55,90, GREEN, BRIGHTGREEN, "lock4.wav");

var BUTTONS = [r,y,b,g];

game.rootScene.addChild(r);
game.rootScene.addChild(y);
game.rootScene.addChild(b);
game.rootScene.addChild(g);
game.rootScene.addChild(l);

game.computerTurn = function() {
  	pattern.push(BUTTONS[getRandomInt(0,3)]);
	var DELAY = 12;
	pattern.forEach(function(i) {
	game.rootScene.tl.delay(DELAY).then(function() {i.play()});
	DELAY+=12;});

	game.rootScene.tl.delay(DELAY).then(function(){waitingForInput = true});
	currentStep = 0;
	game.rootScene.backgroundColor = generateColor();
};
    
if (waitingForInput === false) {
  game.rootScene.tl.delay(15).then(function(){
  game.computerTurn()});
}; 


};

game.start();
window.scrollTo(0,0);