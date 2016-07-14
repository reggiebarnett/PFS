//Main game file

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var diver = new player("red");
var INIT_HEIGHT = 10000; //initial height for testing
var ht = new heightTracker();
var speedUp;
var slowDown;
var glideLeft;
var glideRight;

//Controls
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler,false);

function keyDownHandler(e){
	//freefall controls
		//TODO: disable once parachute deploys
	if(e.keyCode == 38 || e.keyCode == 87){ //up arrow or w
		slowDown = true;
	} 
	else if(e.keyCode == 40 || e.keyCode == 83){ //down arrow or s
		speedUp = true;
	} 
	//parachute controls
		//TODO: enable once parachute deploys
	else if(e.keyCode == 37 || e.keyCode == 65){ //left arrow or a
		glideLeft = true;
	} 
	else if(e.keyCode == 39 || e.keyCode == 68){ //right arrow or d
		glideRight = true;
	} 
}

function keyUpHandler(e){
	//freefall controls
		//TODO: disable once parachute deploys
	if(e.keyCode == 38 || e.keyCode == 87){ //up arrow or w
		slowDown = false;
	} 
	else if(e.keyCode == 40 || e.keyCode == 83){ //down arrow or s
		speedUp = false;
	} 
	//parachute controls
		//TODO: enable once parachute deploys
	else if(e.keyCode == 37 || e.keyCode == 65){ //left arrow or a
		glideLeft = false;
	} 
	else if(e.keyCode == 39 || e.keyCode == 68){ //right arrow or d
		glideRight = false;
	} 
}





//initialize character and update
function player(color){
	//TODO: replace width,height, ctx fill stuff with diver image
	this.width = 30;
	this.height = 30;
	this.x = 90; 
	this.y = 100;
	this.update = function(){
		//can only speed up slow down above 2000 ft
		if(speedUp && ht.height > 2000){
			this.y += 2;
		}
		else if(slowDown && ht.height > 2000){
			this.y -= 2;
		}
		//can only glide at or below 2000 ft
		else if(glideLeft && ht.height <= 2000){
			this.x -= 2;
		}
		else if(glideRight && ht.height <= 2000){
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


