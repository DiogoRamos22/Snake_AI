//creates the neural network 8 inputs 32 hidden layers and 3 outputs each output means left foward or right and its given in move strenght/probability
//if the snake head encounters a wall then there should be a 50% 50% chance of moving left or right unless there is an apple in that dir then it should move to the apple
//objectives: replace the target function thats used to train the network given the input with a reward system or with reinforcement learning
//so everything would start random and as the snake dies the strenght of each move is adjusted
var bool = true;
const model = tf.sequential();
const hidden = tf.layers.dense({
  units:66,
  inputShape: [11],
  activation: 'sigmoid'
});
const output = tf.layers.dense({
  units:3,
  activation: 'sigmoid'
});
model.add(hidden);
model.add(output);

const opt = tf.train.adam(0.05);

model.compile({
  optimizer: opt,
  loss: 'meanSquaredError'
})
//trains the NN given the inputs of the current action and the target it should aim for
async function train(trainDataxs, trainDatays) {
      response = await model.fit(trainDataxs, trainDatays);
      //console.log("Loss: " + response.history.loss[0])
}
//checks if both arrays are equal element by element
function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length)
      return false;
  for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
          return false;
  }
  return true;
}
//checks if the food is on the diagonal of the snake head y=x
function diag(x,y,xfood,yfood,q){
  //q stands for quadrant
  var binary = 0;
  if(q==1){
    var slope = (yfood - y)/(xfood-x);
    if(x<xfood&&y>yfood&&slope==-1){binary=1;}
  }else if(q==2){
    var slope = (yfood - y)/(xfood-x);
    if(x>xfood&&y>yfood&&slope==1){binary=1;}
  }else if(q==3){
    var slope = (yfood - y)/(xfood-x);
    if(x>xfood&&y<yfood&&slope==-1){binary=1;}
  }else if(q==4){
    var slope = (yfood - y)/(xfood-x);
    if(x<xfood&&y<yfood&&slope==1){binary=1;}
  }
  return binary;
}
//checks if the snake is able to move to the left right or foward and it doesnt come in contact with a body part
//1 means it can move in that direction
//0 means it CANT move in that direction
function obstacle(x,y,tail,dir){
  switch (dir){
    case "east":
      var snakeBodyLeft = 1;
      var snakeBodyFoward = 1;
      var snakeBodyRight = 1;
    for (let i = 0; i < tail.length; i++) {
      var pos = tail[i];
      var dleft = dist(x, y-10, pos.x, pos.y);
      var dfoward = dist(x+10, y, pos.x, pos.y);
      var dright = dist(x, y+10, pos.x, pos.y);
      if (dleft < 1){snakeBodyLeft = 0;}
      if (dfoward < 1){snakeBodyFoward = 0;}
      if (dright < 1){snakeBodyRight = 0;}
    }
    var snakeArray = [snakeBodyLeft,snakeBodyFoward,snakeBodyRight]
    return snakeArray;
    case "west":
      var snakeBodyLeft = 1;
      var snakeBodyFoward = 1;
      var snakeBodyRight = 1;
    for (let i = 0; i < tail.length; i++) {
      var pos = tail[i];
      var dleft = dist(x, y+10, pos.x, pos.y);
      var dfoward = dist(x-10, y, pos.x, pos.y);
      var dright = dist(x, y-10, pos.x, pos.y);
      if (dleft < 1){snakeBodyLeft = 0;}
      if (dfoward < 1){snakeBodyFoward = 0;}
      if (dright < 1){snakeBodyRight = 0;}
    }
    var snakeArray = [snakeBodyLeft,snakeBodyFoward,snakeBodyRight]
    return snakeArray;
    case "north":
      var snakeBodyLeft = 1;
      var snakeBodyFoward = 1;
      var snakeBodyRight = 1;
    for (let i = 0; i < tail.length; i++) {
      var pos = tail[i];
      var dleft = dist(x-10, y, pos.x, pos.y);
      var dfoward = dist(x, y-10, pos.x, pos.y);
      var dright = dist(x+10, y, pos.x, pos.y);
      if (dleft < 1){snakeBodyLeft = 0;}
      if (dfoward < 1){snakeBodyFoward = 0;}
      if (dright < 1){snakeBodyRight = 0;}
    }
    var snakeArray = [snakeBodyLeft,snakeBodyFoward,snakeBodyRight]
    return snakeArray;
    case "south":
    var snakeBodyLeft = 1;
      var snakeBodyFoward = 1;
      var snakeBodyRight = 1;
    for (let i = 0; i < tail.length; i++) {
      var pos = tail[i];
      var dleft = dist(x+10, y, pos.x, pos.y);
      var dfoward = dist(x, y+10, pos.x, pos.y);
      var dright = dist(x-10, y, pos.x, pos.y);
      if (dleft < 1){snakeBodyLeft = 0;}
      if (dfoward < 1){snakeBodyFoward = 0;}
      if (dright < 1){snakeBodyRight = 0;}
    }
    var snakeArray = [snakeBodyLeft,snakeBodyFoward,snakeBodyRight]
    return snakeArray;
  }
}
function toTensorTarget(arrayTarget, strenght){
  var tensorArrayTarget=[[0.3,0.3,0.3]];
  var appleFound=404;

  for (let i = 3; i < arrayTarget.length; i++) {
    if(arrayTarget[i]==1){
      appleFound = i;
      break;
    }
  }
  var a1 = arrayTarget[0].toString();
  var a2 = arrayTarget[1].toString();
  var a3 = arrayTarget[2].toString();
  var movesPossible= a1+a2+a3;
  //console.log(movesPossible);
  var apple = appleMove(appleFound);
  switch (movesPossible) {
    case "001":
      tensorArrayTarget = [[0, 0, 1]];
      break;
    case "100":
      tensorArrayTarget = [[1, 0, 0]];
      break;
    case "010":
      tensorArrayTarget = [[0, 1, 0]];
      break;
    case "111":
      tensorArrayTarget = [[0.3, 0.45, 0.3]];
      tensorArrayTarget = appleArray(apple, tensorArrayTarget);
      break;
    case "110":
      tensorArrayTarget = [[0.4, 0.6, 0]];
      tensorArrayTarget = appleArray(apple, tensorArrayTarget);
      break;
    case "011":
      tensorArrayTarget = [[0, 0.6, 0.4]];
      tensorArrayTarget = appleArray(apple, tensorArrayTarget);

      break;
    case "101":
      tensorArrayTarget = [[0.6, 0, 0.6]];
      tensorArrayTarget = appleArray(apple, tensorArrayTarget);
      break;

  }
  //console.log(tensorArrayTarget)
  return tensorArrayTarget;
}
//var toTestArray = [canMoveLeft,canMoveForward,canMoveRight,isFoodLeft,isFoodLeftFoward,isFoodForward,isFoodRightFoward,isFoodRight,isFoodBackward,isFoodLeftBackward,isFoodRightBackward];
function appleMove(applexy){
  if(applexy==3||applexy==9){
    return 0;
  }else if(applexy==4||applexy==5||applexy==6){
    return 1;
  }else if(applexy==7||applexy==10){
    return 2;
  }else if(applexy==8){
    return 3;
  }else{
    return 404;
  }
}
function appleArray(x, arrayA){
  if(x==0&&arrayA[0][0]!==0){
    return [[1, 0, 0]];
  }else if(x==1&&arrayA[0][1]!==0){
    return [[0, 1, 0]];
  }else if(x==2&&arrayA[0][2]!==0){
    return [[0, 0, 1]];
  }else if(x==3&&arrayA[0][0]!==0&&arrayA[0][2]!==0){
    return [[0.5, 0 ,0.5]];
  }else if(x==3&&arrayA[0][0]!==0){
    return [[1, 0, 0]];
  }else if (x==3&&arrayA[0][2]!==0) {
    return [[0, 0, 1]];
  }else if(x==404){
    return arrayA;
  }else{
    return arrayA;
  }
}
function snake(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];
    this.food;
    this.deathCount = 0;
    //creates the food on the screen red square
    this.createFood = function() {
      var cols = floor(widthCanvas/scl);
      var rows = floor(heightCanvas/scl);
      var appleCols = floor(random(cols));
      var appleRows = floor(random(rows));
      if(appleCols==0){
        appleCols = 1;
      }else if (appleCols==59) {
        appleCols = 58;
      }
      if(appleRows==0){
        appleRows = 1;
      }else if (appleRows==59) {
        appleRows = 58;
      }
      this.food = createVector(appleCols, appleRows);
      this.food.mult(scl);
    }
    //checks if the head of the snake is on the food if it is returns true spawning another apple
    this.eat = function(pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if(d < 1){
            this.total++;
            return true;
        }else {
            return false;
        }
    }
    this.death = function() {
      //checks if the snake came in contact with its own body part if it did it resets everything
        for (let i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1){
                this.total = 0;
                this.tail = [];
                this.x = 300;
                this.y = 300;
                this.xspeed = 1;
                this.yspeed = 0;
                this.createFood();
                this.deathCount++;
            }
        }
        //checks if it touched a wall
        if(this.x==590 || this.x==0 || this.y==590 || this.y==0){
          this.total = 0;
          this.tail = [];
          this.x = 300;
          this.y = 300;
          this.xspeed = 1;
          this.yspeed = 0;
          this.createFood();
          this.deathCount++;
        }
    }
    this.update = function() {
    //moves the snake tail
        if(this.total === this.tail.length) {
            for (let i = 0; i < this.tail.length-1; i++) {
                this.tail[i] = this.tail[i+1];
            }
        }
    this.tail[this.total-1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed*scl;
    this.y = this.y + this.yspeed*scl;
    //doesnt let the snake move outside of the boundaries
    this.x = constrain(this.x, 0, width-scl);
    this.y = constrain(this.y, 0, height-scl);
    }
    //draws the snake tail
    this.show = function() {
        fill(255);
        for (let i = 0; i < this.tail.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        rect(this.x, this.y, scl, scl);
    }
    this.nextdir = function() {
      //console.log("x: " + this.x + "    y: " + this.y)
      //snake sensors
      let canMoveForward = 0;
      let canMoveLeft = 0;
      let canMoveRight = 0;
      let isFoodForward = 0;
      let isFoodLeft = 0;
      let isFoodRight = 0;
      let isFoodBackward = 0;
      let isFoodLeftFoward = 0;
      let isFoodRightFoward = 0;
      let isFoodLeftBackward = 0;
      let isFoodRightBackward = 0;
      //defines the orientation of the snake
      if(this.xspeed==1){
        var ori = "east";
      }else if(this.xspeed==-1){
        var ori = "west";
      }else if(this.yspeed==-1){
        var ori = "north";
      }else if(this.yspeed==1){
        var ori = "south";
      }
      //defines the next dir based on the orientation of the snake
      //1 means it can move in the direction
      //0 means it shouldnt move in the direction
      //later these inputs will be translated into targets for the NN
      switch (ori) {
        case "east":
        //checks for walls
          if(this.x!==580){canMoveForward=1};
          if(this.y!==10){canMoveLeft=1};
          if(this.y!==580){canMoveRight=1};
        //checks again for the snake body
        var bodyResult = obstacle(this.x, this.y, this.tail,"east")
          if(canMoveLeft==1){canMoveLeft=bodyResult[0]};
          if(canMoveForward==1){canMoveForward=bodyResult[1]};
          if(canMoveRight==1){canMoveRight=bodyResult[2]};
        //checks of the is the food in a 180º radius (kinda) -|/\
          if(this.x==this.food.x){
            if(this.y>this.food.y){ 
              isFoodLeft=1;
            }else if(this.y<this.food.y){
              isFoodRight=1;
            }
          }
          if(this.y==this.food.y&&this.x<this.food.x){isFoodForward=1};
          if(this.y==this.food.y&&this.x>this.food.x){isFoodBackward=1};
          isFoodLeftFoward = diag(this.x,this.y,this.food.x,this.food.y,1);
          isFoodRightFoward = diag(this.x,this.y,this.food.x,this.food.y,4);
          isFoodLeftBackward = diag(this.x,this.y,this.food.x,this.food.y,2);
          isFoodRightBackward = diag(this.x,this.y,this.food.x,this.food.y,3);
          break;
        case "west":
          if(this.x!==10){canMoveForward=1};
          if(this.y!==580){canMoveLeft=1};
          if(this.y!==10){canMoveRight=1};
          var bodyResult = obstacle(this.x, this.y, this.tail,"west")
          if(canMoveLeft==1){canMoveLeft=bodyResult[0]};
          if(canMoveForward==1){canMoveForward=bodyResult[1]};
          if(canMoveRight==1){canMoveRight=bodyResult[2]};
          if(this.x==this.food.x){
            if(this.y>this.food.y){ 
              isFoodRight=1;
            }else if(this.y<this.food.y){
              isFoodLeft=1;
            }
          }
          if(this.y==this.food.y&&this.x>this.food.x){isFoodForward=1};
          if(this.y==this.food.y&&this.x<this.food.x){isFoodBackward=1};
          isFoodLeftFoward = diag(this.x,this.y,this.food.x,this.food.y,3);
          isFoodRightFoward = diag(this.x,this.y,this.food.x,this.food.y,2);
          isFoodLeftBackward = diag(this.x,this.y,this.food.x,this.food.y,4);
          isFoodRightBackward = diag(this.x,this.y,this.food.x,this.food.y,1);
          break;
        case "north":
          if(this.y!==10){canMoveForward=1};
          if(this.x!==10){canMoveLeft=1};
          if(this.x!==580){canMoveRight=1};
          var bodyResult = obstacle(this.x, this.y, this.tail,"north")
          if(canMoveLeft==1){canMoveLeft=bodyResult[0]};
          if(canMoveForward==1){canMoveForward=bodyResult[1]};
          if(canMoveRight==1){canMoveRight=bodyResult[2]};
          if(this.y==this.food.y){
            if(this.x>this.food.x){
              isFoodLeft=1;
            }else if(this.x<this.food.x){
              isFoodRight=1;
            }
          }
          if(this.x==this.food.x&&this.y>this.food.y){isFoodForward=1};
          if(this.x==this.food.x&&this.y<this.food.y){isFoodBackward=1}
          isFoodLeftFoward = diag(this.x,this.y,this.food.x,this.food.y,2);
          isFoodRightFoward = diag(this.x,this.y,this.food.x,this.food.y,1);
          isFoodLeftBackward = diag(this.x,this.y,this.food.x,this.food.y,3);
          isFoodRightBackward = diag(this.x,this.y,this.food.x,this.food.y,4);
          break;
        case "south":
          if(this.y!==580){canMoveForward=1};
          if(this.x!==580){canMoveLeft=1};
          if(this.x!==10){canMoveRight=1};
          var bodyResult = obstacle(this.x, this.y, this.tail,"south")
          if(canMoveLeft==1){canMoveLeft=bodyResult[0]};
          if(canMoveForward==1){canMoveForward=bodyResult[1]};
          if(canMoveRight==1){canMoveRight=bodyResult[2]};
          if(this.y==this.food.y){
            if(this.x>this.food.x){
              isFoodRight=1;
            }else if(this.x<this.food.x){
              isFoodLeft=1;
            }
          }
          if(this.x==this.food.x&&this.y<this.food.y){isFoodForward=1};
          if(this.x==this.food.x&&this.y>this.food.y){isFoodBackward=1};
          isFoodLeftFoward = diag(this.x,this.y,this.food.x,this.food.y,4);
          isFoodRightFoward = diag(this.x,this.y,this.food.x,this.food.y,3);
          isFoodLeftBackward = diag(this.x,this.y,this.food.x,this.food.y,1);
          isFoodRightBackward = diag(this.x,this.y,this.food.x,this.food.y,2);
          break;
      }
      /*
      //shows where the food is with the vision
      if(isFoodForward==1||isFoodLeft==1||isFoodLeftFoward==1||isFoodRight==1||isFoodRightFoward==1||isFoodBackward==1||isFoodLeftBackward==1||isFoodRightBackward==1){
        console.log("in front: " + isFoodForward);
        console.log("left: " + isFoodLeft);
        console.log("right: " + isFoodRight);
        console.log("left diag: " + isFoodLeftFoward);
        console.log("right diag: " + isFoodRightFoward);
        console.log("back: " + isFoodBackward)
        console.log("left diag back: " + isFoodLeftBackward);
        console.log("right diag back: " + isFoodRightBackward);
        console.log("----------------")
      }
      */
     //array used to compare with the arrays below to get the target prediction based on the output of the possible moves
      //array used to make the tensor 1x8
      var canArray = [[canMoveLeft,canMoveForward,canMoveRight,isFoodLeft,isFoodLeftFoward,isFoodForward,isFoodRightFoward,isFoodRight,isFoodBackward,isFoodLeftBackward,isFoodRightBackward]];
      //creates the tensor
      let tensorAction = tf.tensor2d(canArray);
      let strenght = model.predict(tensorAction).dataSync();
      //console.log(strenght);
      //make the target tensor

      if(bool){
    var toTestArray = [canMoveLeft,canMoveForward,canMoveRight,isFoodLeft,isFoodLeftFoward,isFoodForward,isFoodRightFoward,isFoodRight,isFoodBackward,isFoodLeftBackward,isFoodRightBackward];
    var tempArrayTensor = toTensorTarget(toTestArray, strenght);
   
    var tensorTarget = tf.tensor2d(tempArrayTensor);

    train(tensorAction, tensorTarget).then(() => {
    tensorAction.dispose();
    tensorTarget.dispose();
  })
}
      //compares the strenght of each move and decides where to move
      if(strenght[1]>strenght[2]&&strenght[1]>strenght[0]){
        var nextMove="foward";
      }else if(strenght[2]>strenght[1]&&strenght[2]>strenght[0]){
        var nextMove="right";
      }else if(strenght[0]>strenght[1]&&strenght[0]&&strenght[2]){
        var nextMove="left"
      } 
      //after training is complete cleans up the tensors used to make the train
      //leaving only the tensor of the action took
      //makes the next move
      switch (nextMove){
      case "left":
        //left
          switch (ori) {
            case "east":
            this.xspeed = 0;
            this.yspeed = -1;
            ori = "north";
            break;
          case "west":
            this.xspeed = 0;
            this.yspeed = 1;
            ori = "south";
            break;
          case "north":
            this.xspeed = -1;
            this.yspeed = 0;
            ori = "west";
            break;
          case "south":
            this.xspeed = 1;
            this.yspeed = 0;
            ori = "east";
            break;
          }
        break;
      case "foward":
          //foward
          switch (ori) {
            case "east":
            this.xspeed = 1;
            this.yspeed = 0;
            break;
          case "west":
            this.xspeed = -1;
            this.yspeed = 0;
            break;
          case "north":
            this.xspeed = 0;
            this.yspeed = -1;
            break;
          case "south":
            this.xspeed = 0;
            this.yspeed = 1;
            break;
          }
        break;
      case "right":
          //right
          switch (ori) {
            case "east":
            this.xspeed = 0;
            this.yspeed = 1;
            ori = "south";
            break;
          case "west":
            this.xspeed = 0;
            this.yspeed = -1;
            ori = "north";
            break;
          case "north":
            this.xspeed = 1;
            this.yspeed = 0;
            ori = "east";
            break;
          case "south":
            this.xspeed = -1;
            this.yspeed = 0;
            ori = "west";
            break;
          }
        break;
      }
      //memory is keeping the tensor thats made from the move
      //console.log(tf.memory().numTensors)
      //shows the position every move of the snake
      //console.log("x: " + this.x + "   y: " + this.y)
    }    
  }