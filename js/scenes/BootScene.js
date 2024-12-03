class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load assets here
        this.load.image('main-map', 'assets/main-map.jpg');
        this.load.image('smallGoblin', 'assets/smallGoblin.png');
        this.load.image('map', 'assets/map.png');

        // Load the menu configuration
        this.load.json('menu-config', "../../config/menu-config.json");
    }

    create() {
        // Start the main game scene
        this.scene.start('MainScene');
    }
}

export default BootScene;