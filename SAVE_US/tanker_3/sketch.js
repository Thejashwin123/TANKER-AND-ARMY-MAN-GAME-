var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var score = 0;
var life = 3;
var bullets = 180;
var bullets2=180;
var tankcount=1

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  bulletImg = loadImage("assets/BULLET.png")
  shooterImg = loadImage("assets/TANKER.png")
  shooter_shooting = loadImage("assets/TANKER.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.png")
  
  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

  
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.7

  

//creating the player sprite
player = createSprite(100, 150, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = false
   player.setCollider("rectangle",0,0,100,100)


   player2 = createSprite(100, displayHeight-150, 50, 50);
 player2.addImage(shooterImg)
   player2.scale = 0.3
   player2.debug = false
   player2.setCollider("rectangle",0,0,100,100)
   player2.visible=false


   //creating sprites to depict lives remaining
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    //creating groups for zombies and bullets
    bulletGroup = new Group()
    zombieGroup = new Group()
    bulletGroup2 = new Group()
 


}
 
function draw() {
  background(0); 


if(gameState === "fight"){

  //displaying the appropriate image according to lives reamining
  if(life===3){
    heart3.visible = true
    heart1.visible = false
    heart2.visible = false
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = false
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  //go to gameState "lost" when 0 lives are remaining
  if(life===0){
    gameState = "gameOver"
    
  }


  //go to gameState "won" if score is 100
  if(score==300){
    gameState = "won"
    winning.play();
  }


  // make 1 more tank if score is above 100
  if(score>=10){

player2.visible=true

  }

//moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//moving the player2 up and down and making the game mobile compatible using touches
if(keyDown("w")||touches.length>0){
  player2.y = player2.y-30
}
if(keyDown("s")||touches.length>0){
 player2.y = player2.y+30
}




//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(100,player.y-0,20,10)
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  bullet.addImage(bulletImg)
  bullet.scale=0.3
  bullets = bullets-1
  explosionSound.play();
}



//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space") && score>=10){
  bullet2 = createSprite(100,player2.y-0,20,10)
  bullet2.velocityX = 20
  bullet2.addImage(bulletImg)
  bulletGroup2.add(bullet2)
  player2.depth = bullet2.depth
  player2.depth = player2.depth+2
  bullet2.scale=0.3
  bullets2= bullets2-1
  explosionSound.play();
}



//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}


//go to gameState "bullet" when player runs out of bullets
if(bullets==0){
  gameState = "bullet"
  lose.play();
    
}

//destroy the zombie when bullet touches it and increase score
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+2
        } 
  
  }
}


if(zombieGroup.isTouching(bulletGroup2)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup2)){
        zombieGroup[i].destroy()
        bulletGroup2.destroyEach()
        explosionSound.play();
 
        score = score+2
        } 
  
  }
}
//reduce life and destroy zombie when player touches it
if(zombieGroup.isTouching(player)){
 
   lose.play();
 

 for(var i=0;i<zombieGroup.length;i++){     
      
  if(zombieGroup[i].isTouching(player)){
       zombieGroup[i].destroy()
      
      life=life-1
       } 
 
 }
}


//reduce life and destroy zombie when player2 touches it
if(zombieGroup.isTouching(player2)){
 
  lose.play();


for(var i=0;i<zombieGroup.length;i++){     
     
 if(zombieGroup[i].isTouching(player2)){
      zombieGroup[i].destroy()
     
     life=life-1
      } 

}
}
//calling the function to spawn zombies
enemy();
}




drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
  fill("green")
text("Bullets = " + bullets,displayWidth-510,displayHeight/3-220)
text("Score = " + score,displayWidth-1300,displayHeight/3-220)
fill("Red")
text("Lives = " + life,displayWidth-900,displayHeight/3-220)

//destroy zombie and player and display a message in gameState "lost"
if(gameState == "gameOver"){
  gameOver()
  // textSize(100)
  // fill("red")
  // text("You Lost ",400,400)
  zombieGroup.destroyEach();
  player.destroy();
  player2.destroy();
}


//destroy zombie and player and display a message in gameState "won"
else if(gameState == "won"){
 
  textSize(50)
  fill("yellow")
  text("You Won.And You have saved the City",100,100)
  zombieGroup.destroyEach();
  player.destroy();

}

else if(gameState == "won"){
 
  textSize(50)
  fill("yellow")
  text("You Won.And You have saved the City",100,100)
  zombieGroup.destroyEach();
  player2.destroy();

}
//destroy zombie, player and bullets and display a message in gameState "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("You ran out of bullets!!!",470,410)
  zombieGroup.destroyEach();
  player.destroy();
  player2.destroy();
  bulletGroup.destroyEach();

}

}


//creating function to spawn zombies
function enemy(){
  if(frameCount%50===0){

    //giving random x and y positions for zombie to appear
    zombie = createSprite(random(500,1100),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.4
    zombie.velocityX = -3
    zombie.debug= false
    zombie.setCollider("rectangle",0,0,800,800)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }

}

// //gameover function
function gameOver() {

  swal(
    {

      title: `Game Over!!!`,
      text: "\n\t\t OOPs !!! \nYou LOST... ",
      confirmButtonText: "Restart",
      confirmButtonColor: "black"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  )
}
