// <!-- Objeto My Game area - 01 -->

let myObstacles = [];
let myTherm = [];
let fuel = 100;

let myGameArea = {

  canvas: document.createElement("canvas"),
  frames: 0,
  start: function () {
    this.canvas.width = 600;
    this.canvas.height = 480;
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
    this.context.font = "18px serif";
    this.context.fillStyle = "black";
    this.context.fillText("Flight time: " + fuel, 350, 50);

  }, // final desta parte da contagem de pontos

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

  update() {
    let ctx = myGameArea.context; // Armazenando o context 2d do canvas em ctx???
    ctx.fillStyle = this.color; // Colocando a cor armazenada no constructor no fillStyle? fillStyle???
    ctx.fillRect(this.x, this.y, this.width, this.height); // Usando as variáveis do contructor para criar o retangulo com os valores do canvas.
    
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

let player = new Component(30, 30, "red", 200, 200);
//let gameOver = new Component(600, 480, "magenta", 600, 480);

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 38: // up arrow
      if (player.y > 0) {
        player.speedY -= 1;
      } else {
        player.y = 0;
        player.speedY = 0;
      }
      break;
    case 40: // down arrow
      if (player.y + 30 < myGameArea.canvas.height) {
        player.speedY += 1;
      } else {
        player.y = 450;
        player.speedY = 0;
      }
      break;
    case 37: // left arrow
      if (player.x > 0) {
        player.speedX -= 1;
      } else {
        player.x = 0;
        player.speedX = 0;
      }
      break;
    case 39: // right arrow
      if (player.x + 30 < 600) {
        player.speedX += 1;
      } else {
        player.x = 570;
        player.speedX = 0;
      }

      break;
  }
};

document.onkeyup = function (e) {
  player.speedX = 0;
  player.speedY = 0;
};

function updateGameArea() {
  myGameArea.clear();
  // update the player's position before drawing
  player.newPos();
  player.update();

  
  // update the obstacles array
  updateObstacles();

  // check if the game should stop
  checkGameOver(); // Final dos settings de colisão
  // update and draw the score
  myGameArea.score(); // Final do sistema de contagem de pontos
}

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  for (t = 1; t < myTherm.length; t += 2) {
    myTherm[t].x += -1;
    myTherm[t].update();
  }
  myGameArea.frames += 4;
  if (myGameArea.frames % 120 === 0) {
    let y = myGameArea.canvas.width;
    let minWidth = 20;
    let maxWidth = 500;
    let random = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth)
    let width = 40;
    myObstacles.push(new Component(10, width, "green", y, random));
    setTimeout(function(){ myTherm.push(new Component(20, width, "blue", y, random));}, 3000)
    
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

function checkGameOver() { // Inicio de parte dos settings de colisão

  let crashed = myObstacles.some(function (obstacle) {
    return player.crashWith(obstacle);
  });
  let passWith = myTherm.some(function (therm) {
    return player.passWith(therm);
  });
  if (passWith) {
    fuel += 5;
  } else if (fuel <= 0) {
    
    myGameArea.stop();
    
  } else if (crashed) {

    myGameArea.stop();
 
  }
  
} // Fim de parte dos settings de colisão

myGameArea.start();