class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load assets here
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('map', 'assets/map.png');
    }

    create() {
        // Start the main game scene
        this.scene.start('MainScene');
    }
}

export default BootScene;