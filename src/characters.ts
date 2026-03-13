/* Describing A Snake */
// Interfaces ensure type safety and define shape of objects
export interface Snake {
    name: string;
    delay: number;
    foodValue: number;
    unlocked: boolean;
}

export interface Coordinates {
    x: number;
    y: number;
}

// Blueprint for each Snake
class SnakeInfo implements Snake {
    constructor(
        public name: string,
        public delay: number,
        public foodValue: number,
        public unlocked: boolean
    ) { }
}

/* Characters */
export const ace: Snake = new SnakeInfo("ace", 250, 10, true);
export const fang: Snake = new SnakeInfo("fang", 320, 20, false);
export const zig: Snake = new SnakeInfo("zig", 150, 30, false);