
import {LEVEL,OBJECT_TYPE} from "./setup.js"
//classes
console.log(LEVEL);

import GameBoard from "./GameBoard.js"

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

}