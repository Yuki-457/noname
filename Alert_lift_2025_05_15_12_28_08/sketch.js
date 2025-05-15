// === Image Assets ===
// Visual elements used in different parts of the game (backgrounds, tiles, characters, UI)
let bgImage, groundImage, blockImage, blockImage2, spikeImage, chasingSpikesImage;
let playerImage, playerImg1, playerImg2;
let portalImgClosed, portalImgOpened;
let pipeImg, monsterImg1, bossImg;
let femalecat1Img, femalecat2Img, femalecat3Img;
let maleCatDialogImg, femaleCatDialogImg, deadCatDialogImg, wizardDialogImg;
let triangleNextEnabledImg, triangleNextDisabledImg;
let bulletImg, turretImg;
let coinImg, hiddenImg, switchImg;
let cloudImg, cloudStingImg, signBoardImg, hiddenDoorImg;
let coverImg, logo2Img, witchImg, potionImg;
let buttonImg;
let emptyButtonImg2;
let settingTitleImg;
let settingWordsImg;

// === Ending Credit Control Variables ===
let inThanksPhase = false;
let thanksAlpha = 0;
let thanksPhase = "fadeIn";
let thanksTimer = 0;

// === Sound Assets ===
let coinSound, shootSound, jumpSound, mosterDieSound, playerDieSound, mouseClickSound, antidoteSound;

// === Global Game State Variables ===
let previousGameState = null;

// === Upgrade Menu Assets ===
let upgradeImg;
let checkboxImg, checkboxCheckedImg;
let buffPreviewGif1, buffPreviewGif2;
let weaponPreviewGif1, weaponPreviewGif2;
let bossAttackGif1, bossAttackGif2, bossAttackGif3;
let bossToCatGif, bossToDeadCatGif;

// === UI and Gameplay Controls ===
let buttons = [];                   // Main menu buttons
let gameState = "menu";             // Current state of the game ("menu", "playing", etc.)
let volume = 5;                     // Volume level (0–10)

// === Player Controls Mapping ===
let controls = {                    // Key bindings for player actions
  left: 'A',
  right: 'D',
  attack: 'J',
  jump: 'K',
  item: 'I',
  pause: 'P',
  use: 'E'
};
let controlKeys = Object.keys(controls);
let changingKey = null;

// === UI / Scene Parameters ===
let titleFontSize = 48;
let titleY;
let groundHeight = 150;

// === Scene Control Variables ===
let sceneIndex = 0;
let goldCoins = 0;
let level = 1;
let exp = 0;
let elapsedTime = 0;
let unlockedPortals = [];
let isChoosingPortal = false;
let selectedPortalIndex = 0;
let currentSpawnPoint = null;
let scenes = [];
let maxScenes = 4;
let hiddenScenes = [];
let hiddenSceneIndex = 0;
let inHiddenScene = false;
let hiddenMaxScenes = 3;

// === Difficulty and Upgrade Control ===
let difficultyButtons = [];
let difficulty = "easy";
let backButton;
let upgradeButtons = [];
let wizard;
let buffLevel = 0;
let upgradeOption = 0;

// === Intro Story Variables ===
let storyIndex = 0;
let storyPhase = "fadeIn";
let storyAlpha = 0;
let storyTimer = 0;
let storyTexts = [
  "Once upon a time, in the Kingdom of Cats, \nthere lived a gentle cat princess.",
  "One day, she mysteriously disappeared, \nplunging the kingdom into sorrow.",
  "Only the cat prince refused to give up hope.",
  "With a few cans of courage and a heart full of determination, \nhe set out on a journey to find the princess.",
  "Little did he know, this journey would change everything."
];

// === Ending Story Variables ===
let endIndex = 0;
let endPhase = "fadeIn";
let endAlpha = 0;
let endTimer = 0;
let goodEndingText = [
  "The two held each other tightly, welcoming the dawn amidst the ruins."
];
let badEndingTest = [
  "The curse had become irreversible.",
  "She faded slowly in the prince's arms,",
  "leaving behind only silence and sorrow."
];

// === Dialog Typing Control ===
let dialogTypingText = "";
let dialogTypingIndex = 0;
let dialogTypingSpeed = 2;
let dialogTypingTimer = 0;
let dialogFinishedTyping = false;
let hasShownBossDialog = false;

// === Setup Function ===
// Initializes canvas, UI elements, game scenes, player, and story dialog
function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  titleY = height / 4;
  sceneIndex = 0;
  
  let startY = height / 2;
  
  // === Initialize Main Menu Buttons ===
  buttons.push(new Button(width / 2 - 100, height / 2 - 10, "New Start", () => gameState = "difficultySelect"));
  buttons.push(new Button(width / 2 - 100, height / 2 + 50, "Continue", () => console.log("Load Game")));
  buttons.push(new Button(width / 2 - 100, height / 2 + 110, "Setting", () => {
    previousGameState = gameState;
    gameState = "settings";
  }));
  buttons.push(new Button(width / 2 - 100, height / 2 + 170, "Exit", () => noLoop()));
  
  // === Difficulty Selection Buttons ===
  difficultyButtons.push(new Button(width / 2 - 100, height / 2 - 40, "Easy Mode", () => {
    difficulty = "easy";
    gameState = "introStory";
    storyIndex = 0;
    storyAlpha = 0;
    storyPhase = "fadeIn";
  }));

  difficultyButtons.push(new Button(width / 2 - 100, height / 2 + 40, "Hard Mode", () => {
    difficulty = "hard";
    gameState = "introStory";
    storyIndex = 0;
    storyAlpha = 0;
    storyPhase = "fadeIn";
  }));

  // Back button in difficulty selection
  backButton = new Button(width / 2 - 100, height - 150, "Back", () => {
    if (gameState === "difficultySelect") {
      gameState = "menu";
    }
  });
  
  player = new Player(50, height - groundHeight - 40);
  
  for(let i = 0; i <= maxScenes; i++){
    scenes.push(new Scene());
  }
  
  // === Scene 0 Configuration (Initial platforms, enemy, portal) ===
  scenes[0].addPlatform(450, height - groundHeight - 130, 30, true);
  scenes[0].addPlatform(480, height - groundHeight - 130, 30, true);
  scenes[0].addPlatform(510, height - groundHeight - 130, 30, true);
  scenes[0].addPlatform(540, height - groundHeight - 130, 30, true);
  scenes[0].addEnemy(400, height - groundHeight - 25, 25, 25, 2, 400, 700);
  scenes[0].addSpike(250, height - groundHeight, 50);
  
  let portal1 = scenes[0].addPortal(100, height - groundHeight - 60, "main", 0);
  lastCheckPoint = { x: portal1.x, y: portal1.y, scene: 0 };
  
  // === Scene 1 Configuration ===
  // (Cliffs, turrets, coins, breakable blocks, pipes, etc.)
  scenes[1].addCliff(150, 200);
  scenes[1].addCliff(250, 300);
  
  scenes[1].addTurret(165, height - 20);
  scenes[1].addTurret(265, height - 20);
  
  for(let x = 150; x <= 270; x += 30){
    scenes[1].addPlatform(x, height - groundHeight - 240, 30, false);
  }
  
  for(let x = 150; x <= 270; x += 30){
    scenes[1].addCoin(x + 15, height - groundHeight - 260, false);
  }
  
  for(let i = 0; i < 4; i++){
    
    let xPos = 450 + i * 30; 

    if (i === 1 || i === 2) { 
        scenes[1].addBreakableBlock(xPos, height - groundHeight - 100, 30);
    } else {
        scenes[1].addPlatform(xPos, height - groundHeight - 100, 30, false);
    }
    scenes[1].addPlatform(450 + i * 30, height - groundHeight - 220, 30, false);
  }
  
  for(let i = 0; i < 5; i++){
    scenes[1].addPlatform(450, height - groundHeight -(100 + i * 30), 30, false);
    scenes[1].addPlatform(540, height - groundHeight -(100 + i * 30), 30, false);
  }
  
  for(let i = 1; i < 3; i++){
    for(let j = 0; j < 3; j++){
      scenes[1].addCoin(450 + i * 30 + 15, height - groundHeight -(100 + j * 30 + 15), false);
    }
  }
  
  scenes[1].addPipe(650, height - groundHeight - 110, 75, 110);

  // === Scene 2 Configuration ===
  let portal2 = scenes[2].addPortal(100, height - groundHeight - 60, "main", 2);
  lastCheckPoint = { x: portal2.x, y: portal2.y, scene: 2 };

  scenes[2].addCliff(500, 600);
  scenes[2].addHiddenBlock(500, height - groundHeight - 80, 30);
  scenes[2].addBillBoard(250, height - groundHeight - 180);
  if(!scenes[2].clouds){
    scenes[2].clouds = [];
  }
  scenes[2].clouds.push(new Cloud(500, 120, 150, 100, scenes[2]));
  scenes[2].addBossGate(width - 30);

  // === Scene 3 Configuration ===
  for(let i = 0; i < 4; i++){
    scenes[3].addPlatform(70 + i * 30, 200, 30, false);
    scenes[3].addPlatform(150 + i * 30, 80, 30, false);
    scenes[3].addPlatform(150 + i * 30, 320, 30, false);
    scenes[3].addPlatform(530 + i * 30, 170, 30, false);
    scenes[3].addPlatform(530 + i * 30, 310, 30, false);
  }
  scenes[3].addBoss(370, height - groundHeight - 180);
  
  // === Hidden Scene Initialization ===
  hiddenScenes = [];
  for(let i = 0; i < hiddenMaxScenes; i++){
    hiddenScenes.push(new Scene());
  }
  
  hiddenScenes[0].addCliff(200, 800);
  hiddenScenes[1].addCliff(0,800);
  hiddenScenes[2].addCliff(0,500);
  
  let hiddenPortal = hiddenScenes[0].addPortal(100, height - groundHeight - 60, "hidden", 0);
  
  hiddenScenes[0].addGate(200);
  hiddenScenes[0].addSwitch(70, height - groundHeight - 20);
  hiddenScenes[0].addChasingSpike();
  
  hiddenScenes[0].addPlatform(330, height - groundHeight - 10, 30, true);
  hiddenScenes[0].addPlatform(410, height - groundHeight - 10, 30, true);
  hiddenScenes[0].addPlatform(440, height - groundHeight - 10, 30, true);
  hiddenScenes[0].addPlatform(530, height - groundHeight - 10, 30, true);
  hiddenScenes[0].addPlatform(560, height - groundHeight - 10, 30, true);
  hiddenScenes[0].addPlatform(680, height - groundHeight - 100, 30, true);
  hiddenScenes[0].addPlatform(710, height - groundHeight - 100, 30, true);
  hiddenScenes[0].addPlatform(740, height - groundHeight - 100, 30, true);
  hiddenScenes[0].addPlatform(770, height - groundHeight - 100, 30, true);
  hiddenScenes[0].addPlatform(810, height - groundHeight - 100, 30, true);
  
  hiddenScenes[1].addPlatform(0, height - groundHeight - 10, 30, true);
  hiddenScenes[1].addPlatform(30, height - groundHeight - 10, 30, true);
  hiddenScenes[1].addPlatform(150, height - groundHeight - 100, 30, true);
  hiddenScenes[1].addPlatform(250, height - groundHeight - 100, 30, true);
  hiddenScenes[1].addPlatform(350, height - groundHeight - 180, 30, true);
  hiddenScenes[1].addPlatform(350, height - groundHeight - 10, 30, true);
  hiddenScenes[1].addMovablePlatform(450, height - groundHeight - 300, 450, height - groundHeight - 330, 30, 5);
  hiddenScenes[1].addPlatform(450, height - groundHeight - 100, 30, true);
  hiddenScenes[1].addMovablePlatform(510, height - groundHeight - 10, 480, height - groundHeight - 10, 30, 5);
  hiddenScenes[1].addPlatform(610, height - groundHeight - 100, 30, true);
  hiddenScenes[1].addPlatform(640, height - groundHeight - 100, 30, true);
  hiddenScenes[1].addPlatform(750, height - groundHeight - 100, 30, true);
  hiddenScenes[2].addPlatform(30, height - groundHeight - 70, 30, true);
  hiddenScenes[2].addPlatform(60, height - groundHeight - 70, 30, true);

  for(let i = 0; i < 4; i++){
    hiddenScenes[2].addPlatform(30, height - groundHeight -(200 + i * 30), 30, false);
    hiddenScenes[2].addPlatform(60, height - groundHeight -(200 + i * 30), 30, false);
  }
  hiddenScenes[2].addPlatform(130, height - groundHeight - 150, 30, true);
  hiddenScenes[2].addPlatform(160, height - groundHeight - 150, 30, true);
  hiddenScenes[2].addPlatform(240, height - groundHeight - 100, 30, true);
  hiddenScenes[2].addPlatform(270, height - groundHeight - 100, 30, true);
  hiddenScenes[2].addPlatform(380, height - groundHeight - 100, 30, true);
  hiddenScenes[2].addPlatform(410, height - groundHeight - 100, 30, true);
  hiddenScenes[2].addPlatform(440, height - groundHeight - 100, 30, true);
  hiddenScenes[2].addFinalGate(500);
  
  hiddenScenes[2].addWizard(600, height - groundHeight - 40);
  hiddenScenes[2].addEndSwitch(700, height - groundHeight - 40);

  // === Dialog Before Final Boss ===
  dialogs = [
    { speaker: "Witch", text: "You're searching for the lost Cat Princess, aren't you?", bg: wizardDialogImg },
    { speaker: "Prince", text: "You know where she is?!", bg: maleCatDialogImg },
    { speaker: "Witch", text: "She... has been cursed, turned into the very \nenemy you're about to face.", bg: wizardDialogImg },
    { speaker: "Prince", text: "What?!", bg: maleCatDialogImg },
    { speaker: "Witch", text: "Here is an antidote—only it can restore her true form.", bg: wizardDialogImg },
    { speaker: "Witch", text: "But the antidote will only appear in a heart \nthat truly seeks the truth.", bg: wizardDialogImg }
  ];
  
}

// === Main draw function ===
// Called repeatedly by p5.js to render the game screen based on the current state
function draw() {
  background(240);
  
  // Render different screens depending on the gameState
  if(gameState === "menu"){
    drawMenu();
  }
  else if(gameState === "difficultySelect"){
    drawDifficultyMenu();
  }
  else if(gameState === "introStory"){
    drawIntroStory();
  }
  else if (gameState === "dialog") {
    drawDialogScene();
  }
  else if(gameState === "settings"){
    drawSettings();
  }
  else if(gameState === "playing"){
    drawGame();
  }
  else if(gameState === "upgrade"){
    drawUpgrade();
    handleUpgradeInput();
  }
  else if (gameState === "endingStory") {
    console.log("Current gameState:", gameState);
    drawEndingStory();
  }
}

// === Draw main menu UI ===
function drawMenu(){
  image(coverImg, 0, 0, 800, 600);      
  textSize(titleFontSize);
  
  let logoW = 430; 
  let logoH = logo2Img.height * (logoW / logo2Img.width);  
  
  
  image(logo2Img, (width - logoW) / 2-10, 50, logoW, logoH);  
  // Display all main menu buttons
  for (let btn of buttons) {
    btn.display();
  }
}

// === Draw difficulty selection screen ===
function drawDifficultyMenu() {
  image(coverImg, 0, 0, 800, 600); 
  
  
  fill(0, 150);  
  rect(0, 0, width, height);
  
  fill(255);  
  textSize(50);
  text("Select Difficulty", width / 2, height / 3);
  
  
  for (let btn of difficultyButtons) {
    btn.display();
  }
  
  console.log("Current gameState:", gameState);
  backButton.display();  

}

// === Draw the intro story sequence ===
function drawIntroStory() {
  background(0);  
  noStroke(); 
  fill(255, storyAlpha);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(storyTexts[storyIndex], width / 2, height / 2);

  const fadeSpeed = 5;

  if (storyPhase === "fadeIn") {
    storyAlpha += fadeSpeed;
    if (storyAlpha >= 255) {
      storyAlpha = 255;
      storyPhase = "hold";
      storyTimer = millis();
    }
  } else if (storyPhase === "hold") {
    if (millis() - storyTimer > 2000) {
      storyPhase = "fadeOut";
    }
  } else if (storyPhase === "fadeOut") {
    storyAlpha -= fadeSpeed;
    if (storyAlpha <= 0) {
      storyAlpha = 0;
      storyPhase = "pause";
      storyTimer = millis();
    }
  } else if (storyPhase === "pause") {
    if (millis() - storyTimer > 500) {
      storyIndex++;// Move to next line of story
      if (storyIndex >= storyTexts.length) {
        gameState = "playing";// End of story -> start gameplay
      } else {
        storyPhase = "fadeIn";
      }
    }
  }
}

// === Draw the ending story and "Thank You" screen ===
function drawEndingStory() {
  background(0);  
  noStroke();
  textAlign(CENTER, CENTER);

  if (!inThanksPhase) {
    fill(255, endAlpha);
    textSize(24);

    // Choose good/bad ending text depending on whether the player got the antidote
    let textArray = player.hasAntidote ? goodEndingText : badEndingTest;
    text(textArray[endIndex], width / 2, height / 2);

    const fadeSpeed = 5;

    if (endPhase === "fadeIn") {
      endAlpha += fadeSpeed;
      if (endAlpha >= 255) {
        endAlpha = 255;
        endPhase = "hold";
        endTimer = millis();
      }
    } else if (endPhase === "hold") {
      if (millis() - endTimer > 2000) {
        endPhase = "fadeOut";
      }
    } else if (endPhase === "fadeOut") {
      endAlpha -= fadeSpeed;
      if (endAlpha <= 0) {
        endAlpha = 0;
        endPhase = "pause";
        endTimer = millis();
      }
    } else if (endPhase === "pause") {
      if (millis() - endTimer > 500) {
        endIndex++;
        if (endIndex >= textArray.length) {
          inThanksPhase = true;
          thanksPhase = "fadeIn";
          thanksAlpha = 0;
          thanksTimer = millis();
        } else {
          endPhase = "fadeIn";
        }
      }
    }
  } 
  else {
    // Final "Thank you" message after the ending
    fill(255, thanksAlpha);
    textSize(40);
    text("Thank you for playing!", width / 2, height / 2);

    const fadeSpeed = 5;

    if (thanksPhase === "fadeIn") {
      thanksAlpha += fadeSpeed;
      if (thanksAlpha >= 255) {
        thanksAlpha = 255;
        thanksPhase = "hold";
        thanksTimer = millis();
      }
    } else if (thanksPhase === "hold") {
      if (millis() - thanksTimer > 2000) {
        thanksPhase = "fadeOut";
      }
    } else if (thanksPhase === "fadeOut") {
      thanksAlpha -= fadeSpeed;
      if (thanksAlpha <= 0) {
        thanksAlpha = 0;
        thanksPhase = "pause";
        thanksTimer = millis();
      }
    } else if (thanksPhase === "pause") {
      if (millis() - thanksTimer > 1500) {
        // Return to main menu after ending
        gameState = "menu";
        inThanksPhase = false; 
      }
    }
  }
}

// === Draw the dialog scene between characters ===
function drawDialogScene() {
  image(coverImg, 0, 0, 800, 600);
  fill(0, 150);
  rect(0, 0, width, height);

  let dialog = dialogs[dialogIndex];// Current dialog data

  // Draw dialog box background (with character portrait)
  image(dialog.bg, width / 2 - 420, height - 380, 800, 360);

  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);

  let isWitch = dialog.speaker === "Witch";
  let textX = isWitch ? width / 2 - 280 : width / 2 - 150;

  textAlign(LEFT, TOP);
  text(dialog.speaker + ":", textX, height - 180);
  textSize(16);
  text(dialogTypingText, textX, height - 150);

  // Animate typing effect for dialog
  if (!dialogFinishedTyping) {
    dialogTypingTimer++;
    if (dialogTypingTimer % dialogTypingSpeed === 0 && dialogTypingIndex < dialog.text.length) {
      dialogTypingText += dialog.text[dialogTypingIndex];
      dialogTypingIndex++;
      if (dialogTypingIndex >= dialog.text.length) {
        dialogFinishedTyping = true;
      }
    }
  }

  // Show "Next" and "Previous" buttons as triangles (enabled/disabled)
  let nextEnabled = dialogIndex < dialogs.length - 1;
  let prevEnabled = dialogIndex > 0;

  if (nextEnabled) image(triangleNextEnabledImg, width - 100, height - 100, 50, 50);
  else image(triangleNextDisabledImg, width - 100, height - 100, 50, 50);

  push();
  translate(100, height - 75);
  scale(-1, 1);
  if (prevEnabled) image(triangleNextEnabledImg, 0, -25, 50, 50);
  else image(triangleNextDisabledImg, 0, -25, 50, 50);
  pop();
}

// === Main in-game rendering function ===
function drawGame(){
  image(bgImage, 0, 0, width, height);
  
  noStroke();
  image(groundImage, 0, height - groundHeight, width, groundHeight)
  
  rect(0, height - groundHeight, width, groundHeight);
  fill(90, 194, 108);
  let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];

  // === Trigger boss dialog when entering final area ===
  if (!hasShownBossDialog && !inHiddenScene && sceneIndex === 2 && player.x > width - 100) {
    hasShownBossDialog = true;
    dialogs = [
      { speaker: "Witch", text: "You've come.", bg: wizardDialogImg },
      { speaker: "Prince", text: "I will save her, no matter what she's become!", bg: maleCatDialogImg },
      { speaker: "Witch", text: "Then see if you hold the key of hope in your hand.", bg: wizardDialogImg },
      player.hasAntidote ?
        { speaker: "Witch", text: "This potion will help her remember who she truly is.", bg: wizardDialogImg } :
        { speaker: "Witch", text: "You moved too fast... and missed the only salvation.", bg: wizardDialogImg },
      { speaker: "Prince", text: "I'll take the risk—just to bring her back.", bg: maleCatDialogImg },
    ];
    dialogIndex = 0;
    dialogTypingText = "";
    dialogTypingIndex = 0;
    dialogFinishedTyping = false;
    gameState = "dialog";
    return;
  }

  for (let cliff of currentScene.cliffs) {
    rect(cliff.startX, height - groundHeight, cliff.endX - cliff.startX, groundHeight);
  }
  // Update and draw chasing spikes (only in hiddenScenes[0])
  for (let s of hiddenScenes[0].chasingSpikes) {
    s.update(); 
  }
  for (let s of hiddenScenes[0].chasingSpikes) {
    s.display();
  }
  // Update all scenes (main and hidden)
  for (let s of scenes) {
    s.update(); 
  }
  
  for (let s of hiddenScenes) {
    s.update(); 
  }
  // Portal selection screen (if in choosing mode)
  if(isChoosingPortal){
    drawPortalSelection();
  }

  currentScene.display();

  if(currentScene.finalGate){
    currentScene.finalGate.display();
  }
  
  if(currentScene.boss){
    currentScene.boss.display();
  }



  player.update();
  player.display();
  drawHUD();// Draw experience bar, timer, gold, etc.

  for (let pb of currentScene.playerBullets) pb.update();
  for (let pb of currentScene.playerBullets) pb.display();
  
  if(wizard){
    wizard.update();
    wizard.display();
  }

  // === Boss death triggers ending sequence ===
  let boss = currentScene.bosses.length > 0 ? currentScene.bosses[0] : null;
  if (boss) {
    console.log("DEBUG", {
      dead: boss.dead,
      choiceMade: boss.choiceMade,
      dialogFinished: boss.dialogFinished,
      showingDeathGif: boss.showingDeathGif
    });
  }
  if (
    boss &&
    boss.dead &&
    boss.dialogFinished
  ) {
    endIndex = 0;
    endAlpha = 0;
    endPhase = "fadeIn";
    endTimer = 0;
    hasGoodEnding = player.hasAntidote;
    gameState = "endingStory";
    return;
  }
}

// === Platform class ===
// Represents a solid block the player can stand on, hit, or interact with
class Platform{
  constructor(x, y, size, hasCoin = true, scene){
    this.x = x;
    this.y = y + 14;
    this.size = size;
    this.hasCoin = hasCoin;
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)) return;

    let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
    // Check if another platform is stacked on top
    let hasBlockAbove = currentScene.platforms.some(platform =>
      platform.x === this.x && platform.y === this.y - this.size
    );
    
    // === Horizontal collision detection ===
    if (player.y + player.h > this.y && player.y < this.y + this.size) {
      
      let nextX = player.x + player.velocityX; 
      // Right-side collision
      if (player.velocityX > 0 && player.prevX + player.w <= this.x + 1 && nextX + player.w > this.x) {
        if (!currentScene.platforms.some(p => p !== this && p.x === this.x - this.size && p.y === this.y)) {
          player.x = this.x - player.w;
          player.velocityX = 0;
        }
      }
      // Left-side collision
      if (player.velocityX < 0 && player.prevX >= this.x + this.size - 1 && nextX < this.x + this.size) {
        if (!currentScene.platforms.some(p => p !== this && p.x === this.x + this.size && p.y === this.y)) {
          player.x = this.x + this.size;
          player.velocityX = 0;
        }
      }
    }
    // === Head-bump logic (from below) ===
    if (player.x + player.w > this.x && player.x < this.x + this.size &&
        player.y < this.y + this.size && player.prevY >= this.y + this.size &&
        player.velocityY < 0) {
      player.y = this.y + this.size;
      player.velocityY = 0;
      // Spawn a coin if not already collected
      if (this.hasCoin) {
        currentScene.coins.push(new Coin(this.x + this.size / 2, this.y - 10, true, this.scene));
        this.hasCoin = false;
      }
      return; 
    }
    // === Landing on platform from above ===
    if (!hasBlockAbove && player.x + player.w > this.x && player.x < this.x + this.size &&
        player.y + player.h > this.y && player.prevY + player.h <= this.y &&
        player.velocityY > 0) {
      player.y = this.y - player.h;
      player.velocityY = 0;
      player.onGround = true;
      return;
    }
    
    
  }
  
  display(){
    if (!isInCurrentScene(this.scene)) return;
    image(blockImage, this.x, this.y, this.size, this.size);
  }
}

// === Coin Class ===
// Represents a collectible coin that may fall due to gravity
class Coin{
  constructor(x, y, hasGravity = true, scene){
    this.x = x - 7;
    this.y = y + 7;
    this.size = 15;
    this.collected = false;
    this.hasGravity = hasGravity;
    this.velocityY = hasGravity ? -2 : 0;
    this.gravity = hasGravity ? 0.5 : 0;
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)) return;
    if(this.hasGravity){
      this.velocityY += this.gravity;
      this.y += this.velocityY;
    }
    // Check if player touches the coin
    if(player.x + player.w > this.x && player.x < this.x + this.size &&
       player.y + player.h > this.y && player.y < this.y + this.size &&
       !this.collected){
      this.collected = true;
      collection();
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)) return;
    if(!this.collected){
      image(coinImg, this.x, this.y, this.size, this.size);
    }
  }
}

// === Spike Class ===
// Represents stationary or conditional spikes that kill the player on touch
class Spike{
  constructor(x, y, w, scene){
    this.x = x;
    this.y = height - groundHeight + 14;
    this.w = w;
    this.h = 15;
    this.visible = false;
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    // === Visibility logic based on difficulty ===
    if(difficulty === "easy"){
      this.visible = true;
    }
    if(difficulty === "hard"){
      if(dist(player.x + 20, player.y + 30, this.x + this.w / 2, this.y) < 70){
        this.visible = true;
      }
    }
    
    if(this.visible && this.isCollidingWithPlayer()){
      respawnPlayer();
      if(difficulty === "hard"){
        this.visible = false;
      }
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    if(this.visible){
      image(spikeImage, this.x, this.y - this.h, this.w, this.h);
    }
  }
  
  isCollidingWithPlayer(){
    return(player.x < this.x + this.w && player.x + player.w > this.x && 
           player.y + player.h > this.y - this.h);
  }
}

// === respawnPlayer ===
// Handles player death and full reset of game state, including enemies, coins, platforms, etc.
function respawnPlayer() {
  playerDieSound.setVolume(volume / 10);
  playerDieSound.play();

  // === Reset position based on last checkpoint ===
  if(lastCheckPoint){
    if(lastCheckPoint.sceneType === "hidden"){
      inHiddenScene = true;
      hiddenSceneIndex = lastCheckPoint.scene;
    }
    else{
      inHiddenScene = false;
      sceneIndex = lastCheckPoint.scene;
    }
    player.x = lastCheckPoint.x;
    player.y = lastCheckPoint.y;
    
  }
  else{
    inHiddenScene = false;
    sceneIndex = 0;
    player.x = 50;
    player.y = height - groundHeight - 40;
  }
  // === Reset EXP (and possibly other stats) ===
  exp = 0;
  // === Reset Boss (only in scene 3) ===
  if (!inHiddenScene && sceneIndex === 3) {
    let bossScene = scenes[3];
    for (let boss of bossScene.bosses) {
      boss.hp = difficulty === "easy"? boss.hp : boss.maxHp;
      boss.dead = false;
      boss.dialogVisible = false;
      boss.dialogStage = 0;
      boss.dialogImg = null;
      boss.dialogFinished = false;
      boss.choiceIndex = 0;
      boss.choiceMade = false;
      boss.deathGifDone = false;
      boss.deathGifStartTime = null;
      boss.currentGif = null;
      boss.showingDeathGif = false;
      boss.deathDialogTriggered = false;
      boss.phase = 0;
      boss.attackTimer = 0;
      boss.shotCount = 0;
      boss.shotType = 1;
      boss.lastAttackTime = frameCount;
      boss.lastHpTrigger = boss.hp;
    }
    bossScene.playerBullets = [];
    bossScene.bullets = [];
    bossScene.turrets = [];
    bossScene.enemies = [];
  }
  // === Reset coins in all scenes ...===
  for (let s of scenes) {
    for (let coin of s.coins) {
      coin.collected = false;
    }
  }
  for (let s of hiddenScenes) {
    for (let coin of s.coins) {
      coin.collected = false;
    }
  }
  
  
  for (let s of scenes) {
    for(let spike of s.spikes){
      spike.visible = false;
    }
  }
  
  for (let s of hiddenScenes) {
    for(let spike of s.spikes){
      spike.visible = false;
    }
  }
  
  for (let s of scenes) {
    for(let platform of s.platforms){
      platform.hasCoin = true;
    }
    
  }
  
  for (let s of hiddenScenes) {
    for(let platform of s.platforms){
      platform.hasCoin = true;
    }
    
  }
  
  for (let s of scenes) {
    for (let movablePlatform of s.movablePlatforms) {
      movablePlatform.reset();
    }
  }
  
  for (let s of hiddenScenes) {
    for (let movablePlatform of s.movablePlatforms) {
      movablePlatform.reset();
    }
  }
  
  for (let gate of hiddenScenes[0].gates) {
    gate.reset();
  }
  
  for (let s of hiddenScenes[0].switches) {
    s.reset();
  }
  
  for (let cs of hiddenScenes[0].chasingSpikes) {
    cs.reset();
  }

  for(let fg of hiddenScenes[2].finalGates){
    fg.reset();
  }

  if(wizard){
    wizard.reset();
  }

  for (let s of hiddenScenes) {
    for (let es of s.endSwitches || []) {
      es.reset();
    }
  }
  // === Reset enemies (skip boss scene to preserve death logic) ===
  for (let i = 0; i < scenes.length; i++) {
    if (i === 3) continue; 
    for (let e of scenes[i].enemies) {
      e.reset();
    }
  }

  for(let s of hiddenScenes){
    for(let e of s.enemies){
      e.reset();
    }
  }

  // === Trigger scene loading if needed ===
  setupNextScene();
}

// === Draw portal selection interface ===
function drawPortalSelection(){
  fill(0, 150);
  rect(200, 150, 400, 300, 20);
  fill(250);
  textSize(24);
  text("Select a Portal", 400, 180);
  
  // List all unlocked portals for selection
  for(let i = 0; i < unlockedPortals.length; i++){
    let portal = unlockedPortals[i];
    fill(i === selectedPortalIndex ? "yellow" : "white");
    let label = portal.sceneType === "main" ? "Main" : "Hidden"
    text(`${label} Scene ${portal.sceneIndex + 1}`, 400, 220 + i * 40);
  }
  
  textSize(16);
  fill(200);
  text("↑/↓ to navigate, E to confirm, ESC to cancel", 400, 420);
}

// === Draw Heads-Up Display (top bar with level, EXP, and time) ===
function drawHUD(){
  fill(255);
  textSize(16);
  // Level and EXP bar
  text(`Level ${level}`, 80, 30);
  fill("gold");
  rect(20, 40, (exp / 10) * 100, 10);
  noFill();
  stroke(255);
  rect(20, 40, 100, 10);
  // Elapsed time
  let timeElapsed = Math.floor(millis() / 1000);
  text(`Time: ${timeElapsed}s`, width - 80, 30);
}

// === Portal Class ===
// Represents a portal that can be unlocked and used for scene teleportation
class Portal{
  constructor(x, y, sceneType, sceneIndex, scene){
    this.x = x;
    this.y = y + 14;
    this.w = 60;
    this.h = 60;
    this.unlocked = false;
    this.sceneType = sceneType;
    this.sceneIndex = sceneIndex;
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    // Unlock the portal when player touches it
    if(!this.unlocked && this.isCollidingWithPlayer()){
      this.unlocked = true;
      if(!unlockedPortals.includes(this)){
        unlockedPortals.push(this);
      }
      
      for(let i = 0; i < 5; i++){
        collection();
      }
      // Set as current checkpoint
      lastCheckPoint = { x: this.x, y: this.y, scene: inHiddenScene ? hiddenSceneIndex : sceneIndex, sceneType: inHiddenScene ? "hidden" : "main"};
    }
    // If portal is unlocked and player presses Use key near it
    if(this.unlocked && this.isCollidingWithPlayer() && keyIsDown(controls.use.charCodeAt(0))){
      isChoosingPortal = true;
      selectedPortalIndex = 0;
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    if(this.unlocked){
      image(portalImgOpened, this.x, this.y, this.w, this.h);
    }
    else{
      image(portalImgClosed, this.x, this.y, this.w, this.h);
    }
  }
  
  isCollidingWithPlayer(){
    return(player.x < this.x + this.w && player.x + player.w > this.x &&
           player.y < this.y + this.h && player.y + player.h > this.y);
  }
}
// === Teleport player to the selected portal ===
function teleport(targetPortal){
  if(targetPortal){
    player.x = targetPortal.x;
    player.y = targetPortal.y;
    
    if(targetPortal.sceneType === "main"){
      inHiddenScene = false;
      sceneIndex = targetPortal.sceneIndex;
    }
    
    else if(targetPortal.sceneType === "hidden"){
      inHiddenScene = true;
      hiddenSceneIndex = targetPortal.sceneIndex;
    }
    // Update checkpoint and load scene
    lastCheckPoint = { x: targetPortal.x, y: targetPortal.y, scene: inHiddenScene ? hiddenSceneIndex : sceneIndex, sceneType: inHiddenScene ? "hidden" : "main"};
    
    setupNextScene();
  }
  
  isChoosingPortal = true;
}

// === Handle coin collection ===
function collection(){
  goldCoins += 1;
  exp += 1;
  coinSound.setVolume(volume / 10);
  coinSound.play();
  // Level up when EXP reaches 10
  if(exp >= 10){
    exp -= 10;
    level += 1;
    gameState = "upgrade";
  }
}

// === Player Class ===
// Controls the main character's movement, physics, animation, shooting, and scene transitions
class Player{
  constructor(x, y){
    this.x = x;
    this.y = y + 14;
    this.w = 25;
    this.h = 40;
    this.speed = 3;
    this.gravity = 0.5;
    this.jumpPower = -Math.sqrt(2 * this.gravity * 150);
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
    this.hasAntidote = false;// Affects ending
    this.facingRight = true;
    this.frameCounter = 0;
    this.imageIndex = 0;
    this.weaponLevel = 0;// 0 = no shooting, 1 = single, 2 = double shot
    this.buffLevel = 0;// 1 = larger size, 2 = double jump
    this.shootCooldown = 0;
  }
  // === Update player movement, gravity, collisions, and scene transitions ===
  update(){
    this.prevX = this.x;
    this.prevY = this.y;
    
    let moving = false;
    this.velocityX = 0;
    // Handle horizontal movement input
    if(keyIsDown(controls.left.charCodeAt(0))){
      this.velocityX = -this.speed;
      this.facingRight = false;
      moving = true;
    }
    if(keyIsDown(controls.right.charCodeAt(0))){
      this.velocityX = this.speed;
      this.facingRight = true;
      moving = true;
    }
    // Animate player sprite (toggle frame every 6 updates)
    if(moving){
      this.frameCounter++;
      if(this.frameCounter >= 6){
        this.imageIndex = 1 - this.imageIndex;
        this.frameCounter = 0;
      }
    }
    else{
      this.imageIndex = 0;
      this.frameCounter = 0;
    }
    
    checkFallDeath();// Check if the player has fallen off the map
    
    if(!this.onGround){
      this.velocityY += this.gravity;
    }

    this.w = buffLevel >= 1 ? 37.5 : 25;
    this.h = buffLevel >= 1 ? 60 : 40;
    
    this.x += this.velocityX;
    this.y += this.velocityY;
    // Check if the player is standing on various surface types
    let isOnPlatform = false;
    let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];

    for (let platform of currentScene.platforms) {
        if (
            this.prevX + this.w > platform.x + 1 && this.prevX < platform.x + platform.size &&
            this.y + this.h >= platform.y && this.prevY + this.h <= platform.y + 5
        ) {
            this.y = platform.y - this.h;
            this.velocityY = 0;
            isOnPlatform = true;
            break;
        }
    }
    
    let isOnPipe = false;
    for (let pipe of currentScene.pipes) {
        if (
            this.prevX + this.w > pipe.x + 1 && this.prevX < pipe.x + pipe.w &&
            this.y + this.h >= pipe.y && this.prevY + this.h <= pipe.y + 5
        ) {
            this.y = pipe.y - this.h;
            this.velocityY = 0;
            isOnPipe = true;
            break;
        }
    }
    
    let isOnMovablePlatform = false;
    for (let movablePlatform of currentScene.movablePlatforms) {
        if (
            this.prevX + this.w > movablePlatform.x + 1 && this.prevX < movablePlatform.x + movablePlatform.w &&
            this.y + this.h >= movablePlatform.y && this.prevY + this.h <= movablePlatform.y + 5
        ) {
            this.y = movablePlatform.y - this.h;
            this.velocityY = 0;
            isOnMovablePlatform = true;
            break;
        }
    }

    let isOnHiddenBlock = false;
    for (let hiddenBlock of currentScene.hiddenBlocks) {
        if (
            this.prevX + this.w > hiddenBlock.x + 1 && this.prevX < hiddenBlock.x + hiddenBlock.size &&
            this.y + this.h >= hiddenBlock.y && this.prevY + this.h <= hiddenBlock.y + 5
        ) {
            this.y = hiddenBlock.y - this.h;
            this.velocityY = 0;
            isOnHiddenBlock = true;
            break;
        }
    }

    let isOnBillBoard = false;
    for (let billBoard of currentScene.billBoards) {
        if (
            this.prevX + this.w > billBoard.x + 1 && this.prevX < billBoard.x + billBoard.w &&
            this.y + this.h >= billBoard.y && this.prevY + this.h <= billBoard.y + 5
        ) {
            this.y = billBoard.y - this.h;
            this.velocityY = 0;
            isOnBillBoard = true;
            break;
        }
    }
     
    if (isOnPipe || isOnPlatform || isOnMovablePlatform || isOnHiddenBlock || isOnBillBoard) {
        this.onGround = true;
        this.hasDoubleJumped = false;
    } 
    else if (!isPlayerOverCliff() && (this.y >= height - groundHeight + 14 - this.h || isOnPlatform || isOnPipe || isOnMovablePlatform || isOnHiddenBlock || isOnBillBoard)) {
      this.y = (isOnPlatform || isOnPipe || isOnMovablePlatform || isOnHiddenBlock || isOnBillBoard) ? this.y : height - groundHeight + 14 - this.h;
      this.velocityY = 0;
      if (!this.onGround) {
        this.onGround = true;
        this.hasDoubleJumped = false;  
      }
    } 
    else {
      this.onGround = false;
    }
    // Handle shooting cooldown
    if(this.shootCooldown > 0){
      this.shootCooldown--;
    }

    this.checkSceneTransition();
    
    this.x = constrain(this.x, 0 - this.w / 2, width - this.w / 2);
  }
  
  // === Handle scene/mask transitions when player reaches screen edge ===
  checkSceneTransition(){
    let centerX = this.x + this.w / 2;
    if(inHiddenScene){
      if(centerX >= width && hiddenSceneIndex < hiddenMaxScenes - 1){
        hiddenSceneIndex++;
        this.x = - this.w / 2 + 1
        setupNextScene();
      }
    
      else if(centerX <= 0 && hiddenSceneIndex > 0){
        hiddenSceneIndex--;
        this.x = width - this.w / 2 - 1;
        setupNextScene();
      }
      
      else{
        // Prevent passing beyond first/last hidden scene
        if(hiddenSceneIndex === 0 && centerX <= 0){
         this.x = - this.w / 2 + 1;
        }
      
        if(hiddenSceneIndex === hiddenMaxScenes - 1 && centerX >= width){
          this.x = width - this.w / 2;
        }
      }
    }
    else{
      if(centerX >= width){
        let gate = scenes[sceneIndex].bossGates?.[0];
        if(gate && !gate.unlocked){
          this.x = gate.x - this.w;
          return;
        }
        if(sceneIndex < maxScenes - 1){
          sceneIndex++;
          this.x = - this.w / 2 + 1;
          setupNextScene();
        }
      }
    
      if(centerX <= 0 && sceneIndex > 0){
        if(sceneIndex === 3){
          this.x = this.w / 2 + 1;
          return;
        }
        sceneIndex--;
        this.x = width - this.w / 2;
        setupNextScene();
      }
    }
  }
  // === Render player sprite based on direction and animation frame ===
  display(){
    let imgToShow = this.imageIndex === 0 ? playerImg1 : playerImg2;
    
    let scaleFactor = 1.0;
    push();
    translate(this.x + this.w / 2, this.y - this.h / 2);
    scale(scaleFactor);
    if(!this.facingRight){
      scale(-1, 1);// Flip horizontally if facing left
      image(imgToShow, -this.w / 2, this.h / 2, this.w, this.h);
    }
    else{
      image(imgToShow, -this.w / 2, this.h / 2, this.w, this.h);
    }
    pop();
  }
  // === Shoot a bullet (if weaponLevel allows) ===
  tryShoot(){
    console.log("tryShoot called, level =", this.weaponLevel, "cooldown =", this.shootCooldown);
    if(this.shootCooldown > 0 || this.weaponLevel === 0){
      return;
    }

    const scene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
    const bulletY = this.y + this.h / 2;
    const bulletX = this.facingRight ? this.x + this.w : this.x - 10;
    const direction = this.facingRight ? 1 : -1;
    if (!scene.playerBullets) scene.playerBullets = [];
    scene.playerBullets.push(new PlayerBullet(bulletX, bulletY, direction, scene));
    console.log(scene.playerBullets);
    shootSound.setVolume(volume / 10);
    shootSound.play();

    // At level 2 weapon, shoot a second bullet shortly after
    if(this.weaponLevel >= 2){
      setTimeout(() => {
        scene.playerBullets.push(new PlayerBullet(bulletX, bulletY, direction, scene));
      }, 100);
    }
    this.shootCooldown = 30;
  }
}

// === Draw settings overlay ===
function drawSettings() {
  push();
  tint(255, 160);  
  image(coverImg, 0, 0, 800, 600);   
  pop();  
  
  image(settingTitleImg, width / 2 - 200, 20, 400, 115);

  image(buttonImg, width / 2 - 100, 110, 200, 115);
  textSize(24);
  text("Volume", width / 2, 150);
  text(volume, width / 2, 180);
  image(emptyButtonImg2, width / 2 - 70, 170, 30, 30); 
  image(emptyButtonImg2, width / 2 + 40, 170, 30, 30); 
  text("-", width / 2 - 55, 185);
  text("+", width / 2 + 55, 185);
  // Display current key bindings
  let controlLabels = ["Left", "Right", "Attack", "Jump", "Item", "Pause", "Use"];
  let keys = Object.values(controls);
  
  for(let i = 0; i < controlLabels.length; i++){
    let y = 250 + i * 40;
    
    let displayText = changingKey === controlKeys[i] ? "Press any key..." : `${controlLabels[i]}: ${keys[i]}`;
    
    if(changingKey === controlKeys[i]){
      fill(255, 0, 0);
    }
    else{
      fill(0);
    }
    image(buttonImg, width / 2 - 100, y - 15, 200, 30);
    text(displayText, width / 2, y);
    
    

  }
  
  image(settingWordsImg, width / 2 - 250, 500, 500, 80);
}

function mousePressed(){
  if(gameState === "menu"){
    for(let btn of buttons){
      btn.checkClick();
    }
  }
  else if (gameState === "difficultySelect") { 
    for (let btn of difficultyButtons) { 
      btn.checkClick(); 
    }
    backButton.checkClick();
  } 
  else if(gameState === "settings"){
    // Volume control click detection
    if(mouseX > width / 2 - 70 && mouseX < width / 2 - 40 && mouseY > 170 && mouseY < 200){
      volume = max(0, volume - 1);
    }
    if(mouseX > width / 2 + 40 && mouseX < width / 2 + 70 && mouseY > 170 && mouseY < 200){
      volume = min(10, volume + 1);
    }
    // Detect if user clicks on any key setting to change
    let controlLabels = ["Left", "Right", "Attack", "Jump", "Item", "Pause", "Use"];
    for(let i = 0; i < controlLabels.length; i++){
      let y = 250 + i * 40;
      if(mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > y - 15 && mouseY < y + 15){
        changingKey = controlKeys[i];
      }
    }
  }
  
  else if (gameState === "upgrade") {
    for(let btn of upgradeButtons){
      btn.checkClick();
    }
  }

  else if (gameState === "dialog") {
    // Complete typing immediately if clicked before text finishes
    if (!dialogFinishedTyping) {
      dialogTypingText = dialogs[dialogIndex].text;
      dialogTypingIndex = dialogs[dialogIndex].text.length;
      dialogFinishedTyping = true;
      return;
    }
    // Next page button (right triangle)
    if (mouseX > width - 100 && mouseX < width - 50 && mouseY > height - 100 && mouseY < height - 50) {
      if (dialogIndex < dialogs.length - 1) {
        dialogIndex++;
        dialogTypingIndex = 0;
        dialogTypingText = "";
        dialogFinishedTyping = false;
        dialogTypingTimer = 0;
      } else {
        let scene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
        if (scene.bosses && scene.bosses.length > 0) {
          let boss = scene.bosses[0];
          if (boss.dead) {
            boss.dialogFinished = true; 
          }
        }
          gameState = "playing";
        }
      }
      // Previous page button (left triangle)
    if (mouseX > 50 && mouseX < 100 && mouseY > height - 100 && mouseY < height - 50) {
      if (dialogIndex > 0) {
        dialogIndex--;
        dialogTypingIndex = 0;
        dialogTypingText = "";
        dialogFinishedTyping = false;
        dialogTypingTimer = 0;
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    if (gameState === "settings") {
      changingKey = null;
      gameState = previousGameState || "menu";
      return;
    } else if (isChoosingPortal) {
      isChoosingPortal = false;
      return;
    } else if (gameState === "playing" || gameState === "upgrade" || gameState === "dialog") {
      previousGameState = gameState;
      gameState = "settings";
      return;
    }
  }
  // === In settings menu, assign new key ===
  if(gameState === "settings"){
    if(keyCode === ESCAPE){
      changingKey = null;
      gameState = previousGameState || "menu";
    }
    else if(changingKey){
      controls[changingKey] = key.toUpperCase();
      changingKey = null;
    }
  }
  // === In portal selection menu ===
  else if(isChoosingPortal){
    if(keyCode === 87){
      selectedPortalIndex = (selectedPortalIndex - 1 + unlockedPortals.length) % unlockedPortals.length;
    }
    else if(keyCode === 83){
      selectedPortalIndex = (selectedPortalIndex + 1) % unlockedPortals.length;
    }
    else if(keyCode === controls.use.charCodeAt(0)){
      teleport(unlockedPortals[selectedPortalIndex]);
      isChoosingPortal = false;
    }
    else if(keyCode === ESCAPE){
      isChoosingPortal = false;
    }
  }
  // === Interact with switches ===
  else if (keyCode === controls.use.charCodeAt(0)) {
    let scene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
    for (let s of scene.switches) {
      s.activate(); 
    }
  }
  // === Jump input ===
  else if(keyCode === controls.jump.charCodeAt(0)){
      if(player.onGround){
        player.velocityY = player.jumpPower;
        player.onGround = false;
        player.hasDoubleJumped = false;
        jumpSound.setVolume(volume / 10);
        jumpSound.play();
      }
      else if(buffLevel >= 2 && !player.hasDoubleJumped){
        player.velocityY = player.jumpPower * 0.9;
        player.hasDoubleJumped = true;
        jumpSound.setVolume(volume / 10);
        jumpSound.play();
      }
    }
  // === Attack (shooting) input ===
  else if(keyCode === controls.attack.charCodeAt(0)){
    player.tryShoot();
  }
  // === Handle boss ending choice after death ===
  else if(gameState === "playing"){
    let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
    let boss = currentScene.bosses && currentScene.bosses[0];

    if (boss && boss.dead && !boss.choiceMade) {
      if (keyCode === LEFT_ARROW || keyCode === 65) {
        boss.choiceIndex = 0;
      } 
      else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        boss.choiceIndex = 1;
      } 
      else if (keyCode === ENTER || keyCode === RETURN) {
        boss.choiceMade = true;
        if (boss.choiceIndex === 0 && player.hasAntidote) {
          boss.dialogImg = femalecat2Img;
        } 
        else {
          boss.dialogImg = femalecat3Img;
        }
      }
    }
  }
}

// === Button Class ===
// Represents an interactive clickable button (used in menus)
class Button{
  constructor(x, y, label, action){
    this.x = x;
    this.y = y;
    this.label = label;
    this.action = action;
    this.w = 200;
    this.h = 50;
    this.defaultColor = color(200);
    this.hoverColor = color(150);
    this.currentColor = this.defaultColor;
  }
  
  display(){
    if(this.isHovered()){
      this.currentColor = this.hoverColor;
    }
    else{
      this.currentColor = this.defaultColor;
    }
    
    fill(this.currentColor);
    image(buttonImg, this.x, this.y, this.w, this.h);
    
    fill(0);
    textSize(24);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }
  // Check if mouse is currently over this button
  isHovered(){
    return mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h;
  }
  // Execute the button's action if clicked
  checkClick(){
    if (this.isHovered()) {
      mouseClickSound.setVolume(volume / 10);
      mouseClickSound.play();
      this.action();
    }
  }
}

// === Enemy Class ===
// Represents a simple patrolling enemy that damages the player on contact
class Enemy{
  constructor(x, y, w, h, speed, minX, maxX, scene){
    this.x = x;
    this.y = y + 12;
    this.w = w;
    this.h = h;
    this.baseSpeed = speed;
    this.minX = minX;
    this.maxX = maxX;
    this.direction = 1;
    this.scene = scene;
    this.dead = false;
  }
  
  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }

    if(this.dead){
      return;
    }
    // Adjust speed based on difficulty
    if (difficulty === "easy") {
      this.speed = this.baseSpeed * 0.5; 
    } else {
      this.speed = this.baseSpeed; 
    }
    
    this.x += this.speed * this.direction;
    // Reverse direction at patrol boundaries
    if(this.x >= this.maxX || this.x <= this.minX){
      this.direction *= -1;
    }

    if(this.isCollidingWithPlayer()){
      respawnPlayer();
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene) || this.dead){
      return;
    } 
    push();
    if(this.direction < 0){
      image(monsterImg1, this.x, this.y, this.w, this.h);
    }
    else{
      translate(this.x + this.w, this.y);
      scale(-1, 1);
      image(monsterImg1, 0, 0, this.w, this.h);
    }
    pop();
  }
  // Axis-aligned bounding box collision with player
  isCollidingWithPlayer(){
    return(player.x < this.x + this.w && player.x + player.w > this.x &&
           player.y < this.y + this.h && player.y + player.h > this.y);
  }

  reset(){
    this.dead = false;
  }
}

// === Load the next scene or hidden scene ===
function setupNextScene(){
  if(inHiddenScene){
    console.log(`Switch to Hidden Scene ${hiddenSceneIndex}`);
    // Re-assign chasing spikes to the current scene index
    for (let cs of hiddenScenes[hiddenSceneIndex].chasingSpikes) {
      cs.sceneIndex = hiddenSceneIndex; 
    }
    
    console.log("Hidden Scene Platforms:", hiddenScenes[hiddenSceneIndex].platforms.map(p => p.x));
  }
  else{
    console.log(`Switch to Scene ${sceneIndex}`);
    
    console.log("Main Scene Platforms:", scenes[sceneIndex].platforms.map(p => p.x));
  }
  
}

// === Scene Class ===
// Represents one game scene (or map section) containing all elements within it
class Scene{
  constructor(){
    this.platforms = [];
    this.coins = [];
    this.spikes = [];
    this.enemies = [];
    this.portals = [];
    this.turrets = [];
    this.bullets = [];
    this.playerBullets = [];
    this.cliffs = [];
    this.breakableBlocks = [];
    this.pipes = [];
    this.movablePlatforms = [];
    this.gates = [];
    this.finalGates = [];
    this.switches = [];
    this.chasingSpikes = [];
    this.wizards = [];
    this.antidotes = [];
    this.endSwitches = [];
    this.hiddenBlocks = [];
    this.billBoards = [];
    this.clouds = [];
    this.bossGates = [];
    this.bosses = [];
  }
  // === Methods to add elements ===
  addPlatform(x, y, size, hasCoin = true){
    let exists = this.platforms.some(p => p.x === x && p.y === y);
  if (exists) {
    console.warn(`⚠️ Duplicate Platform at (${x}, ${y}) in hidden scene!`);
  }
    this.platforms.push(new Platform(x, y, size, hasCoin, this));
    
  }
  
  addCoin(x, y, hasGravity = true){
    this.coins.push(new Coin(x, y, hasGravity, this));
  }
  
  addSpike(x, y, w){
    this.spikes.push(new Spike(x, y, w, this));
  }
  
  addEnemy(x, y, w, h, speed, minX, maxX){
    this.enemies.push(new Enemy(x, y, w, h, speed, minX, maxX, this));
  }
  
  addPortal(x, y, sceneType, sceneIndex){
    let portal = new Portal(x, y, sceneType, sceneIndex, this);
    this.portals.push(portal);
    return portal;
  }
  
  addTurret(x, y){
    this.turrets.push(new Turret(x, y, this));
  }
  
  addBullet(x, y, speed){
    this.bullets.push(new Bullet(x, y, speed, this));
  }
  
  addCliff(startX, endX){
    this.cliffs.push({ startX, endX });
  }
  
  addBreakableBlock(x, y, size){
    let block = new BreakableBlock(x, y, size,blockImage2, this);
    this.breakableBlocks.push(block);
  }
  
  addPipe(x, y, w, h){
    this.pipes.push(new Pipe(x, y, w, h, this));
  }
  
  addMovablePlatform(startX, startY, endX, endY, size, speed){
    this.movablePlatforms.push(new MovablePlatform(startX, startY, endX, endY, size, speed, this));
  }
  
  addGate(x){
    this.gates.push(new Gate(x, this));
  }
  
  addFinalGate(x){
    this.finalGates.push(new FinalGate(x, this));
  }

  addSwitch(x, y){
    this.switches.push(new Switch(x, y, this));
  }
  
  addChasingSpike(){
    this.chasingSpikes.push(new ChasingSpike(this));
  }

  addWizard(x, y){
    this.wizards.push(new Wizard(x, y, this));
  }

  addEndSwitch(x, y){
    this.endSwitches.push(new EndSwitch(x, y, this));
  }

  addHiddenBlock(x, y, size){
    this.hiddenBlocks.push(new HiddenBlock(x, y, size, this));
  }

  addBillBoard(x, y){
    this.billBoards.push(new Billboard(x, y, this));
  }

  addBossGate(x){
    this.bossGates.push(new BossGate(x, this));
  }

  addBoss(x, y){
    this.bosses.push(new Boss(x, y, this));
  }
  
  update(){
    for(let platform of this.platforms) platform.update();
    for(let coin of this.coins) coin.update();
    for(let spike of this.spikes) spike.update();
    for(let enemy of this.enemies) enemy.update();
    for(let portal of this.portals) portal.update();
    for(let turret of this.turrets) turret.update();
    for(let bullet of this.bullets) bullet.update();
    for(let block of this.breakableBlocks) block.update();
    for(let pipe of this.pipes) pipe.update();
    for (let movablePlatform of this.movablePlatforms) movablePlatform.update();
    for (let gate of this.gates) gate.update();
    for (let finalGate of this.finalGates) finalGate.update();
    for (let s of this.switches) s.update();
    for(let w of this.wizards) w.update();
    for(let antidote of this.antidotes) antidote.update();
    for(let es of this.endSwitches) es.update();
    for(let h of this.hiddenBlocks) h.update();
    for(let bb of this.billBoards) bb.update();
    for(let cloud of this.clouds) cloud.update();
    for(let g of this.bossGates) g.update();
    for(let boss of this.bosses) boss.update();
      
  
    }
  
  display(){
    for(let platform of this.platforms) platform.display();
    for(let coin of this.coins) coin.display();
    for(let spike of this.spikes) spike.display();
    for(let enemy of this.enemies) enemy.display();
    for(let portal of this.portals) portal.display();
    for(let turret of this.turrets) turret.display();
    for(let bullet of this.bullets) bullet.display();
    for(let block of this.breakableBlocks) block.display();
    for(let pipe of this.pipes) pipe.display();
    for (let movablePlatform of this.movablePlatforms) movablePlatform.display();

    for (let gate of this.gates) gate.display();
    for (let finalGate of this.finalGates) finalGate.display();
    for (let s of this.switches) s.display();
    for(let w of this.wizards) w.display();
    for(let antidote of this.antidotes) antidote.display();
    for(let es of this.endSwitches) es.display();
    for(let h of this.hiddenBlocks) h.display();
    for(let bb of this.billBoards) bb.display();
    for(let cloud of this.clouds) cloud.display();
    for(let g of this.bossGates) g.display();
    for(let boss of this.bosses) boss.display();
  }
}

// === Turret Class ===
// Stationary enemy that periodically fires bullets downward
class Turret{
  constructor(x, y, scene){
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.fireRate = 60;
    this.timer = 0;
    this.w = 30;
    this.h = 30;
  }
  
  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    this.timer++;
    // Shoot a bullet every `fireRate` frames
    if(this.timer >= this.fireRate){
      this.scene.bullets.push(new Bullet(this.x + 10, this.y, -2, this.scene));
      this.timer = 0;
    }
    
    if(this.isCollidingWithPlayer()){
      respawnPlayer();
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    image(turretImg, this.x, this.y, this.w, this.h);
  }
  
  isCollidingWithPlayer(){
    return(player.x < this.x + 20 && player.x + player.w > this.x &&
           player.y < this.y + 20 && player.y + player.h > this.y);
  }
}

// === Bullet Class ===
// Projectile fired by turrets, falls vertically
class Bullet{
  constructor(x, y, speed, scene){
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.baseSpeed = speed;
    this.size = 10;
  }
  
  update(){
    // Adjust speed based on difficulty
    if (difficulty === "easy") {
      this.speed = this.baseSpeed * 2; 
    } else {
      this.speed = this.baseSpeed; 
    }
    
    this.y += this.speed;
    // Remove bullet if it goes off-screen
    if(this.y < 0){
      let index = this.scene.bullets.indexOf(this);
      if (index > -1) {
        this.scene.bullets.splice(index, 1);
      }
    }

    if(!isInCurrentScene(this.scene)){
      return;
    }
    
    if(this.isCollidingWithPlayer()){
      respawnPlayer();
    }
  }
  
  display(){
    image(bulletImg, this.x, this.y, this.size, this.size);
  }
  
  isCollidingWithPlayer(){
    return(player.x < this.x + this.size && player.x + player.w > this.x &&
           player.y < this.y + this.size && player.y + player.h > this.y);
  }
}

// === PlayerBullet Class ===
// Bullet fired by the player, damages enemies and bosses
class PlayerBullet{
  constructor(x, y, direction, scene){
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 10;
    this.speed = 5;
    this.direction = direction;// 1 = right, -1 = left
    this.distanceTraveled = 0;
    this.maxDistance = 200;// Bullet disappears after this
    this.scene = scene;
    this.active = true;
  }

  update(){
    if(!isInCurrentScene(this.scene) || !this.active){
      return;
    }
    this.x += this.speed * this.direction;
    this.distanceTraveled += Math.abs(this.speed);

    const scene = this.scene;
    // Check collision with solid objects (walls, pipes, platforms, etc.)
    const allSolids = [...scene.platforms, ...scene.pipes, ...scene.breakableBlocks, ...scene.movablePlatforms, ...scene.hiddenBlocks];
    for(let solid of allSolids){
      if(
        this.x + this.w > solid.x && this.x < solid.x + (solid.w || solid.size) &&
        this.y + this.h > solid.y && this.y < solid.y + (solid.h || solid.size)){
          this.active = false;
          return;
        }
    }
    // Hit enemies
    for(let enemy of scene.enemies){
      if (!enemy.dead) {
        if (
          this.x + this.w > enemy.x && this.x < enemy.x + enemy.w &&
          this.y + this.h > enemy.y && this.y < enemy.y + enemy.h
        ) {
          enemy.dead = true;
          mosterDieSound.setVolume(volume / 10);
          mosterDieSound.play();
          this.active = false;
          return;
        }
      }
    }

    if(this.distanceTraveled > this.maxDistance){
      this.active = false;
    }
    // Hit boss
    if(scene.bosses && scene.bosses.length &&
       this.x + this.w > scene.bosses[0].x && this.x < scene.bosses[0].x + scene.bosses[0].w &&
       this.y + this.h > scene.bosses[0].y && this.y < scene.bosses[0].y + scene.bosses[0].h
    ){
      scene.bosses[0].hp--;
      this.active = false;
      return;
    }
  }

  display(){
    if(!isInCurrentScene(this.scene) || !this.active){
      return;
    }
    image(bulletImg, this.x, this.y, this.w, this.h);
  }
}

// === BreakableBlock Class ===
// A destructible block that disappears when hit from below
class BreakableBlock{
  constructor(x, y, size, image, scene){
    this.x = x;
    this.y = y + 14 ;
    this.size = size;
    this.image = image;
    this.exists = true;
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    if(!this.exists) return;
    
    if (player.x + player.w > this.x && player.x < this.x + this.size &&
        player.y < this.y + this.size && player.prevY >= this.y + this.size &&
        player.velocityY < 0) {
      player.y = this.y + this.size;
      this.exists = false;
      player.velocityY = 0;
      return;
    }
    // Handle left/right collisions to prevent passing through
    if (player.y + player.h > this.y && player.y < this.y + this.size) {
     
      let nextX = player.x + player.velocityX; 
      if (player.velocityX > 0 && player.prevX + player.w <= this.x && nextX + player.w > this.x) {
        player.x = this.x - player.w;
        player.velocityX = 0;
      }
      if (player.velocityX < 0 && player.prevX >= this.x + this.size && nextX < this.x + this.size) {
        player.x = this.x + this.size;
        player.velocityX = 0;
      }
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    if(!this.exists) return;
    
    if(this.image){
      image(this.image, this.x,this.y,this.size, this.size);
    }else{
    
    fill(150, 75, 0);
    rect(this.x, this.y, this.size, this.size);
    }
  }
}

// === checkFallDeath ===
// Called every frame to check if the player should fall or die by falling off-screen.
function checkFallDeath(){
  let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
  let isOverCliff = false;
  for(let cliff of currentScene.cliffs){
    if(player.x > cliff.startX && player.x + player.w < cliff.endX){
      isOverCliff = true;
      break;
    }
  }
  // If on ground but above a cliff, start falling
  if(isOverCliff && player.onGround){
    player.onGround =  false;
    player.velocityY = 0;
  }
  
  if(player.y > height - groundHeight + player.h){
    respawnPlayer();
  }
}

// === isPlayerOverCliff ===
// Returns true if the player is over a defined cliff region (no floor).
function isPlayerOverCliff(){
  let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];
  
  for(let cliff of currentScene.cliffs){
    if(player.x > cliff.startX && player.x + player.w < cliff.endX + player.speed){
      return true;
    }
  }
  return false;
}

// === Pipe ===
// Special pipe object the player can stand on or use to enter a hidden level.
class Pipe{
  constructor(x, y, w, h, scene){
    this.x = x;
    this.y = y + 14;
    this.w = w;
    this.h = h;
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    // Standing on top of pipe
    if(player.x + player.w > this.x && player.x < this.x + this.w &&
       player.y + player.h >= this.y && player.y + player.h - player.velocityY < this.y + 5 &&
       player.velocityY > 0){
      player.y = this.y - player.h;
      player.velocityY = 0;
      player.onGround = true;
    }
    // Left-right wall collision with pipe sides
    if(player.y + player.h > this.y && player.y < this.y + this.h){
      if (player.x + player.w > this.x && player.x < this.x + this.w / 2) {
        player.x = this.x - player.w; 
      } else if (player.x < this.x + this.w && player.x + player.w > this.x + this.w / 2) {
        player.x = this.x + this.w; 
      }
    }
    // Enter hidden level by pressing the "use" key on top of the pipe
    if(player.y + player.h === this.y && keyIsDown(controls.use.charCodeAt(0))){
      enterHiddenLevel();
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    image(pipeImg, this.x, this.y, this.w, this.h);
  }
}

// === enterHiddenLevel ===
// Transitions the player into the hidden scene and triggers dialog if first time.
function enterHiddenLevel(){
  inHiddenScene = true;
  hiddenSceneIndex = 0;
  player.x = 50;
  player.y = height - groundHeight - player.h;

  if (!window.hasTriggeredHiddenDialog) {
    // Show hidden intro dialog only once
    window.hasTriggeredHiddenDialog = true;
    dialogIndex = 0;
    dialogTypingIndex = 0;
    dialogTypingText = "";
    dialogFinishedTyping = false;
    gameState = "dialog";
  } else {
    gameState = "playing";
  }
  
  setupNextScene();
}

// === MovablePlatform ===
// A platform that starts moving when the player approaches it and travels to a set destination.
class MovablePlatform{
  constructor(startX, startY, endX, endY, size, speed = 5, scene){
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.size = size;
    this.w = size;
    this.speed = speed;
    this.moving = false;
    this.reachedDestination = false;
    this.reset();
    this.scene = scene;
  }
  
  update(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    // Start moving if player gets close
    if(!this.moving && dist(player.x + player.w / 2, player.y + player.h / 2, this.startX + this.size / 2, this.startY + this.size / 2) < 70){
      this.moving = true;
    }
    // Horizontal and vertical collision handling
    // [Similar to regular platforms]
    // Top collision: stand on it
    if (player.y + player.h > this.y && player.y < this.y + this.size) {
      
      let nextX = player.x + player.velocityX; 
      if (player.velocityX > 0 && player.prevX + player.w <= this.x && nextX + player.w > this.x) {
        player.x = this.x - player.w;
        player.velocityX = 0;
      }
     
      if (player.velocityX < 0 && player.prevX >= this.x + this.size && nextX < this.x + this.size) {
        player.x = this.x + this.size;
        player.velocityX = 0;
      }
    }
    
    if (player.x + player.w > this.x && player.x < this.x + this.size &&
        player.y < this.y + this.size && player.prevY >= this.y + this.size &&
        player.velocityY < 0) {
      player.y = this.y + this.size;
      player.velocityY = 0;
      
      return; 
    }
    
    if (player.x + player.w > this.x && player.x < this.x + this.size &&
        player.y + player.h > this.y && player.prevY + player.h <= this.y &&
        player.velocityY > 0) {
      player.y = this.y - player.h;
      player.velocityY = 0;
      player.onGround = true;
      return;
    }
    
    if(this.moving && !this.reachedDestination){
      let dx = this.endX - this.x;
      let dy = this.endY - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if(distance > this.speed){
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
      else{
        this.x = this.endX;
        this.y = this.endY;
        this.reachedDestination = true;
      }
    }
  }
  
  display(){
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    image(blockImage, this.x, this.y, this.size, this.size);
  }
  
  reset() {
    console.log("Resetting platform to", this.startX, this.startY);
    this.x = this.startX;
    this.y = this.startY;
    this.moving = false;
    this.reachedDestination = false;
  }
}

// === Gate ===
// A vertical obstacle that blocks the player unless opened.
class Gate{
  constructor(x, scene) {
    this.x = x;
    this.y = 0;
    this.w = 30;
    this.h = height - groundHeight + 14;
    this.open = false;
    this.scene = scene;
  }
  
  update() {
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    if (this.open) return;
    // Push player back if colliding while gate is closed
    if (
      player.x + player.w > this.x &&
      player.x < this.x + this.w &&
      player.y + player.h > this.y &&
      player.y < this.y + this.h
    ) {
      player.x = this.x - player.w;
      player.velocityX = 0;
    }
  }

  display() {
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    push();
    if(this.open){
      tint(255, 80);
    }
    else{
      noTint();
    }
    image(hiddenDoorImg, this.x, this.y, this.w, this.h);
    pop();
  }
  
  reset() {
    this.open = false; 
  }
}

// === FinalGate ===
// Locks behind the player after they pass, prevents return
class FinalGate{
  constructor(x, scene){
    this.x = x;
    this.y = 0;
    this.w = 30;
    this.h = height - groundHeight + 14;
    this.closed = false;
    this.scene = scene;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
  
    // Auto-closes after player passes it
    if(!this.closed &&
       player.x > this.x + this.w &&
       player.y + player.h > this.y && player.y < this.y + this.h
    ){
      this.closed = true;
    }

    // If closed and player tries to go back, block them
    if(this.closed &&
       player.x < this.x + this.w &&
       player.y + player.h > this.y && player.y < this.y + this.h
    ){
      player.x = this.x + this.w;
      player.velocityX = 0;
    }
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    push();
    if(!this.closed){
      tint(255, 80);
    }
    else{
      noTint();
    }
    image(hiddenDoorImg, this.x, this.y, this.w, this.h);
    pop();
  }

  reset(){
    this.closed = false;
  }
}

// === Switch ===
// A small switch that the player can activate by pressing 'E' when close.
// When activated, it opens gates and starts chasing spikes in the hidden scene.
class Switch {
  constructor(x, y, scene) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.activated = false;
    this.nearPlayer = false;
    this.scene = scene;
  }

  update() {
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    this.nearPlayer = (
      player.x + player.w > this.x &&
      player.x < this.x + this.w &&
      player.y + player.h > this.y &&
      player.y < this.y + this.h
    );
  }

  display() {
    if (!isInCurrentScene(this.scene)){
      return;
    } 
    image(switchImg, this.x, this.y, this.w, this.h);
    if (this.nearPlayer && !this.activated) {
      fill("white");
      textSize(16);
      text("Press E Open Challenge", this.x + 30, this.y - 10);
    }
  }
  
  reset() {
    this.activated = false; 
  }
  
  activate() {
    // Only activate if player is near and hasn't already activated it
    if (this.nearPlayer && !this.activated) {
      this.activated = true;
      console.log("Switch activated! Gate opening...");

      
      for (let g of hiddenScenes[hiddenSceneIndex].gates) {
        g.open = true;
      }

      for (let cs of hiddenScenes[hiddenSceneIndex].chasingSpikes) {
        cs.start();  
      }
    }
  }
}

// === ChasingSpike ===
// A giant wall-like spike that moves from left to right once triggered, forcing the player to run.
class ChasingSpike {
  constructor(scene) {
    this.x = -30;
    this.y = 0;
    this.w = 30;
    this.h = height - groundHeight;
    this.speed = 2;
    this.active = false;
    this.sceneIndex = 0;
    this.startFrame = frameCount; 
    this.scene = scene;
  }

  update() {
    if (!this.active) return;
    
    if(difficulty === "easy"){
      this.speed = 1.5;
    }
    if(difficulty === "hard"){
      this.speed = 2;
    }

    let elapsedFrames = frameCount - this.startFrame;
    this.x = elapsedFrames * this.speed - this.w;

    this.sceneIndex = Math.floor(this.x / width);

    if (this.sceneIndex === hiddenSceneIndex) {
      let relativeX = this.x - this.sceneIndex * width; 
      if (
        player.x < relativeX + this.w &&
        player.x + player.w > relativeX &&
        player.y < this.y + this.h &&
        player.y + player.h > this.y
      ) {
        respawnPlayer();
      }
    }

    let fg = hiddenScenes[2].finalGates[0];
    let relativeX = this.x - 2 * width;
    if(fg && relativeX + this.w >= fg.x){
      this.active = false;
    }
  }

  display() {
    if (!this.active) return;
    if (this.sceneIndex !== hiddenSceneIndex) return;
    image(chasingSpikesImage, this.x - this.sceneIndex * width, this.y, this.w, this.h);
  }
  
  reset() {
    this.x = -30;
    this.sceneIndex = 0;
    this.active = false;
    this.startFrame = frameCount; 
  }
  
  start() {
    if (!this.active) {
      this.active = true;
      this.startFrame = frameCount; 
    }
  }
}

// === upgradeButton ===
// A large button used in the upgrade selection screen.
// Inherits behavior from Button.
class upgradeButton extends Button {
  constructor(x, y, label, action) {
    super(x, y, label, action);
    this.w = 300; 
    this.h = 450; 
  }
}

// === Wizard ===
// A friendly NPC that gives the player an antidote after some dialog.
// Interacted with using the 'E' key. Shows messages based on stage.
class Wizard{
  constructor(x, y, scene){
    this.x = x;
    this.y = y + 14;
    this.w = 25;
    this.h = 40;
    this.scene = scene;
    this.stage = 0;// Tracks progress in conversation
    this.cooldown = 0;
    this.dialog = "";
    this.antidote = null;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    if(dist(player.x + player.w / 2, player.y + player.h / 2, this.x + this.w / 2, this.y + this.h / 2) < 50){
      if(keyIsDown(controls.use.charCodeAt(0)) && this.cooldown === 0){
        this.stage++;
        if(this.stage === 1){
          this.dialog = "Congratulations!";
        }
        else if(this.stage === 2){
          this.dialog = "Here is the antidote.";
          if(!this.antidote){
            this.antidote = new Antidote(this.x + 15, this.y + this.h - 10, this.scene);
            this.scene.antidotes.push(this.antidote);
          }
        }
        else{
          this.dialog = "Go save her.";
        }
        this.cooldown = 20;
      }
    }

    if(this.cooldown > 0){
      this.cooldown--;
    }
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    image(witchImg, this.x, this.y, this.w, this.h);

    if(dist(player.x + player.w / 2, player.y + player.h / 2, this.x + this.w / 2, this.y + this.h / 2) < 50){
      fill("white");
      textSize(16);
      text("Press E", this.x + 10, this.y - 20);
    }

    if(this.dialog){
      fill("white");
      textSize(20);
      text(this.dialog, this.x + 10, this.y - 40);
    }
  }

  reset(){
    this.stage = 0;
    this.cooldown = 0;
    this.dialog = "";
    this.antidote = null;
  }
}

// === Antidote ===
// A collectible item that grants the player the "antidote" needed for the good ending.
class Antidote{
  constructor(x, y, scene){
    this.x = x;
    this.y = y;
    this.size = 20;
    this.collected = false;
    this.scene = scene;
  }

  update(){
    if(!isInCurrentScene(this.scene) || this.collected){
      return;
    }

    if(player.x + player.w > this.x && player.x < this.x + this.size &&
       player.y + player.h > this.y && player.y < this.y + this.size
    ){
      this.collected = true;
      player.hasAntidote = true;
      antidoteSound.setVolume(volume / 10);
      antidoteSound.play();
      console.log("Antidote collected!");
    }
  }

  display(){
    if(!isInCurrentScene(this.scene) || this.collected){
      return;
    }
    image(potionImg, this.x, this.y, this.size, this.size);
  }
}

// === EndSwitch ===
// A one-time use switch that teleports the player back to the main level (scene 1).
class EndSwitch{
  constructor(x, y, scene){
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.activated = false;
    this.scene = scene;
    this.nearPlayer = false;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    this.nearPlayer = (player.x + player.w > this.x && player.x < this.x + this.w &&
       player.y + player.h > this.y && player.y < this.y + this.h
    );

    if(this.nearPlayer && !this.activated && keyIsDown(controls.use.charCodeAt(0))){
      this.activated = true;
      inHiddenScene = false;
      sceneIndex = 1;
      setupNextScene();
      player.x = 650 + 10;
      player.y = height - groundHeight - 110 - player.h;
      player.velocityX = 0;
      player.velocityY = 0;
    }
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    image(switchImg, this.x, this.y, this.w, this.h);
    if(this.nearPlayer && !this.activated){
      fill("white");
      textSize(16);
      text("Press E to back", this.x + this.w / 2, this.y - 10);
    }
  }

  reset(){
    this.activated = false;
  }
}

// === HiddenBlock ===
// A platform that's invisible until the player gets close to it (unless on easy mode).
class HiddenBlock{
  constructor(x, y, size, scene){
    this.x = x;
    this.y = y;
    this.size = size;
    this.scene = scene;
    this.hasCoin = false;
    this.visible = false;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    // Reveal the block if the player gets close
    if(difficulty === "easy" && !this.visible){
      this.visible = true;
    }
    if(difficulty === "hard"){
      this.visible = dist(player.x + player.w / 2, player.y + player.h / 2, this.x + this.size / 2, this.y + this.size / 2) < 50;
    }

    if(!this.visible){
      return;
    }
    let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];

    if(player.y + player.h > this.y && player.y < this.y + this.size){
      let nextX = player.x + player.velocityX;
      if(player.velocityX > 0 && player.prevX + player.w <= this.x + 1 && nextX + player.w > this.x){
        player.x = this.x - player.w;
        player.velocityX = 0;
      }
      if(player.velocityX < 0 && player.prevX >= this.x + this.size - 1 && nextX < this.x + this.size){
        player.x = this.x + this.size;
        player.velocityX = 0;
      }
    }
    if(player.x + player.w > this.x && player.x < this.x + this.size &&
       player.y < this.y + this.size && player.prevY >= this.y + this.size &&
       player.velocityY < 0
      ){
        player.y = this.y + this.size;
        player.velocityY = 0;
        return;
      }

      if(player.x + player.w > this.x && player.x < this.x + this.size &&
         player.y + player.h > this.y && player.prevY + player.h <= this.y &&
         player.velocityY > 0
      ){
        player.y = this.y - player.h;
        player.velocityY = 0;
        player.onGround = true;
        return;
      }
  }

  display(){
    if(!isInCurrentScene(this.scene) || !this.visible){
      return;
    }
    image(blockImage, this.x, this.y, this.size, this.size);
  }
}

// === Billboard ===
// A wide platform/obstacle shaped like a billboard. It blocks player movement like a pipe.
class Billboard{
  constructor(x, y, scene){
    this.x = x;
    this.y = y + 14;
    this.w = 230;
    this.h = 100;
    this.scene = scene;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    let currentScene = inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex];

    if(player.y + player.h > this.y && player.y < this.y + this.h){
      let nextX = player.x + player.velocityX;
      if(player.velocityX > 0 && player.prevX + player.w <= this.x + 1 && nextX + player.w > this.x){
        player.x = this.x - player.w;
        player.velocityX = 0;
      }
      if(player.velocityX < 0 && player.prevX >= this.x + this.w - 1 && nextX < this.x + this.w){
        player.x = this.x + this.w;
        player.velocityX = 0;
      }
    }

    if(player.x + player.w > this.x && player.x < this.x + this.w &&
       player.y < this.y + this.h && player.prevY >= this.y + this.h &&
       player.velocityY < 0
    ){
      player.y = this.y + this.h;
      player.velocityY = 0;
      return;
    }

    if(player.x + player.w > this.x && player.x < this.x + this.w &&
       player.y + player.h > this.y && player.prevY + player.h <= this.y &&
       player.velocityY > 0
    ){
      player.y = this.y - player.h;
      player.velocityY = 0;
      player.onGround = true;
      return;
    }
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    image(signBoardImg, this.x, this.y, this.w, this.h);
  }
}

// === Cloud ===
// A neutral-looking object that becomes dangerous if the player gets close.
// On easy mode, it starts dangerous by default.
class Cloud{
  constructor(x, y, w, h, scene){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.scene = scene;
    this.dangerous = false;
    this.activationDistance = 180;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y - player.h / 2;
    const cloudCenterX = this.x + this.w / 2;
    const cloudCenterY = this.y - this.h / 2;

    // Become dangerous if player gets close
    if(difficulty === "easy" && !this.dangerous){
      this.dangerous = true;
    }
    if(difficulty === "hard"){
      this.dangerous = dist(playerCenterX, playerCenterY, cloudCenterX, cloudCenterY) < this.activationDistance;
    }
    
    if(this.dangerous && this.collidesWithPlayer()){
      respawnPlayer();
    }
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }

    if(this.dangerous){
      image(cloudStingImg, this.x, this.y, this.w, this.h);
    }
    else{
      image(cloudImg, this.x, this.y, this.w, this.h);
    }
  }

  collidesWithPlayer(){
    return(
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y > this.y - this.h &&
      player.y - player.h < this.y
    );
  }
}

// === BossGate ===
// A gate at the end of a scene that requires player confirmation (E key) to enter the boss area.
class BossGate{
  constructor(x, scene){
    this.x = x;
    this.y = 0;
    this.w = 30;
    this.h = height - groundHeight + 14;
    this.unlocked = false;
    this.scene = scene;
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }

    if(
      player.x + player.w > this.x - 5 &&
      player.x < this.x + this.w &&
      player.y + player.h > this.y &&
      player.y < this.y + this.h
    ){
      if(!this.unlocked){
        fill("white");
        textSize(16);
        text("Press E to Enter Boss Room", this.x - 100, 100);
        if(keyIsDown(controls.use.charCodeAt(0))){
          this.unlocked = true;
        }
        else{
          player.x = this.x - player.w;
          player.velocityX = 0;
        }
      }
    }
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }

    push();
    if(this.unlocked){
      tint(255, 80);
    }
    else{
      noTint();
    }
    image(hiddenDoorImg, this.x, this.y, this.w, this.h);
    pop();
  }
}

class Boss{
  constructor(x, y, scene){
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 180;
    this.scene = scene;
    this.hp = 50;
    this.maxHp = 50;
    this.phase = 0;
    this.attackTimer = 0;
    this.shotCount = 0;
    this.shotType = 1;
    this.lastAttackTime = frameCount;
    this.lastHpTrigger = this.hp;
    this.dead = false;
    this.dialogVisible = false;
    this.dialogStage = 0;
    this.dialogImg = null;
    this.dialogFinished = false;
    this.choiceIndex = 0;
    this.choiceMade = false;
    this.deathGif = null;
    this.deathGifDone = false;
    this.deathGifStartTime = null;
    this.currentGif = null;
    this.showingDeathGif = false;
    this.deathDialogTriggered = false;
    if(!this.scene.turrets){
      this.scene.turrets = [];
    }
    if(!this.scene.bullets){
      this.scene.bullets = [];
    }
    if(!this.scene.enemies){
      this.scene.enemies = [];
    }
  }

  update(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    if(this.dead){
      return;
    }
    // Check if enough HP dropped or time passed to trigger a new attack
    // if(difficulty === "easy"){
    //   this.hp = 30;
    //   this.maxHp = 30;
    //   this.lastHpTrigger = this.hp;
    // }
    // if(difficulty === "hard"){
    //   this.hp = 50;
    //   this.maxHp = 50;
    //   this.lastHpTrigger = this.hp;
    // }
    const hpDrop = this.lastHpTrigger - this.hp;
    const timePassed = frameCount - this.lastAttackTime;

    if((hpDrop >= 10 || timePassed >= 180) && this.phase === 0){
      this.chooseRandomAttack();
      this.lastHpTrigger = this.hp;
      this.lastAttackTime = frameCount;
    }

    if (this.hp <= 0 && !this.showingDeathGif) {
      this.dead = true;
      this.showingDeathGif = true;
      this.deathGifStartTime = millis();
      this.currentGif = player.hasAntidote ? bossToCatGif : bossToDeadCatGif;
      return;
    }
    // Execute current phase logic
    if(this.phase === 1) this.handleTurretPhase();
    if(this.phase === 2) this.handleRadialAttack();
    if(this.phase === 3) this.handleSummonEnemies();
  }

  display(){
    if(!isInCurrentScene(this.scene)){
      return;
    }
    // If boss is playing death animation
    if (this.showingDeathGif && this.currentGif) {
      let gifW = 100; 
      let gifH = 120;
      image(this.currentGif, this.x + this.w/2 - gifW/2, this.y + 70, gifW, gifH);
      if (millis() - this.deathGifStartTime > 1200 && !this.deathDialogTriggered) {
        dialogs = player.hasAntidote ? [
          { speaker: "Prince", text: "I made it.", bg: maleCatDialogImg },
          { speaker: "Princess", text: "...You really came.", bg: femaleCatDialogImg }
        ] : [
          { speaker: "Princess", text: "...You came. But... too late.", bg: deadCatDialogImg }
        ];
        dialogIndex = 0;
        dialogTypingText = "";
        dialogTypingIndex = 0;
        dialogFinishedTyping = false;
        gameState = "dialog";
        this.deathDialogTriggered = true;
      }

      return;
    }
    
    image(bossImg, this.x, this.y, this.w, this.h);

    push();
    noStroke();
    fill("red");
    rect(100, 500, 600, 20);
    fill("green");
    let healthWidth = map(this.hp, 0, this.maxHp, 0, 600);
    rect(100, 500, healthWidth, 20);
    pop();
  }

  chooseRandomAttack(){
    // Randomly choose next attack phase: 1, 2, or 3
    const choice = floor(random(1, 4));
    this.phase = choice;
    this.attackTimer = 0;
    this.shotCount = 0;
    if(choice === 1) this.spawnTurrets();
  }

  spawnTurrets(){
    // Spawn 8 turrets across the top of the screen
    this.scene.turrets = [];
    for(let i = 0; i < 8; i++){
      let tx = 100 + i * 80;
      this.scene.turrets.push(new Turret(tx, 0, this.scene));
    }
  }

  fireTurretWave(){
    // Alternate odd and even turrets in each wave
    let isOdd = this.shotType % 2 === 1;
    for(let i = 0; i < this.scene.turrets.length; i++){
      if((i % 2 === 1) === isOdd){
        this.scene.bullets.push(new Bullet(this.scene.turrets[i].x + 10, 30, 3, this.scene));
      }
    }
    this.shotCount++;
    if(this.shotCount % 2 === 0) this.shotType++;
  }

  fireRadialBullets(){
    // Fire bullets in 8 directions from center
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [-1, 1], [1, -1], [-1, -1]
    ];
    for(let [dx, dy] of dirs){
      let b = new Bullet(this.x + this.w / 2, this.y + this.h / 2, 0, this.scene);
      b.update = function(){
        this.x += dx * 3;
        this.y += dy * 3;
        if(this.isCollidingWithPlayer()){
          respawnPlayer();
        }
      };
      this.scene.bullets.push(b);
    }
  }

  summonPlatformEnemies(){
    // Summon enemies on unique platform heights
    let seenY = new Set();
    
    for(let p of this.scene.platforms){
      if(!seenY.has(p.y)){
        seenY.add(p.y);
        this.scene.enemies.push(new Enemy(p.x + 5, p.y - 37, 25, 25, 1.5, p.x, p.x + p.size * 4, this.scene));
      }
    }
    // Summon additional enemies on the ground
    for (let i = 0; i < 5; i++) {
      let ex = 100 + i * 120;
      let ey = height - groundHeight - 25;
      this.scene.enemies.push(new Enemy(ex, ey, 25, 25, 2, ex - 40, ex + 40, this.scene));
    }
  }

  handleTurretPhase(){
    // Shoot every 60 frames, two waves of alternating turrets
    this.attackTimer++;
    if(this.attackTimer % 60 === 0 && this.shotCount < 4){
      this.fireTurretWave();
    }
    if(this.shotCount >= 4){
      this.phase = 0;
    }
  }

  handleRadialAttack(){
    // Fire once, then return to idle
    if(this.attackTimer === 0){
      this.fireRadialBullets();
    }
    this.attackTimer++;
    if(this.attackTimer >= 60){
      this.phase = 0;
    }
  }

  handleSummonEnemies(){
    // Spawn enemies once, then return to idle
    if(this.attackTimer === 0){
      this.summonPlatformEnemies();
    }
    this.attackTimer++;
    if(this.attackTimer >= 60){
      this.phase = 0;
    }
  }
}

function isInCurrentScene(scene){
  return scene === (inHiddenScene ? hiddenScenes[hiddenSceneIndex] : scenes[sceneIndex]);
}

function drawUpgrade() {
  background(0, 150); 
  image(upgradeImg, width / 2 - 400, height / 2 - 256, 800, 512);  
  
  let highlightW = 280;
  let highlightH = 40;

  if (upgradeOption === 2) {
    fill(255, 255, 0, 120); 
    rect(70, 330, highlightW, highlightH); 
  }
  if (upgradeOption === 3) {
    fill(255, 255, 0, 120);
    rect(100, 420, highlightW, highlightH);  // Double Jump
  }

  if (upgradeOption === 0) {
    fill(255, 255, 0, 120);
    rect(450, 330, highlightW, highlightH);  // Unlock Shooting
  }
  if (upgradeOption === 1) {
    fill(255, 255, 0, 120);
    rect(700, 420, highlightW, highlightH);  // Double Shot
  }

  let checkW = 25;
  let checkH = 25;

  image(buffLevel >= 1 ? checkboxCheckedImg : checkboxImg, 300, 410, checkW, checkH);  // Grow Up
  image(buffLevel >= 2 ? checkboxCheckedImg : checkboxImg, 300, 465, checkW, checkH);  // Double Jump

  // Weapon Buff
  image(player.weaponLevel >= 1 ? checkboxCheckedImg : checkboxImg, 700, 410, checkW, checkH);  // One Bullet
  image(player.weaponLevel >= 2 ? checkboxCheckedImg : checkboxImg, 700, 465, checkW, checkH);  // Three Bullets

  let gif = player.weaponLevel === 0 ? weaponPreviewGif1 : weaponPreviewGif2;
  image(gif, 500, 195, 160, 120); 
  gif = buffLevel === 0 ? buffPreviewGif1 : buffPreviewGif2;
  image(gif, 90, 195, 160, 120);

  
  fill("white");
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Use A D to select, E to confirm", width / 2, height - 30);
}


function handleUpgradeInput(){
  if(keyIsPressed && key.toUpperCase() === controls.left) upgradeOption = upgradeOption === 0 || upgradeOption === 1 ? (upgradeOption + 2) % 4 : upgradeOption;
  if (keyIsPressed && key.toUpperCase() === controls.right) upgradeOption = upgradeOption === 2 || upgradeOption === 3 ? (upgradeOption + 2) % 4 : upgradeOption;
  
  if(keyIsPressed && key.toUpperCase() === controls.use){
    if(upgradeOption === 0 || upgradeOption === 1){
      if(player.weaponLevel < 2){
        player.weaponLevel++;
      }
    }
    else{
      if(buffLevel < 2){
        buffLevel++;
      }
    }
    gameState = "playing";
  }
}

function preload(){
  bgImage = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/BACKGROUND.JPG");
  blockImage = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/BRICK1.PNG");
  blockImage2 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/BRICK2.PNG");
  groundImage = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/FLOOR.PNG");
  spikeImage = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/SPIKE.PNG");
  portalImgClosed = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/DOOR2.PNG");
  portalImgOpened = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/DOOR1.PNG");
  playerImg1 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/MaleCat1.PNG");
  playerImg2 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/MaleCat2.PNG");
  pipeImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/HollowTree.PNG");
  monsterImg1 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Monster1.png");
  bulletImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Bullet.PNG");
  turretImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Turret.PNG");
  coinImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Can.png");
  coverImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/cover.PNG");
  logo2Img = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/logo2.PNG");
  witchImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Wizard.png");
  potionImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Antidote.png");
  cloudImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Cloud.PNG");
  cloudStingImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Cloud%20%2B%20Sting.PNG");
  signBoardImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Signboard.PNG");
  hiddenDoorImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Hidden%20door.png");
  bossImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Boss.png");
  femalecat1Img = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/FemaleCat1.PNG");
  femalecat2Img = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/FemaleCat2.PNG");
  femalecat3Img = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/FemaleCat3.PNG");
  maleCatDialogImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/MaleCatDialogue.PNG");
  wizardDialogImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/WizardDialogue.PNG");
  triangleNextEnabledImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/triangle1.PNG");
  triangleNextDisabledImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/triangle2.PNG");
  bossAttackGif1 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/BOSS GIF/1.gif");
  bossAttackGif2 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/BOSS GIF/2.gif");
  bossAttackGif3 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/BOSS GIF/3.gif");
  bossToCatGif = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/BossToCat.GIF");
  bossToDeadCatGif = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/BossToDeadCat.GIF");
  femaleCatDialogImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/FemaleCatDialogue.PNG");
  deadCatDialogImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/myfolder/DeadCatDialogue.PNG");
  hiddenImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Hidden/Hidden bg.png");
  switchImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Hidden/Start E button.png");
  chasingSpikesImage = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/chasing.PNG");
  buttonImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Setting UI2/button.png");
  emptyButtonImg2 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/emptyButton-02.png");
  settingTitleImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Setting UI2/settingTitle-03.png");
  settingWordsImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/Setting UI2/word-03.png");
  coinSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/coin.mp3");
  shootSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/shoot.mp3");
  jumpSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/jump.mp3");
  antidoteSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/antidote.mp3");
  playerDieSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/player-die.mp3");
  mosterDieSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/monster-die.mp3");
  mouseClickSound = loadSound("https://raw.githubusercontent.com/Yuki-457/noname/main/sounds/mouse-click.mp3");
  upgradeImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/LEVEL UP-02.png");
  checkboxImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/emptyButton-02.png");
  checkboxCheckedImg = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/打勾按鈕-02.png");
  buffPreviewGif1 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/Buff1.gif"); 
  buffPreviewGif2 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/Buff2.gif");  
  weaponPreviewGif1 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/Weapon1.gif");  
  weaponPreviewGif2 = loadImage("https://raw.githubusercontent.com/Yuki-457/noname/main/images/LEVEL UP/Weapon2.gif");  
}