var canvas;
var backgroundImage;
var database, gameState;
var form, player, playerCount;
var allPlayers;
var redCarImg,whiteCarImg,trackImg,redCar,whiteCar,cars = []
var fuelImg, coinImg, fuels, coins
var obstacleImg1,obstacleImg2,obstacles
var fuelicon,hearticon

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  redCarImg = loadImage("./assets/redCar.png")
  whiteCarImg = loadImage("./assets/whiteCar.png")
  trackImg = loadImage("./assets/track.jpg")
  fuelImg = loadImage("./assets/gasStation.png")
  coinImg = loadImage("./assets/goldCoin.png")
  obstacleImg1 = loadImage("./assets/obstacle1.png")
  obstacleImg2 = loadImage("./assets/obstacle2.png")
  hearticon = loadImage("./assets/heartIcon.png")
  fuelicon = loadImage("./assets/fuelicon.png")
  
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if(playerCount === 2){
    game.updateState(1)
  }
  if (gameState === 1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
