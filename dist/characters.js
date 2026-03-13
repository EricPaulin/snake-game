// Blueprint for each Snake
class SnakeInfo {
    constructor(name, delay, foodValue, unlocked) {
        this.name = name;
        this.delay = delay;
        this.foodValue = foodValue;
        this.unlocked = unlocked;
    }
}
/* Characters */
export const ace = new SnakeInfo("ace", 250, 10, true);
export const fang = new SnakeInfo("fang", 320, 20, false);
export const zig = new SnakeInfo("zig", 150, 30, false);
