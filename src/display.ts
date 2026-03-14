import { Coordinates, Snake } from './characters.js';

/* Game Board */
export const gameBoard = document.getElementById('game-board')!;
export const score = document.getElementById('score');
export const highScoreText = document.getElementById('high-score')!;
export const userScreen = document.querySelector(".screen") as HTMLImageElement;

/* UI */
export function createGameElement(tag: string, className: string) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

export function setPosition(element: HTMLElement, position: Coordinates) {
    element.style.gridColumn = position.x.toString();
    element.style.gridRow = position.y.toString();
}

/* Rendering */

export function drawSnake(snake: Coordinates[], currSnake: Snake) {    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', currSnake.name)

        // edit position of the snake
        setPosition(snakeElement, segment);
        gameBoard.appendChild(snakeElement);
    })
}

export function drawFood(gameStarted: boolean, food: Coordinates) {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');

        setPosition(foodElement, food);
        gameBoard.appendChild(foodElement);
    }
}

export function drawPoisonFood(gameStarted: boolean, position: Coordinates) {
    if (gameStarted) {
        const poisonFood = createGameElement('div', 'poison-food');
        
        setPosition(poisonFood, position);
        gameBoard.appendChild(poisonFood);
    }
}