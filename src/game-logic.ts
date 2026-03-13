import { ace, fang, zig, Snake, Coordinates } from './characters.js';
import { gameBoard, score, highScoreText, userScreen, drawSnake, drawFood } from './display.js';
import { Controller } from './controls.js';

/* Game Variables */
let gameInterval: number | undefined;
const gridSize = 20;
let snake: Coordinates[] = [{ x: 10, y: 20 }];
let food: Coordinates = generatePosition();

let snakeDirection = "";
let currScore = 0;

// State Machines for Game Screens
type GameState = 'START' | 'SELECT' | 'PLAY' | 'GAME_OVER';
let currState: GameState = 'START';

// Set Ace as Default Snake
let currSnake: Snake = ace;

/* Local Storage Score Info */
let highScore: number = parseInt(localStorage.getItem('highScore') || '0');
highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0');
highScoreText.style.display = 'block';
checkUnlocks();

/* Initial Game Setup */
function draw() {
    gameBoard.innerHTML = "";
    drawSnake(snake, currSnake);
    drawFood(currState === 'PLAY', food);
    updateScore();
}

function generatePosition() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function move() {
    // use spread b/c we want the positon of the head (not alter it)
    const snakeHead = { ...snake[0] };

    switch (snakeDirection) {
        case 'up': snakeHead.y--; break;
        case 'down': snakeHead.y++; break;
        case 'left': snakeHead.x--; break;
        case 'right': snakeHead.x++; break;
    }
    snake.unshift(snakeHead);

    // snake and food on same coordinate position
    if (snakeHead.x == food.x && snakeHead.y == food.y) {
        food = generatePosition();
        increaseSpeed();

        // prevents super speed up
        clearInterval(gameInterval);

        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, currSnake.delay)
    }
    // remove last position (so snake doesn't grow)
    else {
        snake.pop();
    }
}

/* SCREENS */
// Select Screen
export function selectCharacter() {
    currState = 'SELECT';

    if (zig.unlocked) {
        userScreen.src = './images/char-select3.gif';
    }
    else if (fang.unlocked) {
        userScreen.src = './images/char-select2.gif';
    }
    else {
        userScreen.src = './images/char-select1.gif';
    }
}

// Play Screen
export function startGame() {
    currState = 'PLAY';

    // hide the overlay/select screen
    userScreen.style.display = 'none';

    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, currSnake.delay)
}

// Game Over + Title Screen
function stopGame() {
    // Game Over
    clearInterval(gameInterval);
    currState = 'GAME_OVER';

    userScreen.style.display = 'block';
    userScreen.src = "./images/game-over.gif";

    // Title
    setTimeout(() => {
        userScreen.src = "./images/snake-logo.gif";
        currState = 'START';
    }, 5500)
}

/* Gameplay Features */
function checkCollision() {
    const head = snake[0]

    // Border Collision
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame()
        return
    }

    // Body / Food Collision
    for (let i = 1; i < snake.length; i++) {
        // Body
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
            return
        }


        // Food -> Generate new Postition till no Collision
        if (food.x === snake[i].x && food.y === snake[i].y) {
            food = generatePosition()
            checkCollision()
        }
    }
}


function increaseSpeed() {
    if (currSnake == ace) {
        currSnake.delay -= 5;
    }

    else if (currSnake == fang) {
        if (currSnake.delay > 200) {
            currSnake.delay -= 10;
        }
    }

    else if (currSnake == zig) {
        if (currSnake.delay > 120) {
            currSnake.delay -= 2;
        }
    }
}

/* Restart / End */
function resetGame() {
    updateHighScore();
    stopGame();
    // Resets Delay for Each Caracter
    ace.delay = 250;
    fang.delay = 320;
    zig.delay = 150;

    snake = [{ x: 10, y: 10 }];
    food = generatePosition();
    snakeDirection = 'right';
    updateScore();
}

/* Score Functions */
function updateScore(): void {
    currScore = (snake.length - 1) * currSnake.foodValue;

    // Check for Score Element
    if (score) {
        // Convert number to string
        score.textContent = currScore.toString().padStart(3, '0');
    }
}

// fixes unlock syncing issues
function checkUnlocks() {
    if (highScore >= 550) {
        fang.unlocked = true;
        zig.unlocked = true;
    }
    else if (highScore >= 300) {
        fang.unlocked = true;
    }
}

function updateHighScore() {
    if (currScore > highScore) {
        highScore = currScore;
        localStorage.setItem('highScore', highScore.toString());
        highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0');

        checkUnlocks();
    }
    highScoreText.style.display = 'block';
}

// Export to Controller
export function getCurrState() { return currState; }
export function setCurrSnake(snake: Snake) { currSnake = snake; }
export function setSnakeDirection(dir: string) { snakeDirection = dir; }

// Get Controller
Controller();