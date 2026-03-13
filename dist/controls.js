import { ace, fang, zig } from './characters.js';
import { setSnakeDirection, startGame, selectCharacter, getCurrState, setCurrSnake } from './game-logic.js';
/* Controller Elements */
const arrow_left = document.querySelector(".arrow1");
const arrow_up = document.querySelector(".arrow2");
const arrow_down = document.querySelector(".arrow3");
const arrow_right = document.querySelector(".arrow4");
const button_b = document.querySelector(".btn1");
const button_a = document.querySelector(".btn2");
/* Handles Keyboard and/or Button Controls */
export function Controller() {
    /* KEYBOARD (WASD) */
    document.addEventListener('keydown', (e) => {
        const currState = getCurrState();
        const key = e.key.toLowerCase();
        switch (currState) {
            case 'START':
                if (key === 'a')
                    selectCharacter();
                break;
            case 'SELECT':
                if (key === 'a') {
                    setCurrSnake(ace);
                    startGame();
                }
                if (key === 'b' && fang.unlocked) {
                    setCurrSnake(fang);
                    startGame();
                }
                if ((key === 'arrowup' || key === 'w') && zig.unlocked) {
                    setCurrSnake(zig);
                    startGame();
                }
                break;
            case 'PLAY':
                if (['arrowup', 'w'].includes(key))
                    setSnakeDirection('up');
                if (['arrowdown', 's'].includes(key))
                    setSnakeDirection('down');
                if (['arrowleft', 'a'].includes(key))
                    setSnakeDirection('left');
                if (['arrowright', 'd'].includes(key))
                    setSnakeDirection('right');
                break;
        }
    });
    /* BUTTON */
    button_a.addEventListener('click', () => {
        const currState = getCurrState();
        if (currState === 'SELECT') {
            setCurrSnake(ace);
            startGame();
        }
        else if (currState === 'START')
            selectCharacter();
    });
    button_b.addEventListener('click', () => {
        if (getCurrState() === 'SELECT' && fang.unlocked) {
            setCurrSnake(fang);
            startGame();
        }
    });
    arrow_up.addEventListener('click', () => {
        const currState = getCurrState();
        if (currState === 'PLAY')
            setSnakeDirection('up');
        else if (currState === 'SELECT' && zig.unlocked) {
            setCurrSnake(zig);
            startGame();
        }
    });
    arrow_down.addEventListener('click', () => {
        if (getCurrState() === 'PLAY')
            setSnakeDirection('down');
    });
    arrow_left.addEventListener('click', () => {
        if (getCurrState() === 'PLAY')
            setSnakeDirection('left');
    });
    arrow_right.addEventListener('click', () => {
        if (getCurrState() === 'PLAY')
            setSnakeDirection('right');
    });
}
