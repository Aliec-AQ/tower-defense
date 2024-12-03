import Enemy from "./Enemy.js";

export default class SmallGoblin extends Enemy {
    constructor(scene, path, startPoint, enemyConfig) {
        super(scene, path, startPoint, enemyConfig,100,20,1);
    }
}