class Game {
  constructor() {
    this.resetTitle = createElement("h3")
    this.resetButton = createButton("")
    this.leaderboardTitle = createElement("h3")
    this.leader1 = createElement("h4")
    this.leader2 = createElement("h4")

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();
    whiteCar = createSprite(width/2+100,height)
    whiteCar.addImage(whiteCarImg)
    whiteCar.scale = 0.06
    redCar = createSprite(width/2-100,height)
    redCar.addImage(redCarImg)
    redCar.scale = 0.06
    cars = [redCar,whiteCar]
    fuels = new Group()
    coins = new Group()
    obstacles = new Group()

    var obstaclesPositions = [ 
        { x: width / 2 + 250, y: height - 800, image: obstacleImg2 },
        { x: width / 2 - 150, y: height - 1300, image: obstacleImg1 },
        { x: width / 2 + 250, y: height - 1800, image: obstacleImg1 },
        { x: width / 2 - 180, y: height - 2300, image: obstacleImg2 }, 
        { x: width / 2, y: height - 2800, image: obstacleImg2 }, 
        { x: width / 2 - 180, y: height - 3300, image: obstacleImg1 }, 
        { x: width / 2 + 180, y: height - 3300, image: obstacleImg2 },
        { x: width / 2 + 250, y: height - 3800, image: obstacleImg2 }, 
        { x: width / 2 - 150, y: height - 4300, image: obstacleImg1 }, 
        { x: width / 2 + 250, y: height - 4800, image: obstacleImg2 }, 
        { x: width / 2, y: height - 5300, image: obstacleImg1 }, 
        { x: width / 2 - 180, y: height - 5500, image: obstacleImg2 }
   ];
    this.addSprites(coins,20,coinImg,0.09)
    this.addSprites(fuels,8,fuelImg,0.02)
    this.addSprites(obstacles,obstaclesPositions.length,obstacleImg1,0.04,obstaclesPositions)
  }

  addSprites(spriteGroup,numberofSprites,spriteImg,scale,positions = []){
    for(var i = 0;i<numberofSprites;i++){
      var x,y
      if(positions.length > 0){
        x = positions[i].x 
        y = positions[i].y
        spriteImg = positions[i].image
      }
      else{
       x = Math.round(random(width/2-180,width/2 + 180))
       y = Math.round(random(400,-height*5.5))
      }
      var sprite = createSprite(x,y)
      sprite.addImage(spriteImg)
      sprite.scale = scale
      spriteGroup.add(sprite)
    }
  }

  
  updateState(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  handleElements(){
    form.hide()
    form.titleImg.position(30,30)
    form.titleImg.class("gameTitleAfterEffect")

    this.resetTitle.position(width/2+120,30)
    this.resetTitle.html("this button gives you power to reset the game!")
    this.resetTitle.class('resetText')

    this.resetButton.position(width/2+250,80)
    this.resetButton.class('resetButton')

    this.leaderboardTitle.position(width/2-250,30)
    this.leaderboardTitle.html("LEADERBOARD:")
    this.leaderboardTitle.class('resetText')

    this.leader1.position(width/2-250,65)
    this.leader1.class('leadersText')

    this.leader2.position(width/2-250,100)
    this.leader2.class('leadersText')

  }


  leaderboard(){
    var l1,l2,players = Object.values(allPlayers)
  if((players[0].rank === 0 && players[1].rank === 0)||(players[0].rank === 1)){
    l1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
    l2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
  }
  else if(players[1].rank === 1) {
    l1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
    l2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score

  }
  this.leader1.html(l1)
  this.leader2.html(l2)

  }

  

  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if(allPlayers != undefined){
    image(trackImg,0,-height*6,width,height*7)
    this.leaderboard()
    this.healthBar()
    this.fuelBar()
    var index = 0
    for (var pla in allPlayers){
      index = index + 1
      var x = allPlayers[pla].positionX 
      var y = height-allPlayers[pla].positionY
      cars[index-1].position.x = x
      cars[index-1].position.y = y
      if(index == player.index){
        camera.position.x = cars[index-1].position.x
        camera.position.y = cars[index-1].position.y
        textSize(16   )
        text(player.name, x, y+80)
        this.handleFuelCollision(index)
        this.handleCoinCollision(index)
      }
    }
    this.playerControls()
    if(player.positionY > height*7-100){
      gameState = 2
      player.rank += 1
      Player.updatecarsatend(player.rank)
      player.update()
      this.showRank()
    }
    drawSprites()
    }
  }
  playerControls(){
    if(keyIsDown(UP_ARROW)){
      player.positionY = player.positionY +  10
      player.fuel -= 0.5
      player.update()
    }
    if(keyIsDown(LEFT_ARROW)&&player.positionX>width/2-220){
      player.positionX = player.positionX -  5
      player.update()
    }
    if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+220){
      player.positionX = player.positionX +  5
      player.update()
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        carsAtEnd: 0,
        players:{}
  
      })
      window.location.reload()
    })
    
  }

  handleCoinCollision(index){
    cars[index-1].overlap(coins,function(main,target){
      target.remove()
      player.score += 1
      player.update()
    })
  }

  handleFuelCollision(index){
    cars[index-1].overlap(fuels,function(main,target){
      target.remove()
      player.fuel = 200
      player.update()
    })
    if(player.fuel<=0){
      gameState = 2
      this.gameOver()
    }
  }

  fuelBar(){
    push()
    image(fuelicon,width/2-150,height-player.positionY-300,25,25)
    fill("beige")
    rect(width/2-120,height-player.positionY-300,200,25)
    fill("darkGreen")
    rect(width/2-120,height-player.positionY-300,player.fuel,25)
    noStroke()
    pop()
  }

  healthBar(){
    push()
    image(hearticon,width/2-150,height-player.positionY-250,25,25)
    fill("lightPink")
    rect(width/2-120,height-player.positionY-250,200,25)
    fill("maroon")
    rect(width/2-120,height-player.positionY-250,player.life,25)
    noStroke()
    pop()
  }
  showRank(){
    swal({
      title: `great job!${'\n'}rank is:${'\n'}${player.rank}`,
      text: 'you have reached the finish line and you must now eat 7 whole pizzas',
      imageUrl: 'https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png',
      imageSize: '100x100',
      confirmButtonText: "continue"
    })
  }
  gameOver(){
    swal({
      title: `you lost!`,
      text: 'you have either ran out of fuel or died, so now you have to never drink milkshakes ever again!',
      imageUrl: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png',
      imageSize: '100x100',
      confirmButtonText: "continue"
    })
  }
}

