var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var gravity = 1;
var friction = 5;
var windX = 4;
var windY = 4;

canvas.width = 1200;
canvas.height = 800;


var ball;

init();
animate();
function init() {
    ball = new Ball(canvas.width / 2, canvas.height / 2, 2, 2, 30, 'red');
}
function Ball(x, y, xVelocity, yVelocity, radius, color) {
	this.x = x;
    this.y = y;
    this.yVelocity = yVelocity;
    this.xVelocity = xVelocity;
	this.radius = radius;
	this.color = color;

	this.update = function() {
        //balls hit top or bottom
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.yVelocity = -this.yVelocity;
            // this.yVelocity = -this.yVelocity + windY / 25;
        } 
        else {
            this.yVelocity = -windY / 25;
            // this.yVelocity = this.yVelocity - windY / 25;
        }
        //balls hit left or right
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.xVelocity = -this.xVelocity;
            // this.xVelocity = -this.xVelocity + windX / 25;
        } else {
            this.xVelocity = -windX / 25;
            // this.xVelocity = this.xVelocity - windX / 25;
        }
        this.x = this.x + this.xVelocity;
        this.y = this.y + this.yVelocity;
        
        this.draw();
	}
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	};
}

function animate() {
    
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ball.update();
}

canvas.mouseHandler = function(evt) {
    canvas.updateCursor(evt.clientX, evt.clientY);
    
    // flowBall();
}
canvas.touchHandler = function(evt) {
	evt.preventDefault();
	var touch = evt.touches[0];
	canvas.updateCursor(touch.clientX, touch.clientY);
}
canvas.updateCursor = function(x, y) {
	x = x / canvas.width;
	y = y / canvas.height;
	
    windX = (x - 0.5) * 50;
    windY = (y - 0.5) * 50;
}

document.addEventListener('mousemove', canvas.mouseHandler);
document.addEventListener('touchstart', canvas.touchHandler);
document.addEventListener('touchmove', canvas.touchHandler);

window.onload = function () {
    var socket = io.connect("http://24.16.255.56:8888");
  
    socket.on("load", function (data) {
        debugger;
        ball.x = data.data.x;
        ball.y = data.data.y;
        ball.yVelocity = data.data.yVelocity;
        ball.xVelocity = data.data.xVelocity;
        animate();
        console.log(data);
    });
  
    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");
  
    saveButton.onclick = function () {
      console.log("save");
      text.innerHTML = "Saved."
      socket.emit("save", { studentname: "Chinh Le", statename: "Ball's Postision", data: ball });
    };
  
    loadButton.onclick = function () {
      console.log("load");
      text.innerHTML = "Loaded."
      socket.emit("load", { studentname: "Chinh Le", statename: "Ball's Postision" });
    };
  
  };