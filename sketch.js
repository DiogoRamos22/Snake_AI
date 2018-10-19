var snakeArray = new Array();
var scl = 10;
var widthCanvas = 600;
var heightCanvas = 600;
var maxScore = 0;

function setup() {
  createCanvas(widthCanvas, heightCanvas);
  frameRate(59);
  for (var q = 0; q < 1; q++) {
    snakeArray.push(new snake(300, 300));
  }
  for (let i = 0; i < snakeArray.length; i++) {
    snakeArray[i].createFood();
    fill(153, 31, 0)
    rect(snakeArray[i].food.x, snakeArray[i].food.y, scl, scl);
  }
}
function updateSnake() {
  for (var i = 0; i < snakeArray.length; i++) {
    snakeArray[i].death();
    snakeArray[i].update();
    snakeArray[i].show();
    if(snakeArray[i].eat(snakeArray[i].food)) {
      snakeArray[i].createFood();
    }
    fill(153, 31, 0)
    rect(snakeArray[i].food.x, snakeArray[i].food.y, scl, scl);
    snakeArray[i].nextdir();
  }
  if(maxScore<snakeArray[0].total){
    maxScore = snakeArray[0].total
  }
}

function draw() {
  background(26, 26, 26);
  fill(77, 77, 77);
  rect(10,10,580,580);
  updateSnake();
  document.getElementById("score").innerHTML = snakeArray[0].total
  document.getElementById("maxScore").innerHTML = maxScore
  document.getElementById("deaths").innerHTML = snakeArray[0].deathCount
}

