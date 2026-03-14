/* Game Board */
export const gameBoard = document.getElementById('game-board');
export const score = document.getElementById('score');
export const highScoreText = document.getElementById('high-score');
export const userScreen = document.querySelector(".screen");
/* UI */
export function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}
export function setPosition(element, position) {
    element.style.gridColumn = position.x.toString();
    element.style.gridRow = position.y.toString();
}
/* Rendering */
export function drawSnake(snake, currSnake) {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', currSnake.name);
        // edit position of the snake
        setPosition(snakeElement, segment);
        gameBoard.appendChild(snakeElement);
    });
}
export function drawFood(gameStarted, food) {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        gameBoard.appendChild(foodElement);
    }
}
export function drawPoisonFood(gameStarted, position) {
    if (gameStarted) {
        const poisonFood = createGameElement('div', 'poison-food');
        setPosition(poisonFood, position);
        gameBoard.appendChild(poisonFood);
    }
}
