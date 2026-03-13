// Inside game-logic.ts
import { ace, fang, zig } from './characters.js';
import { gameBoard, score, highScoreText, userScreen, drawSnake, drawFood } from './display.js';
/* Controller */
const arrow_left = document.querySelector(".arrow1");
const arrow_up = document.querySelector(".arrow2");
const arrow_down = document.querySelector(".arrow3");
const arrow_right = document.querySelector(".arrow4");
const button_b = document.querySelector(".btn1");
const button_a = document.querySelector(".btn2");
document.addEventListener('keydown', handleKeyPress);
/* Game Variables */
let gameInterval;
const gridSize = 20;
let snake = [{ x: 10, y: 20 }];
let food = generatePosition();
let snakeDirection = "";
let currScore = 0;
let gameStarted = false;
let selectScreen = false;
let gameOverScreen = false;
// Set Ace as Default Snake
let currSnake = ace;
/* Local Storage Score Info */
let highScore = parseInt(localStorage.getItem('highScore') || '0');
highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0');
highScoreText.style.display = 'block';
checkUnlocks();
/* Initial Game Setup */
function draw() {
    gameBoard.innerHTML = "";
    drawSnake(snake, currSnake);
    drawFood(gameStarted, food);
    updateScore();
}
function generatePosition() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}
function move() {
    // use spread b/c we want the positon of the head (not alter it)
    const snakeHead = Object.assign({}, snake[0]);
    switch (snakeDirection) {
        case 'up':
            snakeHead.y--;
            break;
        case 'down':
            snakeHead.y++;
            break;
        case 'left':
            snakeHead.x--;
            break;
        case 'right':
            snakeHead.x++;
            break;
        default:
            break;
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
        }, currSnake.delay);
    }
    // remove last position (so snake doesn't grow)
    else {
        snake.pop();
    }
}
// screen select
function selectCharacter() {
    // change screen
    selectScreen = true;
    // screen corresponds to users high score
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
function startGame() {
    /* test: checking characters */
    //console.log(`${currSnake.name}`)
    //console.log(`Delay: ${currSnake.delay}`)
    //console.log(`Food Value: ${currSnake.foodValue}`)
    // keep track of running game
    gameStarted = true;
    // remove select screen
    selectScreen = false;
    userScreen.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, currSnake.delay);
}
/* Controls & Controller */
arrow_up.addEventListener('click', () => { snakeDirection = 'up'; });
arrow_down.addEventListener('click', () => { snakeDirection = 'down'; });
arrow_left.addEventListener('click', () => { snakeDirection = 'left'; });
arrow_right.addEventListener('click', () => { snakeDirection = 'right'; });
button_a.addEventListener('click', () => {
    // start game as Ace
    if (selectScreen) {
        currSnake = ace;
        startGame();
    }
    // prevent error from prev game
    else if (!gameStarted && !gameOverScreen) {
        selectCharacter();
    }
});
button_b.addEventListener('click', () => {
    // makes sure Fang can be selected
    if (selectScreen && (fang.unlocked)) {
        currSnake = fang;
        startGame();
    }
});
arrow_up.addEventListener('click', () => {
    if (gameStarted) {
        return;
    }
    // make sure Zig can be selected
    else if (selectScreen && (zig.unlocked)) {
        currSnake = zig;
        startGame();
    }
});
function handleKeyPress(e) {
    // on Select Screen
    if (selectScreen) {
        // Select Ace
        if (e.key === 'a') {
            currSnake = ace;
            startGame();
            return;
        }
        // Select Fang
        if (e.key === 'b' && fang.unlocked) {
            currSnake = fang;
            startGame();
            return;
        }
        // Select Zig
        if (e.key === 'ArrowUp' && zig.unlocked) {
            currSnake = zig;
            startGame();
            return;
        }
    }
    // on Start Screen
    else if ((!gameStarted && !gameOverScreen && e.key === 'a')) {
        selectCharacter();
    }
    // in Game (controlling snake)
    else if (gameStarted) {
        switch (e.key) {
            case 'ArrowUp':
                snakeDirection = 'up';
                break;
            case 'ArrowDown':
                snakeDirection = 'down';
                break;
            case 'ArrowLeft':
                snakeDirection = 'left';
                break;
            case 'ArrowRight':
                snakeDirection = 'right';
                break;
        }
    }
}
/* Gameplay Features */
function checkCollision() {
    const head = snake[0];
    // Border Collision
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
        return;
    }
    // Body / Food Collision
    for (let i = 1; i < snake.length; i++) {
        // Body
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
        // Food -> Generate new Postition till no Collision
        if (food.x === snake[i].x && food.y === snake[i].y) {
            food = generatePosition();
            checkCollision();
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
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    gameOverScreen = true;
    // display Game Over Screen
    userScreen.style.display = 'block';
    userScreen.src = "./images/game-over.gif";
    // return to title  
    setTimeout(() => {
        userScreen.src = "./images/snake-logo.gif";
        gameOverScreen = false;
    }, 5500);
}
/* Score Functions */
function updateScore() {
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
    if (currScore == 0) {
        return;
    }
    // updates high score + checks if character unlocked
    if (currScore > highScore) {
        highScore = currScore;
        localStorage.setItem('highScore', highScore.toString());
        highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0');
        checkUnlocks();
    }
    highScoreText.style.display = 'block';
}
