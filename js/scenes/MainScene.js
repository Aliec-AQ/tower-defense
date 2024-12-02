import Level from '../classes/Level.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.scene.add('LevelScene', new Level('../../config/level1.json'), true);
    }
}

export default MainScene;