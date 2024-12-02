// MainScene.js
import Enemy from '../classes/Enemy.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        //create background
        this.add.image(400, 300, 'map');

        // Create map Path
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, 164);
        this.path.lineTo(480, 164);
        this.path.lineTo(480, 544);

        // Create enemies
        this.enemies = this.physics.add.group();
        let enemy = new Enemy(this, this.path, 0, 0, 'enemy');
        this.enemies.add(enemy);
    }

    update(time, delta) {
        // No need to manually move enemies here
    }
}

export default MainScene;