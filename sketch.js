var gameState = "play";
var END =0;
var gameState = "start";
var Man, Man_running, Man_collided;
var ground, invisibleGround, groundImage;
var sky,diamond,diamondImg;
var background1,background2,backgroundbg;
var gameOverbg ;
var cloudsGroup, cloudImage,diamondGroup;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6,boomm;

var score = 0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  Man_running = loadAnimation("tile000.png","tile002.png","tile003.png","tile004.png","tile005.png",
  "tile006.png","tile007.png","tile008.png","tile009.png");
  Man_collided = loadAnimation("tile009.png");
  
  diamondImg = loadImage("diamond.png")
  groundImage = loadImage("ground2.png");
  sky = loadImage("BlueSky.png");
  gameOverbg = loadImage("Game Overbg.png");
  cloudImage = loadImage("cloud1.png");
  
  background1 = loadImage ("background1.jpg");
  background2 = loadImage ("background 2.png");

  obstacle1 = loadImage("obstacle.png");
  obstacle2 = loadImage("Bomb.png");
  obstacle3 = loadImage("obstacle.png");
  obstacle4 = loadImage("obstacle.png");
  obstacle5 = loadImage("obstacle.png");
  obstacle6 = loadImage("obstacle.png");
  
  restartImg = loadImage("RestartButton.png");
  gameOverImg = loadImage("Game Over.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(600,600);

  var message = "This is a message";
 console.log(message);
  
  Man = createSprite(50,160,20,50);
  Man.addAnimation("running", Man_running);
  Man.addAnimation("collided", Man_collided);
  Man.scale = 1;
  
  diamond = createSprite(80,400,40,80);
  diamond.addImage("diamond", diamondImg);
  diamond.scale = 0.1;

  ground = createSprite(200,562,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //gameOver = createSprite(300,100);
  //gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,440);
  restart.addImage(restartImg);
  
 
  
 
  //gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,570,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  diamondGroup =new Group();
  
  Man.setCollider("rectangle",0,0,Man.width,Man.height);
  //Man.debug = true;
  score = 0;
  
}

function draw() {
  background(background1);

  if (gameState === "start"){
  background(background2);
  stroke("red");
  strokeWeight(8);
  fill("blue");
  textSize(30);
  text("Welcome !  Press  Enter  To  Start.",110,140);
  stroke("yellow")
  strokeWeight(8)
  fill("red");
  textSize(30);
  text("ZOMBIE  RUNNER  GAME",110,40);
  stroke("black")
  strokeWeight(8)
  fill("red");
  textSize(20);
  text("Steps:-",110,200);
  stroke("black")
  strokeWeight(8)
  fill("red");
  textSize(30);
  text("Press  Space  Key  To  Jump.",110,260);
  if(keyDown("enter")){
  gameState = "play"
  
  }
  ground.velocityX = 0;
  Man.velocityY = 0;
  Man.changeAnimation("collided", Man_collided)
  Man.x = 50;
  Man.y = 570;
  Man.visible = false;
  ground.visible = false;
  //gameOver.visible = false;
  restart.visible = false;
  diamond.visible = false;
  }
  
  if(gameState === "play"){
  background(background1);
   //gameOver.visible = false;
    restart.visible = false;
    diamond.visible = true;
    
    
    
    Man.visible = true;
    ground.visible = true;
    stroke("white");
    strokeWeight(8);
    fill("red");
    text("Score: "+ score, 500,14);
    Man.changeAnimation("running", Man_running);

    //move the ground
    ground.velocityX = -(4+3/100);
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(score>0 && score%100 === 0){
      
    }
    if (diamondGroup.isTouching(Man)) {
      diamondGroup.destroyEach();
      score=score+50;
      
    }
   if (diamond.isTouching(Man)) {
    diamond.destroy();
    score=score+50;
  }
    
    //jump when the space key is pressed
    if(keyDown("space")&& Man.y >= 400&& Man.isTouching(ground)) {
      Man.velocityY = -16;
        jumpSound.play();
    }
    
    //add gravity
    Man.velocityY = Man.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
    createDiamond();
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(Man)){
        Man.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
     background(gameOverbg)
      //gameOver.visible = true;
      restart.visible = true;
     Man.visible = false;
    ground.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
     //change the Man animation
     Man.changeAnimation("collided", Man_collided);
     diamond.visible = false;
     diamondGroup.destroyEach();
     
      ground.velocityX = 0;
      Man.velocityY = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 

   }
  
 
  //stop Man from falling down
  Man.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }
   
   
  drawSprites();
}

function reset(){
  score = 0;
  gameState = "start";
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,540,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 100;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,200,40,10);
    cloud.y = Math.round(random(80,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = Man.depth;
    Man.depth = Man.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function createDiamond() {
  if (World.frameCount % 60 == 0) { 
  var diamond = createSprite(600,400,40,10);
  diamond.y = (Math.round(random(400, 400)));
  diamond.addImage(diamondImg);
  diamond.scale=0.1;
  diamond.velocityX = -3;
  diamond.lifetime = 200;
  diamondGroup.add(diamond);
  diamond.depth = Man.depth;
  Man.depth = Man.depth + 1;
  }
}