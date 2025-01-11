const gameBoard = document.getElementById('game-board')
const prompt = document.getElementById('prompt')
const logo = document.querySelector(".logo")
const score = document.getElementById('score')
const highScoreText = document.getElementById('high-score')

document.addEventListener('keydown', handleKeyPress)

// define game variables
const gridSize = 20
let snake = [{x: 10, y: 10}]
let food = generatePostion()
let highScore = 0;
let snakeDirection = ''
let gameSpeedDelay = 200
let gameStarted = false


/*
    FEATURES
    - Gameplay Loop (fix)
    - Responsive Design

    FIX
    - Snake Shouldn't go Backwards
    - Button Controls
    - Food Shouldn't Spawn in Snake


    ADD
    - GAME OVER SCREEN
    - localStorage()
    - Press Start flicker (every 2 seconds)
    

    EXTRA
    - Main Menu?
    - Different Unlockable Snakes (make classes and constructors)
        - Fang (original - noraml mode)
        - Ace (veteran snake - easy mode) 550 POINTS
        - Noodle (worm - hard mode) 1000 POINTS
    - Powerups
        - APPLE (gives 100 points)
        - SPEED (speed goes up 10)
    - Help (Describes Game, Controls, Powerups)

    (last)
    - snek song (for me not the game)
    - new Title Screen (animated?)
    - name for Game?
*/

/* intial game setup */
function draw() {
    gameBoard.innerHTML = ''
    drawSnake() 
    drawFood()
    updateScore()
}

function drawSnake() {
    snake.forEach((segment) => {
        // defining each snake segment (tag, class)
        const snakeElement = createGameElement('div', 'snake')

        // edit position of the snake
        setPositon(snakeElement, segment)
        gameBoard.appendChild(snakeElement)
    })
}

function drawFood() {
    // only generate food when game begins
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food')
        setPositon(foodElement, food)
        gameBoard.appendChild(foodElement)
    }
}

function createGameElement(tag, className) {
   const element = document.createElement(tag)
   element.className = className
   return element
}

function setPositon(element, position) {
    element.style.gridColumn = position.x
    element.style.gridRow = position.y
}

function generatePostion() {
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    return {x, y}
}

function move() {
    // use spread b/c we want the positon of the head, but not alter it
    const snakeHead = {...snake[0]}

    switch (snakeDirection) {
        case 'up':
            snakeHead.y--  
            break
        case 'down':
            snakeHead.y++
            break
        case 'left':
            snakeHead.x--
            break
        case 'right':
            snakeHead.x++ 
            break
        default:
            break
    }
    snake.unshift(snakeHead)

    // snake and food on same coodrinates
    if (snakeHead.x == food.x && snakeHead.y == food.y) {
        food = generatePostion()
        increaseSpeed()

        // prevents super speed up
        clearInterval(gameInterval)

        gameInterval = setInterval(() => {
            move()
            checkCollision()
            draw()
        }, gameSpeedDelay)
    }

    // remove last position (so snake doesn't grow)
    else {
        snake.pop()
    }
}

function startGame() {
    // keep track of running game
    gameStarted = true;

    // remove logo and prompt
    logo.style.display = 'none'
    prompt.style.display = 'none'

    gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
    }, gameSpeedDelay)
}

/* Controls */

function handleKeyPress(e) {
    // Title Screen
    if ((!gameStarted && e.code === 'Space') || (!gameStarted && e.key === ' ')) {
        startGame()
    }
    // Contolling Snake
    else {
        switch (e.key) {
            case 'ArrowUp':
                snakeDirection = 'up'
                break
            case 'ArrowDown':
                snakeDirection = 'down'
                break
            case 'ArrowLeft':
                snakeDirection = 'left'
                break
            case 'ArrowRight':
                snakeDirection = 'right'
                break
        }
    }
}



/* Gameplay Features */

function checkCollision() {
    const head = snake[0]

    // Border Collision
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame()
    }

    // Body Collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
        }
    }
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2
    }
}


/* Restart / End */
function resetGame() {
    updateHighScore()
    stopGame()
    snake = [{x: 10, y: 10}]
    food = generatePostion()
    snakeDirection = 'right'
    gameSpeedDelay = 200
    updateScore()
}

function stopGame() {
    clearInterval(gameInterval)
    gameStarted = false
    logo.style.display = 'block'
    prompt.style.display = 'block'
   
}

 
/* Score Functions */
function updateScore() {
    const currScore = (snake.length - 1) * 10

    // make score appear larger
    score.textContent = currScore.toString().padStart(3, '0')
}

function updateHighScore() {
    const currScore = (snake.length - 1) * 10

    if (currScore == 0) {
        return
    }

    if (currScore > highScore) {
        highScore = currScore
        highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block'
}