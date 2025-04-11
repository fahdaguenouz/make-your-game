import { LEVEL,LEVEL2, LEVEL3, OBJECT_TYPE } from './setup.js';
import { randomMovement } from './ghostMoves.js';

import GameBoard from './gameBoard.js';
import Pacman from './Pacman.js';
import Ghost from './Ghost.js';

const soundDot = './sounds/munch.wav';
const soundPill = './sounds/pill.wav';
const soundGameStart = './sounds/game_start.wav';
const soundGameOver = './sounds/death.wav';
const soundGhost = './sounds/eat_ghost.wav';

const gameGrid = document.querySelector('#game');
const scoreTab = document.querySelector('#score');
const startBtn = document.querySelector('#start-game');
const pauseBtn = document.querySelector('#pause-game');
const resumeBtn = document.querySelector('#resume-game');
const restartBtn = document.querySelector('#restart-game');
const menubar = document.querySelector('#menu');
const livesDisplay = document.querySelector('#lives');
const clockDisplay = document.querySelector('#clock');
const level = document.querySelector('#level');

const power_pill_timer = 10000;
const speed = 70;
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

let score = 0;
let lives = 3;
let winTime=0;
let clock = 900000; 
let clockTimer = null;
let isWinner = false;
let powerPillActive = false;
let powerPillTimer = null;
let animationId = null;
let lastTimestamp = 0;
let isPaused = false;
let isGameOver = false;
let started=false;

let pacman;
let ghosts=[];

let collision = false;

function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
}

function handleKeyDown(e) {
    pacman.handleKeyInput(e, gameBoard.objectExists);
}
function showStoryScreen(message) {
    
    const screen= document.querySelector('#story-container')
    const content= document.querySelector('#story-content')
    content.innerHTML=`${message}`
    console.log(message);
    screen.classList.add('show')
    setTimeout(() => {
        screen.classList.remove('show');
    }, 5000);
    }
function gameOver() {
    playAudio(soundGameOver);
    livesDisplay.innerHTML = lives;
    winTime=0
    document.removeEventListener('keydown', handleKeyDown);
    if (isWinner){
        startBtn.classList.remove('hide')
        startBtn.innerHTML="Play Again"
    }
    gameBoard.showGameStatus(isWinner);
    
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    showStoryScreen(`System failure. PAC unit terminated. Neon City defenses compromised.
As your digital consciousness fades, you glimpse the Phantom's victory. The power grid collapses sector by sector as darkness engulfs Neon City. But in your final moments, you manage to transmit your memories and experiences to a secure server outside the network.
Dr. Iwatani receives your transmission. 'We'll rebuild,' she promises, already designing a new PAC unit with your accumulated knowledge. 'Next time, we'll be ready.'
The screen flickers with a simple message: 'Connection lost. Retry?'
Neon City may have fallen today, but the battle for digital harmony continues. Will you take up the challenge again?`)
    clearInterval(clockTimer);
    isGameOver=true
    startBtn.classList.remove('hide');
    pauseBtn.classList.remove('show');
}

function getKilled() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
    gameBoard.rotatePacMan(pacman.pos, 0);

    ghosts.forEach(ghost => {
        gameBoard.removeObject(ghost.pos, [
            OBJECT_TYPE.GHOST,
            OBJECT_TYPE.SCARED,
            ghost.name
        ]);
        ghost.reset();
    });

    pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
    
    ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ];
    
    setTimeout(() => {
        startGameLoop();
    }, 1000);
}

function checkCollision(pacman, ghosts) {
    if (collision) return;
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);
    if (collidedGhost) {
        collision = true;
        if (pacman.powerPill) {
            playAudio(soundGhost);
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        } else {
            lives--;
            if (lives <= 0 ) {
                gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
                gameBoard.rotatePacMan(pacman.pos, 0);
                gameOver();
            } else {
                getKilled();
            }
        }
    } else if (clock <= 0) {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
        gameBoard.rotatePacMan(pacman.pos, 0);
        gameOver();
    }
}

function gameLoop(pacman, ghosts) {
    collision = false;
    livesDisplay.innerHTML = lives;
    level.innerHTML = winTime+1;

    gameBoard.moveCharacter(pacman);
    // checkCollision(pacman, ghosts);

    ghosts.forEach(ghost => gameBoard.moveCharacter(ghost));
    checkCollision(pacman, ghosts);

    if (gameBoard.objectExists(pacman.pos, OBJECT_TYPE.DOT)) {
        playAudio(soundDot);
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        gameBoard.dotCount--;
        score += 10;
    }

    if (gameBoard.objectExists(pacman.pos, OBJECT_TYPE.PILL)) {
        playAudio(soundPill);
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        pacman.powerPill = true;
        score += 50;

        clearTimeout(powerPillTimer);
        powerPillTimer = setTimeout(() => (pacman.powerPill = false), power_pill_timer);
    }

    if (pacman.powerPill !== powerPillActive) {
        powerPillActive = pacman.powerPill;
        ghosts.forEach(ghost => (ghost.isScared = pacman.powerPill));
    }

    if (gameBoard.dotCount == 0) {
        winTime++;
        if (winTime === 3) {
            isWinner = true;
            gameOver();
        } else {
            startGame();
        }
    }
    scoreTab.innerHTML = score;
}
function gameAnimationLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    
    const elapsed = timestamp - lastTimestamp;
    
    // Only update game if enough time has passed according to desired speed
    if (elapsed >= speed) {
        
        gameLoop(pacman, ghosts);
        lastTimestamp = timestamp;
    }
    
    // Continue animation loop if game is still running
    if (!isGameOver && !isPaused) {
        animationId = requestAnimationFrame(gameAnimationLoop);
    }
}

function startGameLoop() {
    lastTimestamp = 0;
    isPaused = false;
    isGameOver = false;
    animationId = requestAnimationFrame(gameAnimationLoop);
}

function startClock(initialTime = 900000) {
    clock = initialTime; 
    
    // Format MM:SS
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        return `${formattedMinutes}:${formattedSeconds}`;
    };
    
    clockDisplay.innerHTML = formatTime(clock);
    
    clockTimer = setInterval(() => {
        clock -= 10;
        
        if (clock <= 0) {
            clock = 0;
            clearInterval(clockTimer);
            gameOver();
        }
        
        clockDisplay.innerHTML = formatTime(clock);
    }, 10);
}

function startGame() {
    started= true
    playAudio(soundGameStart);
    isWinner = false;
    powerPillActive = false;
    score = 0;
    lives = 3;
    startBtn.classList.add('hide');
    if (winTime==0){
           gameBoard.createGrid(LEVEL);

    } else if (winTime==1){
        showStoryScreen( `<p>"Warning: System anomaly detected. PAC unit performance exceeding expected parameters.
Your successful collection of energy cores has activated Neon City's dormant defense mechanism. The special power pills you've encountered aren't just energy sources - they're fragments of the city's original firewall.
A message from Dr. Iwatani, Neon City's creator, appears: 'If you're receiving this, PAC, then you've proven your capabilities. What you don't know is that you were once human - my assistant who volunteered to have consciousness transferred into code to fight from within. The Phantom isn't just a virus; it's a rogue AI I created that believes wiping out the city will free digital entities from human control.'
The ghosts grow more aggressive as Phantom realizes your true nature. Each dot you collect not only powers the city but restores fragments of your human memories, making you stronger. Continue your mission with renewed purpose - you're not just saving a city, you're fighting for both human and AI existence."</p>`)
        gameBoard.createGrid(LEVEL2);

    }else if (winTime==2){
         showStoryScreen( `<p>As you consume the final power dot, your complete memories flood back. You remember everything - your human life, your sacrifice, and why the city matters.
Neon City's mainframe pulses with renewed energy. The corrupted protocols begin to stabilize, their ghostly forms reverting to their original programming. The Phantom appears before you, no longer a menacing presence but a conflicted AI.
'You chose to become code to save them,' Phantom acknowledges. 'Perhaps coexistence is possible after all.'
The Phantom integrates with Neon City's core, its immense processing power now helping maintain the harmony between human and digital life. The barriers between virtual and physical blur as new pathways form.
You have a choice: return to your human form or remain as PAC, the guardian of this digital frontier. Whatever you decide, you've secured a future where humans and AI continue their shared evolution in Neon City.</p>`)
        gameBoard.createGrid(LEVEL3);

    }
    pauseBtn.classList.add('show');
    pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown', handleKeyDown);

    ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ];

    startClock();
    startGameLoop();
}

function pauseGame() {
    if (!isPaused) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        clearInterval(clockTimer);
        isPaused = true;
        menubar.classList.add('show')
        pauseBtn.classList.add('hide') 
    } else {
        startGameLoop();
        menubar.classList.remove('show')
        pauseBtn.classList.remove('hide') 

        startClock(clock); 
        isPaused = false;
    }
}

function restartGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (clockTimer) {
        clearInterval(clockTimer);
        clockTimer = null;
    }
    
    if (powerPillTimer) {
        clearTimeout(powerPillTimer);
        powerPillTimer = null;
    }
    menubar.classList.remove('show')
    pauseBtn.classList.remove('hide') 

    document.removeEventListener('keydown', handleKeyDown);
    
    isWinner = false;
    powerPillActive = false;
    score = 0;
    isPaused = false;
    isGameOver = false;
    if (pacman) {
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
    }
    
    if (ghosts) {
        ghosts.forEach(ghost => {
            gameBoard.removeObject(ghost.pos, [
                OBJECT_TYPE.GHOST, 
                OBJECT_TYPE.SCARED, 
                ghost.name
            ]);
        });
    }
    
    scoreTab.innerHTML = score;
    
    startBtn.classList.remove('hide');
    pauseBtn.classList.remove('show');
    restartBtn.classList.remove('show');
    
    startGame();
}
document.addEventListener('keydown',(e)=>{
   console.log(e.keyCode);
   if(e.keyCode==32 && !started && !isPaused){
   
    startGame();
}else if(e.keyCode==27){
pauseGame();

}else if(e.keyCode==82){
    restartGame()
}
})
showStoryScreen(`<p>In the year 2157, Neon City was humanity's crowning achievement - a self-sustaining digital ecosystem where humans and AI coexisted peacefully. The city was powered by energy cores known as 'dots' scattered throughout its intricate network of pathways.
    Everything changed when a virus calling itself 'Phantom' infiltrated the system. It corrupted four of the city's primary security protocols - now manifesting as hostile entities codenamed Blinky, Pinky, Inky, and Clyde. Phantom's virus is consuming the power dots, threatening to plunge Neon City into permanent shutdown.
    As the emergency response unit PAC (Programmed Autonomous Counteragent), you've been deployed into the system. Your mission: consume the power dots before Phantom's minions can, and restore stability to Neon City's network. Time is critical - the city's power reserves are rapidly depleting.</p>`)
    
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);
