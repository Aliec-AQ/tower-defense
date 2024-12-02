import Enemy from '../classes/Enemy.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Create background
        this.background = this.add.image(0, 0, 'map').setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        // Create map Path
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, this.sys.game.config.height / 2 - 100);
        this.path.lineTo(this.sys.game.config.width - 100, this.sys.game.config.height / 2 - 100);
        this.path.lineTo(this.sys.game.config.width - 100, this.sys.game.config.height + 32);

        // Create 3 enemies
        this.enemies = this.physics.add.group();
        this.enemy = new Enemy(this, this.path, 96, -32, 'enemy', 0);
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this, this.path, 96, -32, 'enemy', 0.3);
        this.enemies.add(this.enemy);
        this.enemy = new Enemy(this, this.path, 96, -32, 'enemy', 0.6);
        this.enemies.add(this.enemy);
    }

    update(time, delta) {
        // No need to manually move enemies here
    }
}

export default MainScene;