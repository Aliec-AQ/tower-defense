import Level from '../classes/Level.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Add a fade-in effect when the scene loads
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.config = this.cache.json.get('mapConfig');

        // Image de fond
        this.background = this.add.image(0, 0, 'main-map').setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        // Création des boutons
        this.config.buttons.forEach(buttonConfig => {   
            this.createButton(buttonConfig);
        });
    }

    launchLevel(levelConfig) {
        this.scene.add('LevelScene', new Level(), true, levelConfig);
    }

    createButton(buttonConfig) {
        // Choix de l'image à afficher
        let button = null;
        if(buttonConfig.isEnemy){
            button = this.add.image(buttonConfig.x, buttonConfig.y, 'enemyFlag').setOrigin(0.5, 0.5);
        }else{
            button = this.add.image(buttonConfig.x, buttonConfig.y, 'conqueredFlag').setOrigin(0.5, 0.5);
        }
    
        button.setScale(0.33);
        button.setInteractive();
    
        // Création de l'image de survol
        const hoverImage = this.add.image(buttonConfig.x, buttonConfig.y, 'hoverFlag').setOrigin(0.5, 0.5);
        hoverImage.setScale(0.33);
        hoverImage.setVisible(false);
    
        // Gestion des événements
        button.on('pointerover', () => {
            hoverImage.setVisible(true);
        });
    
        button.on('pointerout', () => {
            hoverImage.setVisible(false);
        });
    
        button.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.launchLevel(buttonConfig.levelConfig);
        });
    }
}

export default MainScene;