//Main game file

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var INIT_HEIGHT = 5000; //initial height for testing
var LOW_LIMIT = 2000;
var DIVER_START_X = 90;
var DIVER_START_Y = 100;
var SLOW_POS_X = 150;
var SLOW_POS_Y = 70;
var SPEED_POS_X = 120;
var SPEED_POS_Y = 160;
var diver = new Diver("red");
var ht = new HeightTracker();
var speedUp;
var slowDown;
var glideLeft;
var glideRight;
var DIVE_ACCEL = 3;

//Controls
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(e){
	//freefall keys
	if(e.keyCode == 38 || e.keyCode == 87){ //up arrow or w
		//prevents resetting position when gliding
		if(ht.height > LOW_LIMIT){
			slowDown = true;
		}
	} 
	else if(e.keyCode == 40 || e.keyCode == 83){ //down arrow or s
		//prevents resetting position when gliding
		if(ht.height > LOW_LIMIT){
			speedUp = true;
		}
	} 
	//parachute keys
	else if(e.keyCode == 37 || e.keyCode == 65){ //left arrow or a
		glideLeft = true;
	} 
	else if(e.keyCode == 39 || e.keyCode == 68){ //right arrow or d
		glideRight = true;
	} 
}

function keyUpHandler(e){
	//freefall keys
	if(e.keyCode == 38 || e.keyCode == 87){ //up arrow or w
		slowDown = false;
	} 
	else if(e.keyCode == 40 || e.keyCode == 83){ //down arrow or s
		speedUp = false;
	} 
	//parachute keys
	else if(e.keyCode == 37 || e.keyCode == 65){ //left arrow or a
		glideLeft = false;
	} 
	else if(e.keyCode == 39 || e.keyCode == 68){ //right arrow or d
		glideRight = false;
	} 
}

//Diver constructor
function Diver(color){
	//TODO: replace width,height, ctx fill stuff with diver image
	this.width = 30;
	this.height = 30;
	this.color = color;
	this.x = DIVER_START_X; 
	this.y = DIVER_START_Y;
	this.x_vel = 0;
	this.y_vel = 0;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x,this.y, this.width,this.height);
}

//handles updates for player
Diver.prototype.update = function(){
	//temp fix, figure out better way to prevent holding down buttons || diver can continue to return after key is released
	if((ht.height <= LOW_LIMIT && (speedUp || slowDown)) || (ht.height > LOW_LIMIT && !speedUp && !slowDown)){
		this.dive_move(DIVER_START_X,DIVER_START_Y);
	}
	else if(ht.height > LOW_LIMIT && slowDown){
		this.dive_move(SLOW_POS_X,SLOW_POS_Y);
	}
	else if(ht.height > LOW_LIMIT && speedUp){
		this.dive_move(SPEED_POS_X,SPEED_POS_Y);
	}
	//can only glide at or below LOW_LIMIT
	else if(glideLeft && ht.height <= LOW_LIMIT){
		this.x -= 2;
	}
	else if(glideRight && ht.height <= LOW_LIMIT){
		this.x += 2;
	}
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x,this.y, this.width,this.height);
}

//calculating movements for slowing down and speeding up
Diver.prototype.dive_move = function(x_pos,y_pos){
	//temp, make more accurate
	this.x_vel = (x_pos - this.x)/10;
	this.y_vel = (y_pos - this.y)/10;
	this.x += this.x_vel;
	this.y += this.y_vel;
	//console.log("x: "+this.x+" y: "+this.y);
}

//calculation movements for gliding left and right
Diver.prototype.glide_move = function(action){

}

//Keeps track of height 
function HeightTracker(){
	this.height = INIT_HEIGHT;
	this.x = 650;
	this.y = 30;
	this.update = function(){
		this.height -= 10; //for testing purposes
		if(this.height <= 0){
			this.height = 0;
		}
		ctx.font = "30px Silkscreen"
		ctx.fillStyle = "#666666"
		ctx.fillText("Height: "+this.height,this.x, this.y);
	}
}
//Setting up canvas, will help with setting different themes
function setupCanvas(){
	//console.log("setup canvas");
	ctx.canvas.width = 900;
	ctx.canvas.height = 600;
	ctx.fillStyle = "#80D4FF";
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function drawMap(){

}

//begin game
function startGame(){
	setupCanvas();
	setInterval(updateGame,17); //~60 fps
}

function updateGame() {
	updateCanvas();
	ht.update();
	diver.update();
}

function updateCanvas() {
	//console.log("updating canvas");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#80D4FF";
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}


