var PLAY=1
var END=0
var gameState=PLAY;

var giraffe,giraffe_collided,giraffe_running;

var ground,invisibleGround,groundImage;

var obstacleGroup, obstacle1, obstacle2, obstacle3 ,obstacle4;

var backgroundImg;

var score=0;

var jumpSound,collidedSound;

var gameOver,restart;









function preload(){
     jumpSound=loadSound("jump.wav");
     collidedSound=loadSound("collided.wav")

     backgroundImg=loadImage("forest.png")

    giraffe_running=loadAnimation("shadow giraffe.png","shadow giraffe running.png")
    giraffe_collided=loadAnimation("shadow giraffe.png")

    obstacle1=loadImage("obstacle.png")
    obstacle2=loadImage("obstacle2.png")
    obstacle3=loadImage("obstacle3.png")
    obstacle4=loadImage("obstacle4.png")

    groundImage=loadImage("path.png")

    gameOverImg=loadImage("gameOver.png")
    restartImg=loadImage("restart.png")
}

function setup() {
    createCanvas (windowWidth,windowHeight)

    giraffe=createSprite(50,height-70,20,50);
    giraffe.addAnimation("running",giraffe_running);
    giraffe.addAnimation("collided",giraffe_collided)
    giraffe.scale=0.1;
    giraffe.setCollider('circle',0,0,350);

    invisibleGround=createSprite(width/2,height-10,width,125)
    invisibleGround.shapeColor = "#fcbaa"

    ground = createSprite(width/2,height,width,2)
    ground.addImage("forest ground",groundImage)
    ground.x=width/2
    ground.velocityX = -(6+3*score/100)

    gameOver = createSprite(width/2,height/2-50)
    gameOver.addImage(gameOverImg)
    
    restart = createSprite(width/2,height/2)
    restart.addImage(restartImg)

    gameOver.scale = 0.5
    restart.scale = 0.1

    obstacleGroup = new Group();

    score=0;

    
}

function draw() {
    background(backgroundImg);

    textSize(20);
    fill("yellow");
    text("score:"+score,30,50);

    if (gameState===PLAY){
        score = score+Math.round(getFrameRate()/60);
        ground.velocityX = -(6+3*score/100);
        touches=[];
    }

    giraffe.velocityY = giraffe.velocityY+0.8;

    if(ground.x<0){
        ground.x = ground.width/2;
    }

    giraffe.collide(invisibleGround);
    
    spawnObstacles();

    if(obstacleGroup.isTouching(giraffe)){
        collidedSound.play;
        gameState=END;

    }

    else if (gameState===END){
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX=0;
        giraffe.velocityY=0;
        obstacleGroup.setVelocityXEach(0);

        giraffe.changeAnimation("collided",giraffe_collided);

        if(touches.length>0 || keyDown("SPACE")){
            reset();
            touches=[]
        }

        drawSprites();
    }

}


function spawnObstacles(){
    if (frameCount % 60 === 0){
      var enemy =createSprite(600,height-95,20,30);
      enemy.setCollider("circle",0,0,45);

      enemy.velocityX = -(6+3*score/100);

      var rand = math.round(random(1,2,3,4));

      switch(rand){
          case 1 : enemy.addImage(obstacle)
                   break;
         
          case 2 : enemy.addImage(obstacle1)
                   break;
          
          case 3 : enemy.addImage(obstacle2)
                   break

          case 4 : enemy.addImage(obstacle3)
                   break;
        } 
        
        //adding scale,lifetime and depth to the obtacle 

        enemy.scale=0.3;
        enemy.lifetime=300;
        obstacle.depth=giraffe.depth;

        giraffe.depth +=1;


        obstacleGroup.add(enemy);
        

    }
}


function reset(){
    gameState = PLAY

    restart.visible=false;
    gameOver.visible=false;

    obstacleGroup.destroyEach()

    giraffe.changeAnimation("running",giraffe_running)

    score=0;
}