//Main game file

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var CAN_W = 900; //for testing
var CAN_H = 600; //
var INIT_HEIGHT = 500; //initial height for testing
var LOW_LIMIT = 2000;	//limit where chute will deploy
var DIVER_START_X = 90;	//start position of diver
var DIVER_START_Y = 100;//
var SLOW_POS_X = 150;	//position of diver when slowing down
var SLOW_POS_Y = 70;	//
var SPEED_POS_X = 120;	//position of diver when speeding up
var SPEED_POS_Y = 160;	//
var GLIDE_MAX = 5;		//max speed when gliding
var CHANGE_DIR = .95; 	//used for easing into changing direction, no sharp direction change
var speedUp;			//booleans for key handling
var slowDown;			//
var glideLeft;			//
var glideRight;			//
var DIVE_SPEED = 10;	//Speed at which diver falls
var DESCEND = 400;		//Height diver begins approaching ground

var diver = new Diver("green");
var ht = new HeightTracker();
var target;
var clouds = [];

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
	else if((glideLeft || glideRight) && ht.height <= LOW_LIMIT){ 
		this.glide_move();
	}
	//keys are released while gliding, slow velocity down
	else if(Math.abs(this.x_vel) > 0 && ht.height <= LOW_LIMIT){
		this.x_vel *= CHANGE_DIR;
		this.x += this.x_vel;
	}
	/*moves diver back to correct y pos if not at it once LOW_LIMIT is passed #### works but too jumpy atm
	if(this.y != DIVER_START_Y && ht.height <= LOW_LIMIT){
		this.y = DIVER_START_Y;
	}*/
	//checking bounds
	if(this.x <= 70){
		this.x = 70;
	}
	else if(this.x >= canvas.width - 100){
		this.x = canvas.width - 100;
	}
	//check if diver is at/below DESCEND and begin to lower position
	if(ht.height <= DESCEND && ht.height > 0){
		this.y += 1;
	}

	ctx.fillStyle = this.color;
	ctx.fillRect(this.x,this.y, this.width,this.height);
}

//calculating movements for slowing down and speeding up
Diver.prototype.dive_move = function(x_pos,y_pos){
	this.x_vel = (x_pos - this.x)/10;
	this.y_vel = (y_pos - this.y)/10;
	this.x += this.x_vel;
	this.y += this.y_vel;
	//for accuracy, when diver gets close to diving position, just set to certain position
	//helps with collision detection (I think)
	//TODO: handle holding multiple keys down
	if(speedUp && (SPEED_POS_X - this.x < .5)){
		this.x = SPEED_POS_X;
	}
	if(speedUp && (SPEED_POS_Y - this.y < .5)){
		this.y = SPEED_POS_Y;
	}
	if(slowDown && (SLOW_POS_X - this.x < .5)){
		this.x = SLOW_POS_X;
	}
	if(slowDown && (this.y - SLOW_POS_Y < .5)){
		this.y = SLOW_POS_Y;
	}
	if(x_pos === DIVER_START_X && (this.x - DIVER_START_X < .5)){
		this.x = DIVER_START_X;
	}
	if(y_pos === DIVER_START_Y && (Math.abs(this.y - DIVER_START_Y) < .5)){
		this.y = DIVER_START_Y;
	}
	//console.log("x: "+this.x+" y: "+this.y);
}

//calculation movements for gliding left and right
Diver.prototype.glide_move = function(){
	if(glideLeft){
		if(this.x_vel > -GLIDE_MAX){
			this.x_vel--;
			if(this.x_vel < -GLIDE_MAX){
				this.x_vel = -GLIDE_MAX;
			}
		}
		this.x += this.x_vel;
	}
	else if(glideRight){
		if(this.x_vel < GLIDE_MAX){
			this.x_vel++;
			if(this.x_vel > GLIDE_MAX){
				this.x_vel = GLIDE_MAX;
			}
		}
		this.x += this.x_vel;
	}
}

//Constructor, keeps track of height used for later calculations 
function HeightTracker(){
	this.height = INIT_HEIGHT;
	this.x = 650;
	this.y = 30;
	ctx.font = "30px Silkscreen"
	ctx.fillStyle = "#666666"
	ctx.fillText("Height: "+this.height,this.x, this.y);
}

HeightTracker.prototype.update = function(){
	//testing, will change DIVE_SPEED in future
	if(speedUp && this.height > LOW_LIMIT){ //speeding up
		this.height -= DIVE_SPEED*2;
		//console.log(DIVE_SPEED*2);
	}
	else if(slowDown && this.height > LOW_LIMIT){ //slowing down
		this.height -= DIVE_SPEED/2;
		//console.log(DIVE_SPEED/2);
	}
	else if(this.height > LOW_LIMIT){ //default falling
		this.height -= DIVE_SPEED; 
		//console.log(DIVE_SPEED);
	}
	else{ //below LOW_LIMIT
		this.height -= DIVE_SPEED/10;
		//console.log(DIVE_SPEED/10);
	}
	//can't fall through ground
	if(this.height <= 0){
		this.height = 0;
	}
	ctx.font = "30px Silkscreen"
	ctx.fillStyle = "#666666"
	ctx.fillText("Height: "+this.height,this.x, this.y);

}

//begin game
function startGame(){
	//preload();
	setupCanvas();
	setInterval(updateGame,17); //~60 fps
}

function updateGame() {
	updateCanvas();
	ht.update();
	diver.update();
}

//Setting up canvas, will help with setting different themes
function setupCanvas(){
	//Background "sky"
	ctx.canvas.width = 900;
	ctx.canvas.height = 600;
	ctx.fillStyle = "#80D4FF";
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
	//Background entities clouds, hills, etc
	placeTarget(550,600);
	cloudGen();
	for(i=0;i<clouds.length;i++){
		clouds[i].update();
	}
	
}

function updateCanvas() {
	//console.log("updating canvas");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#80D4FF";
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
	//update
	for(i=0;i<clouds.length;i++){
		clouds[i].update();
	}
	if(ht.height <= DESCEND){
		target.appear();
	}	
}

//constructor for sprites
function Sprite(file){
	this.x = null;
	this.y = null;
	this.h = null;
	this.w = null;
	this.image = null;
	if(file != undefined && file != "" && file != null){
		this.image = new Image();
		this.image.src = "assets/img/"+file;
		this.h = this.image.height;
		this.w = this.image.width;
	}else{
		console.log("unable to load sprite: "+file);
	}
	this.draw = function(width,height){
		ctx.drawImage(this.image,this.x,this.y,width,height);
	}

}
//Landing target
function Target(){
	//once a low enough height is reached, target will scroll up into screen
	this.appear = function(){
		if(this.y >= 565-this.h){
			this.y--;
		}
		this.draw(this.w*1.5,this.h);
	}
}

Target.prototype = new Sprite("target.png");
Target.prototype.constructor = Target;

function placeTarget(x,y){
	target = new Target();
	target.x = x;
	target.y = y;
}


//background clouds
function Cloud(){
	this.update = function(){
		this.x--;
		if(this.x < -this.w){
			this.x = CAN_W;
			this.y = Math.floor((Math.random()*(CAN_H+100))-100);
		}
		if(ht.height > DESCEND-target.h){ 
			this.y -= 0.5;
			if(ht.height > LOW_LIMIT){//clouds move faster 
				this.y-= 2;
			}
			if(this.y < -this.h){
				this.y = CAN_H;
			}
		}
		this.draw(this.w*.75,this.h*.75);
	}
}

Cloud.prototype = new Sprite("cloud.png");
Cloud.prototype.constructor = Cloud;

function cloudGen(){
	var cloudAmt = Math.floor((Math.random()*10)+10);
	console.log(cloudAmt);
	for(i=0;i<cloudAmt;i++){
		clouds[i] = new Cloud();
		clouds[i].x = Math.floor((Math.random()*(CAN_W+1))); 
		clouds[i].y = Math.floor((Math.random()*(CAN_H+100))-100);
	}
}
