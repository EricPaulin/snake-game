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

document.addEventListener('keydown', handleKeyPress)

class Snake {
    constructor(name, delay, foodValue) {
        this.name = name
        this.delay = delay
        this.foodValue = foodValue
    }
}

/* Characters */
const ace = new Snake("ace", 250, 10)
const fang = new Snake("fang", 320, 20)
const zig = new Snake("zig", 150, 30)

// define game variables
const gridSize = 20
let snake = [{ x: 10, y: 10 }]
let food = generatePostion()

let snakeDirection = ''
let currScore = 0

let gameStarted = false
let selectScreen = false
let gameOverScreen = false

let currSnake = ''

/* characters */
let fangUnlock = false
let zigUnlock = false


/* localStorage() */
let highScore = localStorage.getItem('highScore')
if (highScore === null) {
    highScore = 0
}
else {
    parseInt(highScore)
    highScoreText.textContent = "HI:" + highScore.toString().padStart(3, '0')
    highScoreText.style.display = 'block'

    // check if character unlocked
    if (highScore >= 550) {
        fangUnlock = true
        zigUnlock = true
    }
    else if (highScore >= 300) {
        fangUnlock = true
    }
}


/* intial game setup */
function draw() {
    gameBoard.innerHTML = ''
    drawSnake()
    drawFood()
    updateScore()
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', currSnake.name)

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
        }, currSnake.delay)
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
    if (zigUnlock) {
        screen.src = './images/char-select3.gif';
    }
    else if (fangUnlock) {
        screen.src = './images/char-select2.gif';
    }
    else {
        screen.src = './images/char-select1.gif';
    }
}

function startGame() {
    /* checking characters */
    //console.log(`${currSnake.name}`)
    //console.log(`Delay: ${currSnake.delay}`)
    //console.log(`Food Value: ${currSnake.foodValue}`)

    // keep track of running game
    gameStarted = true

    // remove select screen
    selectScreen = false
    screen.style.display = 'none'

    gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
    }, currSnake.delay)
}

/* Controls + Contoller */

arrow_up.addEventListener('click', () => { snakeDirection = 'up' })
arrow_down.addEventListener('click', () => { snakeDirection = 'down' })
arrow_left.addEventListener('click', () => { snakeDirection = 'left' })
arrow_right.addEventListener('click', () => { snakeDirection = 'right' })

button_a.addEventListener('click', () => {

    // start game as Ace
    if (selectScreen) {
        currSnake = ace
        startGame()
    }

    // prevent error from prev game
    else if (!gameStarted && !gameOverScreen) {
        selectCharacter()
    }
})

button_b.addEventListener('click', () => {

    // makes sure Fang can be selected
    if (selectScreen && (fangUnlock)) {
        currSnake = fang
        startGame()
    }
})

arrow_up.addEventListener('click', () => {
    if (gameStarted) {
        return
    }

    // make sure Zig can be selected
    else if (selectScreen && (zigUnlock)) {
        currSnake = zig
        startGame()
    }
})

function handleKeyPress(e) {
    // on Select Screen
    if (selectScreen) {
        // Select Ace
        if (e.key === 'a') {
            currSnake = ace
            startGame()
        }

        // Select Fang
        if (e.key === 'b') {
            currSnake = fang
            startGame()
        }

        // Select Zig
        if (e.key === 'ArrowUp') {
            if (selectScreen && (zigUnlock)) {
                currSnake = zig
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

        // Food -> Generate new Postition till no Collision
        if (food.x === snake[i].x && food.y === snake[i].y) {
            food = generatePostion()
            checkCollision()
        }
    }
}

function increaseSpeed() {

    if (currSnake == ace) {
        currSnake.delay -= 5
    }

    else if (currSnake == fang) {
        if (currSnake.delay > 200) {
            currSnake.delay -= 10
        }
    }

    else if (currSnake == zig) {
        if (currSnake.delay > 120) {
            currSnake.delay -= 2
        }
    }

    // test speed
    //console.log(currSnake.delay)
}


/* Restart / End */
function resetGame() {
    updateHighScore()
    stopGame()
    snake = [{ x: 10, y: 10 }]
    food = generatePostion()
    snakeDirection = 'right'
    updateScore()
}

function stopGame() {
    clearInterval(gameInterval)
    gameStarted = false
    gameOverScreen = true

    // display Game Over Screen
    screen.style.display = 'block'
    screen.src = "./images/game-over.gif"

    // return to title   
    setTimeout(() => {
        screen.src = "./images/snake-logo.gif"
        gameOverScreen = false
    }, 5500)
}


/* Score Functions */
function updateScore() {
    currScore = (snake.length - 1) * currSnake.foodValue
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
