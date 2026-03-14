import { ace, fang, zig, Snake, Coordinates } from './characters.js';
import { gameBoard, score, highScoreText, userScreen, drawSnake, drawFood, drawPoisonFood } from './display.js';
import { Controller } from './controls.js';

/* Game Variables */
let gameInterval: number | undefined;
const gridSize = 20;
let snake: Coordinates[] = [{ x: 10, y: 20 }];
let food: Coordinates; 
let poisonFood: Coordinates;

let snakeDirection = "";
let currScore = 0;

// State Machines for Game Screens
type GameState = 'START' | 'MENU' | 'RULES' | 'CONTROLS' | 'SELECT' | 'PLAY' | 'GAME_OVER';
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
    drawPoisonFood(currState === 'PLAY', poisonFood);
    updateScore();
}

// Makes Sure Food + Poison + Snake don't Overlap
function generatePosition(): Coordinates {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;

    // If the snake exists, make sure we didn't land on it
    if (snake) {
        const hitsSnake = snake.some(s => s.x === x && s.y === y);
        if (hitsSnake) return generatePosition(); // Try again
    }

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

    // 1. Food + Snake
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
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

    // 2. Poison Food + Snake
    else if (snakeHead.x === poisonFood.x && snakeHead.y === poisonFood.y) {
        // lose 30 points, but cannot go lower than 0
        currScore = Math.max(0, currScore - 30);
        poisonFood = generatePosition();

        // Only Head = Dead
        if (snake.length <= 2) {
            resetGame();
            return;
        }

        // Pop to cancel out unshift (regular movement)
        snake.pop();
        // Pop that shrinks snake
        if (snake.length > 1) {
            snake.pop();
        }

        // update UI for score/shrink
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, currSnake.delay);
    }

    // 3. Regular Movement
    else {
        snake.pop();
    }
}

/* SCREENS */
export function showStart() {
    currState = 'START';
    userScreen.src = "./images/snake-logo.gif";
}

export function showMenu() {
    currState = 'MENU';
    userScreen.src = "./images/menu.gif";
}

export function showRules() {
    currState = 'RULES';
    userScreen.src = "./images/rules.gif";
}

export function showControls() {
    currState = 'CONTROLS';
    userScreen.src = "./images/controls.gif";
}

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

export function startGame() {
    currState = 'PLAY';

    food = generatePosition();
    poisonFood = generatePosition();

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

    // Return to Title Screen (5.5s)
    setTimeout(() => {
        showStart();
    }, 5500);
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