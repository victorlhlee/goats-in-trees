
let startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame)

let bgMusic = document.getElementById('bgMusic');



function startGame() {
  bgMusic.play();
  gameOver = false;
  liveCounter = 0;
  points = 0;
  pointDiv.innerHTML = points;
  for (var i = 0; i < liveArr.length; i++) {
    liveArr[i].src = aliveGoat;
  }

  bigRedButton.classList.add('bigRedButton');
  setTimeout(function(){
      animate();
    }, 2500);
  document.getElementById('startDiv').style.display = 'none';
  document.getElementById('header').classList.remove('startHeader');
}

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

let branches = [
  {x1: 650, x2: 775, y: 150},
  {x1: 790, x2: 925, y: 250},
  {x1: 485, x2: 610, y: 375},
  {x1: 575, x2: 700, y: 525},
  {x1: 750, x2: 890, y: 425},
  {x1: 850, x2: 985, y: 575},
]

let goats = ['url("/assets/goats/cute-goat.png")', 'url("/assets/goats/cute-goat-1.png")', 'url("/assets/goats/cute-goat-2.png")', 'url("/assets/goats/cute-goat-3.png")',  'url("/assets/goats/cute-goat-4.png")',  'url("/assets/goats/cute-goat-5.png")', 'url("/assets/goats/cute-goat-6.png")', 'url("/assets/goats/cute-goat-7.png")', 'url("/assets/goats/cute-goat-8.png")']

let leftArrow = document.getElementById('leftSelect');
let rightArrow = document.getElementById('rightSelect');
let goatSelects = document.getElementsByClassName('goatImg');

for (let i=0; i<goatSelects.length; i++) {
  goatSelects[i].style.backgroundImage = goats[i];
  goatSelects[i].style.backgroundSize = 'contain';
  goatSelects[i].addEventListener('click', selectThisGoat);
}

leftArrow.addEventListener('click', selectLeft);
rightArrow.addEventListener('click', selectRight);

function selectLeft() {
  if (goatSelects[0].style.backgroundImage === goats[0]) {
    console.log('NO PREV PHOTO')
  } else {
    for (let i=0; i<goatSelects.length; i++){
      goatSelects[i].style.backgroundImage = goats[goats.indexOf(goatSelects[i].style.backgroundImage) - 1];
      if (goatSelects[i].style.border === '3px solid white') {
        goatSelects[i].style.border = 'none';
      }
    }
  }
}

function selectRight() {
  if (goatSelects[goatSelects.length-1].style.backgroundImage === goats[goats.length-1]) {
    console.log('NO NEXT PHOTO')
  } else {
    for (let i=0; i<goatSelects.length; i++){
      goatSelects[i].style.backgroundImage = goats[goats.indexOf(goatSelects[i].style.backgroundImage) + 1];
      if (goatSelects[i].style.border === '3px solid white') {
        goatSelects[i].style.border = 'none';
      }
    }
  }
}

let goatImg = new Image(100, 100);
goatImg.src = '/assets/goats/cute-goat.png';
canvas.appendChild(goatImg);

function selectThisGoat() {
  for (let i=0; i<goatSelects.length; i++) {
    if (goatSelects[i].style.border === '3px solid white') {
      goatSelects[i].style.border = 'none';
    }
  }
  this.style.border = '3px solid white'
  let chosenGoat = this.style.backgroundImage.split('');
  chosenGoat.pop();
  chosenGoat.pop();
  chosenGoat.shift();
  chosenGoat.shift();
  chosenGoat.shift();
  chosenGoat.shift();
  chosenGoat.shift();
  chosenGoat.join('')
  goatImg.src = chosenGoat.join('')
  console.log(chosenGoat.join(''))

}

// pairs of x,y coordinates, function that generates the branches and also defines the areas where the goat stops

let highScore = 0;
let points = 0;
let pointsPerGoat = 20;
let pointDiv = document.getElementById('points');

let previousScoreSpan = document.getElementById('previousScore');
let previousScoreContainer = document.getElementById('previousScoreContainer');

let liveCounter = 0;

let aliveGoat = '/assets/goat-green.png';
let deadGoat = '/assets/goat-red.png';

let live1 = document.getElementById('live1');
let live2 = document.getElementById('live2');
let live3 = document.getElementById('live3');

live1.src = aliveGoat;
live2.src = aliveGoat;
live3.src = aliveGoat;

let liveArr = [live1, live2, live3];

let gameOver = false;
let newGame = false;

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
  console.log('running random Int');
}

function randomFloatFromRange(min, max) {
    return Math.random() * (max - min + 1) + min
}

let goatWidth = 100;
let startingX;
let startingY = -50;

function generateGoatStartingCoords(min, max){
  startingX = randomIntFromRange(175 + goatWidth, canvas.width - goatWidth - 225);
  console.log('starting X', startingX);
}

let splodeCounter = 0;

let splodeImg = new Image(100, 100);
splodeImg.src = '/assets/goatsplode.png';
canvas.appendChild(splodeImg);

let splode;
let displaySplode = false;

function Splode (x){
  this.x = x;
  this.alpha = 0;
  this.da = 0.1;
  this.active = false;
  this.height = 150;
  this.width = 150;

  this.draw = function(){
    if (splodeCounter < 45) {
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(splodeImg, this.x - 45, (canvas.height - 70), 150, 150);
    } else {
      displaySplode = false;
    }
  }

  this.update = function(){
    splodeCounter++;
    this.alpha += this.da;
    this.draw();
  }
}


let branchImg = new Image(100, 100);
branchImg.src = '/assets/branch2.png';
canvas.appendChild(branchImg);


let TO_RADIANS = Math.PI/180;
let degrees = 10;

function Goat (x, y, dx, dy, height, width) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.height = height;
  this.width = width;
  this.dxgravity = randomFloatFromRange(-1.5,1.5);
  this.dygravity = -randomFloatFromRange(0.5,1);

  this.draw = function(){

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
  }

  this.update = function(){
    let newdy = this.dy;

    let hit = branches.filter(goat => (this.x + goatWidth/4) < (goat.x2) && (this.x + goatWidth/2) > (goat.x1) && this.y >  (goat.y-goatWidth) && this.y < (goat.y+16))
    if(gravity == true){
      if(hit.length > 0){
        this.y = hit[0].y - goatWidth;
          staticGoatsArr.push(this);
          // console.log('our static goats', staticGoatsArr.length);
          generateGoatStartingCoords();
          if (staticGoatsArr.length % 5 === 0) {
            if(this.dy === newdy) {
              newdy = this.dy * 1.25;
            } else {
              newdy *= 1.25;
            }
            goat = new Goat (startingX, startingY, 0, newdy, 100, 100);
          } else {
            goat = new Goat (startingX, startingY, 0, newdy, 100, 100);
          }
          points += pointsPerGoat;
          pointDiv.innerHTML = points;

      } else {
        this.y += this.dy;
      }

      if(this.y - this.height > canvas.height){
        splode = new Splode(this.x, 0, 100, 100);
        splodeCounter = 0;
        displaySplode = true;

        generateGoatStartingCoords();

        goat = new Goat (startingX, startingY, 0, newdy, 100, 100);
        goat.x = startingX;
        goat.y = startingY;
        audio.play();
        if (liveCounter < 3){
          liveCounter ++;
          liveArr[liveCounter-1].src = deadGoat;
        }
        if (liveCounter === 3) {
          gameOver = true;
          newGame = true;
          staticGoatsArr = [];
          liveCounter = 0;
          goat = new Goat (startingX, startingY, 0, 4, 100, 100);
          bgMusic.pause();
          live1.src = aliveGoat;
          live2.src = aliveGoat;
          live3.src = aliveGoat;
          stopAnimation();
        }
      }
    } else {
      this.x += this.dxgravity;
      this.y += this.dygravity;
    }
    this.draw();
    console.timeEnd("Start of Update");
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
    bigRedButton.classList.add('disabledButton');
    audio.currentTime = 5;
    goatsBleating.play();

    setTimeout(function(){
      gravity = true;
      goatsBleating.pause();
      gameOver = true;
      bgMusic.pause();
      newGame = true;
      staticGoatsArr = [];
      liveCounter = 0;
      goat = new Goat (startingX, startingY, 0, 4, 100, 100);
      live1.src = aliveGoat;
      live2.src = aliveGoat;
      live3.src = aliveGoat;
      stopAnimation();
    }, 6000);
  }
}

var requestId = "";

function stopAnimation(e) {
  console.log("request ID", requestId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(requestId);
  document.getElementById('header').classList.add('startHeader');
  bigRedButton.classList.remove('bigRedButton');
  bigRedButton.classList.remove('disabledButton');
  previousScoreSpan.innerHTML = points;
  previousScoreContainer.classList.remove('scoreSummaryHidden');
  document.getElementById('startDiv').style.display = 'flex';
  if (points > highScore) {
    highScore = points;
    document.getElementById('highScore').innerHTML = highScore;
  }
  points = 0;
  document.getElementById('points').innerHTML = 0;
}

function animate(){
  // requestAnimationFrame(animate);
  requestId = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i=0; i<branches.length; i++) {
    ctx.globalAlpha = 1;

    ctx.drawImage(branchImg, branches[i].x1, branches[i].y - 40, 150, 50)
  }

  for(var i = 0; i < staticGoatsArr.length; i++){
    if (gravity == true){
      staticGoatsArr[i].draw();
    } else {
      staticGoatsArr[i].update();
    }
  }

  if(!gameOver) {
    goat.update();
  }

  if (displaySplode == true){
    splode.update();
  }
}

generateGoatStartingCoords();
goat = new Goat (startingX, startingY, 0, 4, goatWidth, goatWidth);
console.log('static goats', staticGoatsArr.length);
// animate();


