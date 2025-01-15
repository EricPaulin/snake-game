/* game */
const gameBoard = document.getElementById('game-board')
const score = document.getElementById('score')
const highScoreText = document.getElementById('high-score')

/* screens */
const screen = document.querySelector(".screen")

/* contoller */
const arrow_left = document.querySelector(".arrow1")
const arrow_up = document.querySelector(".arrow2")
const arrow_down = document.querySelector(".arrow3")
const arrow_right = document.querySelector(".arrow4")
const button_b = document.querySelector(".btn1")
const button_a = document.querySelector(".btn2")

/* characters */
let fangUnlock = false
let zigUnlock = false

document.addEventListener('keydown', handleKeyPress)

// define game variables
const gridSize = 20
let snake = [{ x: 10, y: 10 }]
let food = generatePostion()

let snakeDirection = ''
let gameSpeedDelay = 200
let currScore = 0

let gameStarted = false
let selectScreen = false
let gameOverScreen = false

let aceSelected = false
let fangSelected = false
let zigSelected = false

/* localStorage() */
let highScore = localStorage.getItem('highScore')
if (highScore === null) {
    highScore = 0
}
else {
    parseInt(highScore)
    highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0')
    highScoreText.style.display = 'block'
    //console.log(highScore)

    // check if character unlocked
    if (highScore >= 550) {
        fangUnlock = true
        zigUnlock = true
    }
    else if (highScore >= 300) {
        fangUnlock = true
    }
}

//highScore = 550

/*
    TODDO
    - fix gameSpeedDelay
    - fix character colors
    - new Title Screen + Name
    - snek game soundtrack (4 tracks: title, 3 characters)


    CHARACTERS
    - Fang (original - noraml mode) (click A)
        - delay 200
        - currScore = (snake.length - 1) * 10
    - Ace (veteran snake - easy mode) 300 POINTS (click B)
        - delay 250
        - currScore = (snake.length - 1) * 20
    - Noodle (worm - hard mode) 550 POINTS (click UP)
        - delay 100
        - currScore = (snake.length - 1) * 30
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
    return { x, y }
}

function move() {
    // use spread b/c we want the positon of the head, but not alter it
    const snakeHead = { ...snake[0] }

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

// screen select
function selectCharacter() {

    // change screen
    selectScreen = true

    // screen corresponds to users high score
    if (highScore >= 550) {
        screen.src = './images/char-select3.gif';
    }
    else if (highScore >= 300) {
        screen.src = './images/char-select2.gif';
    }
    else {
        screen.src = './images/char-select1.gif';
    }
}

function startGame() {
    // keep track of running game
    gameStarted = true

    // remove select screen
    selectScreen = false
    screen.style.display = 'none'

    gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
    }, gameSpeedDelay)
}

/* Controls + Contoller */

arrow_up.addEventListener('click', () => { snakeDirection = 'up' })
arrow_down.addEventListener('click', () => { snakeDirection = 'down' })
arrow_left.addEventListener('click', () => { snakeDirection = 'left' })
arrow_right.addEventListener('click', () => { snakeDirection = 'right' })

button_a.addEventListener('click', () => {

    // start game as Ace
    if (selectScreen) {
        aceSelected = true
        startGame()
    }

    // prevent error from prev game
    else if (!gameStarted && !gameOverScreen) {
        selectCharacter()
    }
})

button_b.addEventListener('click', () => {

    // makes sure Fang can be selected
    if (selectScreen && (highScore >= 300)) {
        fangSelected = true
        startGame()
    }
})

arrow_up.addEventListener('click', () => {
    if (gameStarted) {
        return
    }

    // make sure Zig can be selected
    else if (selectScreen && (highScore >= 550)) {
        zigSelected = true
        startGame()
    }
})

function handleKeyPress(e) {
    // on Select Screen
    if (selectScreen) {
        // Select Ace
        if (e.key === 'a') {
            aceSelected = true
            startGame()
        }

        // Select Fang
        if (e.key === 'b') {
            fangSelected = true
            startGame()
        }

        // Select Zig
        if (e.key === 'ArrowUp') {
            if (selectScreen && (highScore >= 550)) {
                zigSelected = true
                startGame()
            }
        }
    }

    // on Start Screen
    else if ((!gameStarted && !gameOverScreen && e.key === 'a')) {
        selectCharacter()
    }

    // in Game (controlling snake)
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

        /* FIX THIS */
        // Food -> Generate new Postition till no Collision
        if (food.x === snake[i].x && food.y === snake[i].y) {
            food = generatePostion()
            checkCollision()
        }
    }
}

function increaseSpeed() {
    console.log(gameSpeedDelay)
    
    if (gameSpeedDelay > 220) {
        gameSpeedDelay -= 7
    }
    else if (gameSpeedDelay > 150) {
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
    snake = [{ x: 10, y: 10 }]
    food = generatePostion()
    snakeDirection = 'right'
    gameSpeedDelay = 200
    updateScore()
}

function stopGame() {
    clearInterval(gameInterval)
    gameStarted = false
    gameOverScreen = true

    aceSelected, fangSelected, zigSelected = false

    // display Game Over Screen
    screen.style.display = 'block'
    screen.src = "./images/game-over.gif"

    // return to title   
    setTimeout(() => {
        screen.src = "./images/snake-logo.png"
        gameOverScreen = false
    }, 5500)
}


/* Score Functions */
function updateScore() {
    if (aceSelected) {
        currScore = (snake.length - 1) * 10
    }
    else if (fangSelected) {
        currScore = (snake.length - 1) * 20
    }
    else if (zigSelected) {
        currScore = (snake.length - 1) * 30
    }
    
    // make score appear larger
    score.textContent = currScore.toString().padStart(3, '0')
}

function updateHighScore() {
    // 0 case
    if (currScore == 0) {
        return
    }

    // replace high score
    if (currScore > highScore) {
        highScore = currScore
        localStorage.setItem('highScore', highScore.toString())
        highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block'
}
