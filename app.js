let canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

window.addEventListener('keydown', moveGoat, false);

let bigRedButton = document.getElementById('bigRedButton');
bigRedButton.addEventListener('click', turnGravityOff);

let gravity = true;

let staticGoatsArr =[];
let goat;

let audio = new Audio('/assets/goatscream.mp3');
let goatsBleating = new Audio('/assets/goatsbleating.mp3');

// const colors = ['#4deeea', '#74ee15', '#ffe700', '#f000ff', '#001eff', '#ff0303', '#8400ff', '#00fff6', '#0028ff', '#00ff28', '#ffa300', '#cf0060', '#ff00ff', '#13a8fe', '#4e87a4', '#b0d5ce', '#fff1e4', '#fa86ab', '#ee2889','#7b297d', '#e87888', '#eae8e5', '#b1185a','#c351a2', '#efa9df', '#f3cff1']

// let goatsArray = [];

// branches
// ctx.beginPath();
// ctx.moveTo(200,300);
// ctx.lineTo(400,300);
// ctx.strokeStyle = 'brown';
// ctx.lineWidth = 5;
// ctx.stroke();

// ctx.beginPath();
// ctx.moveTo(500,400);
// ctx.lineTo(700,400);
// ctx.strokeStyle = 'brown';
// ctx.lineWidth = 5;
// ctx.stroke();

// ctx.beginPath();
// ctx.moveTo(100,500);
// ctx.lineTo(300,500);
// ctx.strokeStyle = 'brown';
// ctx.lineWidth = 5;
// ctx.stroke();

// ctx.beginPath();
// ctx.moveTo(600,600);
// ctx.lineTo(800,600);
// ctx.strokeStyle = 'brown';
// ctx.lineWidth = 5;
// ctx.stroke();

// ctx.beginPath();
// ctx.moveTo(50,700);
// ctx.lineTo(250,700);
// ctx.strokeStyle = 'brown';
// ctx.lineWidth = 5;
// ctx.stroke();

// pairs of x,y coordinates, function that generates the branches and also defines the areas where the goat stops

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
  console.log('running random INt');
}

function randomFloatFromRange(min, max) {
    return Math.random() * (max - min + 1) + min
}

let goatWidth = 100;
let startingX;
let startingY = -50;

function generateGoatStartingCoords(min, max){
  startingX = randomIntFromRange(0 + goatWidth, canvas.width - goatWidth);
  console.log('starting X', startingX);
}

let splodeCounter = 0;

let splodeImg = new Image(100,100);
splodeImg.src = '/assets/goatsplode.png';
canvas.appendChild(splodeImg);

let splode;
let displaySplode = false;
console.log('display splode', displaySplode);

function Splode (x){
  console.log('running Splode');
  this.x = x;
  this.alpha = 0;
  this.da = 0.1;
  this.active = false;
  this.height = 100;
  this.width = 100;

  this.draw = function(){
    if (splodeCounter < 35) {
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(splodeImg, this.x, (canvas.height - 55), 100, 100);
    } else {
      displaySplode = false;
    }
  }

  this.update = function(){
    splodeCounter++;
    this.alpha += this.da;
    console.log('counter', splodeCounter);
    this.draw();
  }
}

let goatImg = new Image(100,100);
goatImg.src = '/assets/goat.png';
canvas.appendChild(goatImg);

let TO_RADIANS = Math.PI/180;
let degrees = 10;

function Goat (x, y, dx, dy, height, width) {
  console.log('running Goat');
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.height = height;
  this.width = width;
  this.dxgravity = randomFloatFromRange(-1.5,1.5);
  this.dygravity = -randomFloatFromRange(0.5,1);

  this.draw = function(){
    // console.log('drawing');
    // let goatX = this.x;
    // let goatY = this.y;
    // let goatH = 100;
    // let goatW = 100;

    ctx.globalAlpha = 1;
    if (gravity == false){
      ctx.save();
      ctx.translate((this.x + 50), (this.y + 50));
      ctx.rotate(degrees * TO_RADIANS);
      ctx.drawImage(goatImg, -50, -50, 100, 100);
      ctx.restore();
      degrees+=0.5;
    } else {
      ctx.drawImage(goatImg, this.x, this.y, this.height, this.width);
    }

    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // // ctx.fillStyle = 'black';
    // ctx.fillStyle=imgFill;
    // ctx.fill();
    // // ctx.strokeStyle = this.stroke
    // // ctx.lineWidth = 2
    // // ctx.stroke()
    // // ctx.shadowBlur = 20
    // // ctx.shadowColor = 'white'
    // // ctx.globalAlpha = 0.9
    // ctx.closePath();
  }

  this.update = function(){
    // console.log('updating');

    if(gravity == true){
      if(this.x < (600 + goatWidth) && this.x > (100 - goatWidth) && this.y > (300 - 5 - goatWidth - 3)){
        this.y = 300 - goatWidth - 3;
        if(staticGoatsArr.length < 5){
          staticGoatsArr.push(this);
          console.log('our static goats', staticGoatsArr.length);
          generateGoatStartingCoords();
          goat = new Goat (startingX, startingY, 0, 4, 100, 100);
        }
      } else {
        this.y += this.dy;
      }

      if(this.y - this.height > canvas.height){
        splode = new Splode(this.x, -10, 100, 100);
        splodeCounter = 0;
        displaySplode = true;

        // splode.active = true;
        // splode.draw();

        generateGoatStartingCoords();
        goat.x = startingX;
        goat.y = startingY;
        audio.play();
      }
    } else {
      this.x += this.dxgravity;
      this.y += this.dygravity;

    }

    this.draw();
  }
}

function moveGoat(e){
  switch(e.keyCode){
    case 39:
      console.log('move RIGHT, goat!');
      goat.x += 15;
      // goat.dy = 1;
      break;
    case 37:
      console.log('move LEFT, goat!!');
      goat.x -= 15;
      // goat.dy = 1;
      break;
    case 40:
      console.log('move down, goat!');
      goat.y += 15;
      break;
  }
  e.preventDefault();
}

function turnGravityOff(){
  if (gravity == true){
    gravity = false;
    audio.currentTime = 5;
    goatsBleating.play();

    setTimeout(function(){
      goatsBleating.pause();
    }, 6000);
  }
  // else {
  //   gravity = true;
  // }

  console.log('gravity ', gravity);

}

function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(100,300);
  ctx.lineTo(600,300);
  ctx.strokeStyle = 'brown';
  ctx.lineWidth = 5;
  ctx.stroke();

  for(var i = 0; i < staticGoatsArr.length; i++){
    if (gravity == true){
      staticGoatsArr[i].draw();
    } else {
      staticGoatsArr[i].update();
    }
  }

  goat.update();

  if (displaySplode == true){
    splode.update();
  }
}

generateGoatStartingCoords();
goat = new Goat (startingX, startingY, 0, 4, goatWidth, goatWidth);
console.log('static goats', staticGoatsArr.length);
animate();



