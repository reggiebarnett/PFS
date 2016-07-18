//Main game file

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var DIVER_START_X = 90;
var DIVER_START_Y = 100;
var INIT_HEIGHT = 5000; //initial height for testing
var LOW_LIMIT = 2000;
var diver = new player("red");
var ht = new heightTracker();
var speedUp;
var slowDown;
var glideLeft;
var glideRight;
var DIVE_ACCEL = 3;

//Controls
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(e){
	//freefall controls
		//TODO: disable once parachute deploys, WIP
	if(e.keyCode == 38 || e.keyCode == 87){ //up arrow or w
		if(ht.height > LOW_LIMIT){
			slowDown = true;
		}
	} 
	else if(e.keyCode == 40 || e.keyCode == 83){ //down arrow or s
		if(ht.height > LOW_LIMIT){
			speedUp = true;
		}

	} 
	//parachute controls
		//TODO: enable once parachute deploys, WIP
	else if(e.keyCode == 37 || e.keyCode == 65){ //left arrow or a
		glideLeft = true;
	} 
	else if(e.keyCode == 39 || e.keyCode == 68){ //right arrow or d
		glideRight = true;
	} 
}

function keyUpHandler(e){
	//freefall controls
		//TODO: disable once parachute deploys, WIP
	if(e.keyCode == 38 || e.keyCode == 87){ //up arrow or w
		slowDown = false;
		//Prevent resetting after passing LOW_LIMIT
		if(ht.height > LOW_LIMIT){
			diving_actions("return");
		}
	} 
	else if(e.keyCode == 40 || e.keyCode == 83){ //down arrow or s
		speedUp = false;
		//Prevent resetting after passing LOW_LIMIT
		if(ht.height > LOW_LIMIT){
			diving_actions("return");
		}

	} 
	//parachute controls
		//TODO: enable once parachute deploys, WIP
	else if(e.keyCode == 37 || e.keyCode == 65){ //left arrow or a
		glideLeft = false;
	} 
	else if(e.keyCode == 39 || e.keyCode == 68){ //right arrow or d
		glideRight = false;
	} 
}

//calculating movements for slowing down and speeding up
function diving_actions(action) {
	if(action === "slow"){
		//X pos
		diver.x = 150;
		//Y pos
		diver.y = 70;
	}
	else if(action === "speed"){
		//X pos
		diver.x = 120;
		//Y pos
		diver.y = 160;
	}
	else if(action === "return"){
		//return to original position
		diver.x = DIVER_START_X;
		diver.y = DIVER_START_Y;
	}
}




//initialize character and update
function player(color){
	//TODO: replace width,height, ctx fill stuff with diver image
	this.width = 30;
	this.height = 30;
	this.x = DIVER_START_X; 
	this.y = DIVER_START_Y;
	ctx.fillStyle = color;
	ctx.fillRect(this.x,this.y, this.width,this.height);
	this.update = function(){
		//can only speed up slow down above LOW_LIMIT
		if(speedUp){
			//temp fix until I figure out better way to prevent holding down buttons
			if(ht.height <= LOW_LIMIT){
				diving_actions("return");
			}
			if(ht.height > LOW_LIMIT){
				diving_actions("speed");
			}
		}
		else if(slowDown){
			//temp fix until I figure out better way to prevent holding down buttons
			if(ht.height <= LOW_LIMIT){
				diving_actions("return");
			}
			if(ht.height > LOW_LIMIT){
				diving_actions("slow");
			}
		}
		//can only glide at or below LOW_LIMIT
		else if(glideLeft && ht.height <= LOW_LIMIT){
			this.x -= 2;
		}
		else if(glideRight && ht.height <= LOW_LIMIT){
			this.x += 2;
		}
		ctx.fillStyle = color;
		ctx.fillRect(this.x,this.y, this.width,this.height);
	}
}

//Keeps track of height 
function heightTracker(){
	this.height = INIT_HEIGHT;
	this.x = 650;
	this.y = 30;
	this.update = function(){
		//this.height -= 10; //for testing purposes
		if(this.height <= 0){
			this.height = 0;
		}
		ctx.font = "30px Shitballs"
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


