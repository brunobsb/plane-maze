// <!-- Objeto My Game area - 01 -->

let myObstacles = [];
let myTherm = [];
let fuel = 120;
let timer = 0;
let backgroundImage = new Image();
let redBaron = new Image();
redBaron.src = "./Type_4/Biploar_type4_1.png";
let enemy = new Image();
enemy.src = "./Type_3/type_3.png";
let tanker = new Image();
tanker.src = "./Type-2/colored_2.png";
let final = new Image();
final.src = "./gameover.png";
let myGameArea = {

  canvas: document.createElement("canvas"),
  frames: 0,
  start: function () {
    this.canvas.width = 530;
    this.canvas.height = 605;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // call updateGameArea() every 20 milliseconds
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () { // Parte dos settings de colisão
    clearInterval(this.interval);
  },
  score: function () { // inicio do sistema de contagem de pontos
    this.fuel = Math.floor(this.fuel / 2);
    if(fuel <= 50){
      this.context.fillStyle = "red";
      this.context.font = "22px serif";
      this.context.fillText("Fuel Gauge: " + fuel, 50, 50); 
      this.context.font = "18px serif";
      // this.context.fillStyle = "black";
      // this.context.fillText("Time Elapsed: " + fuel, 350, 50);  // For version 1.2
    } else {
    this.context.font = "18px serif";
    this.context.fillStyle = "black";
    this.context.fillText("Fuel Gauge: " + fuel, 50, 50); 
    // this.context.fillText("Time Elapsed: " + fuel, 350, 50);
    }
    // timeElapsed: function () { // inicio do sistema de contagem de pontos
    //   this.timer = Math.floor(this.timer);
    //   this.context.font = "18px serif";
    //   this.context.fillStyle = "black";
    //   this.context.fillText("Time Elapsed: " + fuel, 350, 50);
    //   }
  },
   // final desta parte da contagem de pontos

};







// <!-- Component Class - 02
// create components,
// for our player element, and for the obstacles -->
class Component {
  constructor(width, height, color, x, y) { // Colocando as propriedades do canvas no construtor.
    this.width = width;
    this.height = height;
    this.color = color; // !!! Procurar entender o pq do this. no construtor !!!
    this.x = x;
    this.y = y;

    // new speed properties
    this.speedX = 0;
    this.speedY = 0;
  }

  update(image) {
    let ctx = myGameArea.context; // Armazenando o context 2d do canvas em ctx???
    
      ctx.drawImage(image, this.x, this.y, this.width, this.height );
   

   // ctx.fillStyle = this.color; // Colocando a cor armazenada no constructor no fillStyle? fillStyle???
    //ctx.fillRect(this.x, this.y, this.width, this.height); // Usando as variáveis do contructor para criar o retangulo com os valores do canvas.
    
  }

  newPos() { // Inicio de parte dos settings de colisão
    this.x += this.speedX;
    this.y += this.speedY;
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  } // Final de parte dos settings de colisão
  passWith(therm) {
    return !(
      this.bottom() < therm.top() ||
      this.top() > therm.bottom() ||
      this.right() < therm.left() ||
      this.left() > therm.right()
    );

  }
}





//  Criando o elemento player chamando - 03
// na classe componente e guardando na variável.     

let player = new Component(35, 35, "red", 240, 550);
//let gameOver = new Component(600, 480, "magenta", 600, 480);

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      if (player.y > 0) {
        player.speedY -= 1.5;
      } else {
        player.y = 0;
        player.speedY = 0;
      }
      break;
    case 40: // down arrow
      if (player.y + 30 < myGameArea.canvas.height) {
        player.speedY += 1.5;
      } else {
        player.y = 570;
        player.speedY = 0;
      }
      break;
    case 37: // left arrow
      if (player.x > 0) {
        player.speedX -= 1.5;
      } else {
        player.x = 0;
        player.speedX = 0;
      }
      break;
    case 39: // right arrow
      if (player.x + 30 < myGameArea.canvas.width) {
        player.speedX += 1.5;
      } else {
        player.x = 495;
        player.speedX = 0;
      }

      break;
  }
};

document.onkeyup = function (e) {
  player.speedX = 0;
  player.speedY = 0;
};

// funtion timer(){
//   let chrono = new Date();
//   let chronoStorage = chrono.getHours() + ":" + chrono.getMinutes() + ":" + chrono.getSeconds();
//   document.getElementById("timer").innerHTML = chronoStorage;
//   timer();
//   console.log(timer(chronoStorage));
//   console.log(chronoStorage);
// }

function gameover(){
let ctx = myGameArea.context;
final.src = "./gameover.png";
ctx.drawImage(final, 100, 100, 330, 300);
}

function fundo(){
  let ctx = myGameArea.context;
  backgroundImage.src = "./background.png";
  ctx.drawImage(backgroundImage, 0, 0);  
}

function updateGameArea() {
  myGameArea.clear();
  fundo();
  // update the player's position before drawing
  player.newPos();
  player.update(redBaron);
  
  
  // update the obstacles array
  updateObstacles();

  // check if the game should stop
  checkGameOver(); // Final dos settings de colisão
  // update and draw the score
  myGameArea.score(); // Final do sistema de contagem de pontos
}

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].y += 1;
    myObstacles[i].update(enemy);
  }
  for (t = 1; t < myTherm.length; t += 2) {
    myTherm[t].y += 1;
    myTherm[t].update(tanker);
  }
  myGameArea.frames += 4;
  if (myGameArea.frames % 120 === 0) {
    let minWidth = 20;
    let maxWidth = 500;
    let random = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth)
    let width = 35;
    myObstacles.push(new Component(width, 25, "green", random, 0));
    setTimeout(function(){ myTherm.push(new Component(width, 35, "blue", random, 0));}, 3000)
    
  }
}


function fuelUse() {
  console.log(myGameArea.frames)
fuel -= 5;
if(myGameArea.frames > 3000){
  fuel -= 15;
  console.log(fuel)
}
document.getElementsByName(this.fuel).innerHTML = fuel;

}
setInterval('fuelUse()', 1200);

function checkGameOver() {

  let crashed = myObstacles.some(function (obstacle) {
    return player.crashWith(obstacle);
  });
  let passWith = myTherm.some(function (therm) {
    return player.passWith(therm);
  });
  if (passWith) {
    fuel += 2;
  } else if (fuel <= 0) {
    fuel = 0;
    gameover();
    myGameArea.stop();
    
  } else if (crashed) {
    gameover();
    myGameArea.stop();
 
  }
  
}
 let startTimes = false; 

const btnStart = () => {
  if(startTimes == false){
    startTimes = true;
    myGameArea.start();
  }
  


}



