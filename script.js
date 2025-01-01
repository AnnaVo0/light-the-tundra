/* VARIABLES */
let imgX = 50, score = 0, lives = 3, tilesX = -90, tilesY = 40;

// Sprites
let directionsTextBox, cutsceneTextBox, lily, player, jumpCollider, groundL, groundM, groundR, ghosts, fuel;

// Buttons
let playButton, directionsBeginButton;
let nextButton1, nextButton2, nextButton3, nextButton4, nextButton5;

// Images
let homeScreenImg, bgImg, cutsceneImg, lilyImg, playerIdleLImg, playerIdleRImg, ghostsImg, fuelImg;

// Screen
let screen = 0;

// Animation
let walking, idle;

// Font
let mainFont;

// Sound
let gameBGM;

/* PRELOAD LOADS FILES */
function preload(){

  // Backgrounds preload
  bgImg = loadImage("assets/bgImg.png");
  homeScreenImg = loadImage("assets/homeScreen.png");
  cutsceneImg = loadImage("assets/cutscenes.png");
  
  // Sprites preload
  playerIdleLImg = loadImage("assets/idleL.png");
  playerIdleRImg = loadImage("assets/idleR.png");
  ghostsImg = loadImage("assets/ghost.png");
  fuelImg = loadImage("assets/fuel.png");
  lilyImg = loadImage("assets/lily.png");
  
  // Font preload
  mainFont = loadFont("assets/fonts/Belanosima-Regular.ttf");

  // Animation preload
  // walking = loadAni("assets/walking/walkCycle001.png", 4);
  // idle = loadAni("assets/walking/walkCycle001.png", 1);

  // Sound preload
  mainBGM = loadSound("assets/sounds/aStroll.mp3");
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(550, 400);
  world.gravity.y = 10;

  // Resizes images

  lilyImg.resize(350, 0);
  
  playerIdleLImg.resize(0, 69);
  playerIdleRImg.resize(0, 69);

  ghostsImg.resize(0, 42);

  fuelImg.resize(0, 45);

  // Sets main font
  textFont(mainFont);

  // Displays home screen
  homeScreen();

}

/* DRAW LOOP REPEATS */
function draw() {
  // Home screen
  if (screen == 0) {
    if (playButton.mouse.presses()) {
      screen = 1;
      cutsceneScreen1();
    }
  }

  // Cutscene 1 screen
  if (screen == 1) {
    if (nextButton1.mouse.presses()) {
      screen = 2;
      cutsceneScreen2();
    }
  }

  // Cutscreen 2 screen
  if (screen == 2) {
    if (nextButton2.mouse.presses()) {
      screen = 3;
      cutsceneScreen3();
    }
  }

   // Cutscreen 3 screen
  if (screen == 3) {
    if (nextButton3.mouse.presses()) {
      screen = 4;
      cutsceneScreen4();
    }
  }

   // Cutscreen 4 screen
  if (screen == 4) {
    if (nextButton4.mouse.presses()) {
      screen = 5;
      cutsceneScreen5();
    }
  }

   // Cutscreen 5 screen
  if (screen == 5) {
    if (nextButton5.mouse.presses()) {
      screen = 6;
      directionsScreen();
    }
  }

  // Directions screen
  if (screen == 6) {
    if (directionsBeginButton.mouse.presses()) {
      screen = 7;
      gameScreen();
    }
  }
  
  // Game screen
  if (screen == 7) {
    image(bgImg, 0 - imgX, 0);

    // Invisible jump collider follows player but slightly under
    jumpCollider.moveTowards(player.x, player.y + 3, 1);
    
    // Move player
    if (kb.pressing("left")) {
      //player.ani = "walking";
      player.img = playerIdleLImg;
      player.vel.x = -5;
    } else if (kb.pressing("right")) {
      //player.ani = "walking";
      player.img = playerIdleRImg;
      player.vel.x = 5;
    } else {
      //player.ani = "idle";
      player.vel.x = 0;
    }

    // Jump player (only if touching a platform/the ground)
    if (jumpCollider.overlapping(groundM)) {
      if (kb.presses("space")) {
        player.vel.y = -9;
      }
    }
    
    // Stop player at left and right edges of screen
    if (player.x < -88) {
      player.x = -88;
    } else if (player.x > 1116) {
      player.x = 1116;
    }

    // Stop player at top of screen and lets them fall down
    if (player.y < 25) {
      player.y = 25;
      player.vel.y = 2;
    } // Teleport player back to start if fallen down a hole
      else if (player.y > 430) {
        player.pos = {x: 100, y: 250}; 
        lives = lives - 1;
    }

    camera.x = player.x + 165;

    // Stops camera from moving at the ends of the map
    if (camera.x < 165) {
      camera.x = 165;
    } else if (camera.x > 865) {
      camera.x = 865;
    }

    // Moves background image with player
    imgX = player.x;

    // Stops moving background at the ends of the map
    if (imgX < 0) {
      imgX = 0;
    } else if (imgX > 670) {
      imgX = 670;
    }

    // If player overlaps with fuel, remove it and increase score by one
    player.overlaps(fuel, collect);

    // If player collides with bat, reset them to the beginning
    if (player.collides(ghosts)) {
      player.pos = {x: 100, y: 250}; 
      lives = lives - 1;
    }


    // Displays score
    textSize(30);
    fill(255);
    text("Lantern fuel: " + score, 9, 31);

    // Displays lives
    text("Lives left: " + lives, 405, 31);
    
    // Win condition: Get 7 lantern fuel
    if (score >= 7) {
      youWin();
    }
    
    // Lose condition: Lose all 3 lives (from falling or touching a ghost)
    if (lives <= 0) {
      youLose();
    }
  }
}

/* FUNCTIONS */

// Collect fuel and increase score by 1 (does not matter what name of parameters are)
function collect(player, fuel) {
  fuel.remove();
  score = score + 1;
}

// Game background music
function backgroundMusic() {
  mainBGM.play();
  mainBGM.loop();
  mainBGM.setVolume(0.3);
}

// Home screen
function homeScreen() {
  background(homeScreenImg);

  // Play button
  playButton = new Sprite(70, height/2 + 130, 110, 70, "k");
  playButton.stroke = "#7c485c";
  playButton.color = "#fbead4";
  playButton.textColor = "#25274c";
  playButton.textSize = 20;
  playButton.text = "Play";
  
}

// Cutscene 1 screen
function cutsceneScreen1() {
  background(cutsceneImg);

  // Draws playButton off screen
  playButton.pos = {x: 600, y: 600};

  // Draws Lily
  lily = new Sprite(lilyImg, width/2 + 158, height/2 + 73);
  lily.collider = "n";
  
  // Draws text box
  cutsceneTextBox = new Sprite (width/2, height/2 + 125, 510, 110, "n");
  cutsceneTextBox.color = "#8f9eae";
  cutsceneTextBox.textSize = 16;
  cutsceneTextBox.text = "Oh no...I got lost again...";

  // Draws next button
  nextButton1 = new Sprite(485, height/2 + 170, 70, 40, "k");
  nextButton1.color = "white";
  nextButton1.textSize = 20;
  nextButton1.text = "Next";
}

function cutsceneScreen2() {
  
  // Draws previous next button off screen
  nextButton1.pos = {x: 1700, y: 1700};

  // Draws next button
  nextButton2 = new Sprite(485, height/2 + 170, 70, 40, "k");
  nextButton2.color = "white";
  nextButton2.textSize = 20;
  nextButton2.text = "Next";
  
  cutsceneTextBox.text = "And my lantern's dying out, too..."
  
}

function cutsceneScreen3() {

  // Draws previous next button off screen
  nextButton2.pos = {x: 1700, y: 1700};

  // Draws next button
  nextButton3 = new Sprite(485, height/2 + 170, 70, 40, "k");
  nextButton3.color = "white";
  nextButton3.textSize = 20;
  nextButton3.text = "Next";

  cutsceneTextBox.text = "What should I do..? It's so cold and dark..."
  
}

function cutsceneScreen4() {

  // Draws previous next button off screen
  nextButton3.pos = {x: 1700, y: 1700};

  // Draws next button
  nextButton4 = new Sprite(485, height/2 + 170, 70, 40, "k");
  nextButton4.color = "white";
  nextButton4.textSize = 20;
  nextButton4.text = "Next";

  cutsceneTextBox.text = "...Ok. Calm down. Deep breaths."
  
}

function cutsceneScreen5() {

  // Draws previous next button off screen
  nextButton4.pos = {x: 1700, y: 1700};

  // Draws next button
  nextButton5 = new Sprite(485, height/2 + 170, 70, 40, "k");
  nextButton5.color = "white";
  nextButton5.textSize = 20;
  nextButton5.text = "Next";
  
  cutsceneTextBox.text = "My lantern will guide me. I just need to find fuel."
  
}

// Directions screen
function directionsScreen() {

  // Draws cutscene off screen
  nextButton5.pos = {x: 1700, y: 1700};
  cutsceneTextBox.pos = {x: 1700, y: 1700};
  lily.pos = {x: 1700, y: 1700};
  
  image(bgImg, 0, 0);

  // Text box
  directionsTextBox = new Sprite(280, 200, 450, 325, "s");
  directionsTextBox.color = "#8f9eae";
  directionsTextBox.textColor = "#292c44";
  directionsTextBox.textSize = 17;
  directionsTextBox.text = "Find 7 lantern fuel to relight Lily’s lantern.\n\nUse the left and right arrow keys to move,\nand the spacebar to jump. Avoid ghosts and holes,\nwhich will reset Lily to the beginning.";

  // Begin button
  directionsBeginButton = new Sprite(width/2, height/2 + 150, 100, 70, "k");
  directionsBeginButton.color = "#f7f8f9";
  directionsBeginButton.textColor = "#292c44";
  directionsBeginButton.textSize = 17;
  directionsBeginButton.text = "Begin";
  
}

// Game screen (assets)
function gameScreen() {

  // Plays BGM
  backgroundMusic();
  
  // Draws directions off screen
  directionsTextBox.pos = {x: 2700, y: 2700};
  directionsBeginButton.pos = {x: 2700, y: 2700};

  // Creates player sprite
  player = new Sprite(playerIdleRImg, 100, 250);
  player.rotationLock = true;
  
  // Creates invisible sprite collider to detect when player is touching the ground
  jumpCollider = new Sprite(100, 253, 47, 100, "n");
  jumpCollider.visible = false;
  jumpCollider.rotationLock = true;
  
  // Creates middle ground sprites
  groundM = new Group();
  groundM.layer = 0;
  groundM.collider = "s";
  groundM.color = "black";
  groundM.friction = 0;
  groundM.h = 35;
  groundM.tile = "m";
  
  // Creates bat sprites
  ghosts = new Group();
  ghosts.img = ghostsImg;
  ghosts.collider = "k";
  ghosts.friction = 0;
  ghosts.tile = "g";
  
  // Creates fuel sprites
  fuel = new Group();
  fuel.img = fuelImg;
  fuel.collider = "k";
  fuel.friction = 0;
  fuel.tile = "f";

  new Tiles (
    [
      "                                           f      ",
      "                                                  ",
      "                                     mmmmmmmmmmmmm",
      "ff                                                ",
      "     m   g                                        ",
      "     m                          g          ff     ",
      "mmmmmmmmmmmm                                      ",
      "                             mmmmmm    mmmmmmmmmmm",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "             f             f                      ",
      "                                                  ",
      "mmmmmmmmmmmmmm            mmmmm mmmmmmmmmmmmmmmmmm"
    ],
    tilesX,
    tilesY,
    25,
    25
  )

  
}

// Win screen
function youWin() {
  if (score >= 7) {
    image(bgImg, 0, 0);
    
    // Draws sprites off screen
    player.x = 2000;
    player.collider = "s";
    camera.x = 265;

    // Clears screen
    fuel.visible = false;
    ghosts.visible = false;
    groundM.visible = false;
    
    // Displays win text
    textSize(33);
    fill(255);
    text("You won! Lily made it home safe.", 42, height/2 - 55);
  
  }
}

// Lose screen
function youLose() {
  if (lives <= 0) {
    image(bgImg, 0, 0);
    
    // Draws sprites off screen
    player.x = 2000;
    player.collider = "s";
    camera.x = 265;

    // Clears screen
    fuel.visible = false;
    ghosts.visible = false;
    groundM.visible = false;
    
    // Displays win text
    textSize(33);
    fill(255);
    text("You lost!", width/2 - 60, height/2 - 100);
    text("Click to try again.", width/2 - 120, height/2 - 50);
    
    restart();
  }
}

// Restart game
function restart() {
  if (mouseIsPressed) {
    
    lives = 3;
    screen = 7;
    imgX = 50;

    fuel.visible = true;
    ghosts.visible = true;
    groundM.visible = true;

    player.pos = {x: 100, y: 250}; 
    player.collider = "d";
    

  }
}