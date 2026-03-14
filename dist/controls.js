import { ace, fang, zig } from './characters.js';
import { setSnakeDirection, startGame, selectCharacter, getCurrState, setCurrSnake, showMenu, showRules, showControls } from './game-logic.js';
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
                    showMenu();
                break;
            case 'MENU':
                if (key === 'a')
                    selectCharacter();
                if (key === 'b')
                    showRules();
                if (key === 'arrowup' || key === 'w')
                    showControls();
                break;
            case 'RULES':
            case 'CONTROLS':
                if (key === 'b')
                    showMenu();
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
        if (currState === 'START') {
            showMenu();
        }
        else if (currState === 'MENU') {
            selectCharacter();
        }
        else if (currState === 'SELECT') {
            setCurrSnake(ace);
            startGame();
        }
    });
    button_b.addEventListener('click', () => {
        const currState = getCurrState();
        if (currState === 'MENU') {
            showRules();
        }
        else if (['RULES', 'CONTROLS'].includes(currState)) {
            showMenu();
        }
    });
    arrow_up.addEventListener('click', () => {
        const currState = getCurrState();
        if (currState === 'MENU') {
            showControls();
        }
        else if (currState === 'PLAY') {
            setSnakeDirection('up');
        }
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
