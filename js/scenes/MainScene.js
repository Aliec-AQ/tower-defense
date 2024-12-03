import Level from '../classes/Level.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.config = this.cache.json.get('menu-config');

        this.background = this.add.image(0, 0, 'main-map').setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        this.config.buttons.forEach(buttonConfig => {   
            this.createButton(buttonConfig.x, buttonConfig.y, buttonConfig.levelConfig);
        });
    
    }

    launchLevel(levelConfig) {
        this.scene.add('LevelScene', new Level(levelConfig), true);
    }

    createButton(x, y, levelConfig) {
        const button = this.add.text(x, y, "X", { fontSize: '32px', fill: '#fff' });
        button.setInteractive();
        button.on('pointerdown', () => {
            this.launchLevel(levelConfig);
        });
        button.on('pointerover', () => {
            button.setText('Y');
        });
        button.on('pointerout', () => {
            button.setText('X');
        });
    }
}

export default MainScene;