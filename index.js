
import {LEVEL,OBJECT_TYPE} from "./setup.js"
//classes
console.log(LEVEL);

import GameBoard from "./GameBoard.js"
import Pacman from "./Pacman.js";
//DOM ELements
const gameGrid =document.querySelector("#game")
const scoretable=document.querySelector("#score")
const startButton =document.querySelector("#start-button")
//GAME Constants
const POWER_PILL_TIME=10000
const GLOBAL_SPEED=80


const gameBoard=GameBoard.createGameBoard(gameGrid,LEVEL)


//init setup

let score=0
let timer=null
let gamewin=false
let powerPillActive=false
let powerPillTimer=null

function GameOver(pacman,grid){ 

}

function checkCollision(pacman,grid){

}
function gameLoop(pacman,ghosts){

}

function startGame(){
gamewin=false
score=0
powerPillActive=false

startButton.classList.add('hide')
gameBoard.createGrid(LEVEL)
const pacman=new Pacman(2,287)
gameBoard.addObject(287,[OBJECT_TYPE.PACMAN])
document.addEventListener('keydown',()=>{
    pacman.handleKeyInput(e,gameBoard.objectExist)
})

}
//init game
startButton.addEventListener("click",startGame)