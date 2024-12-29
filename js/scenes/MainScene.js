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
    
        // Create a graphics object for drawing lines
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffffff, 1);
    
        // Création des boutons
        this.config.levels.forEach((buttonConfig, index) => {
            this.createButton(buttonConfig, index);
        });
    }
    
    createButton(buttonConfig, index) {
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
    
        // Draw lines to predecessors
        if (buttonConfig.predecessor) {
            buttonConfig.predecessor.forEach(predecessorIndex => {
                const predecessorConfig = this.config.levels[predecessorIndex];
                this.drawLine(predecessorConfig.x, predecessorConfig.y, buttonConfig.x, buttonConfig.y);
            });
        }
    
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

    // Dessine une ligne de pointillés entre deux points
    drawLine(x1, y1, x2, y2, dotLength = 5, gapLength = 5) {
        const dx = x2 - x1; 
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy); // Longueur de la ligne
        const numberOfDots = Math.floor(distance / (dotLength + gapLength)); // magic ouhhhh
        const angle = Math.atan2(dy, dx);
    
        // Dessine les points
        for (let i = 0; i < numberOfDots; i++) {
            const startX = x1 + (dotLength + gapLength) * i * Math.cos(angle); // magic v2 ouhhhh
            const startY = y1 + (dotLength + gapLength) * i * Math.sin(angle);
            const endX = startX + dotLength * Math.cos(angle); // magic v3 ouhhhh
            const endY = startY + dotLength * Math.sin(angle); // sans déconner, truc trouvé sur un forum
    
            this.graphics.moveTo(startX, startY);
            this.graphics.lineTo(endX, endY);
            this.graphics.strokePath();
        }
    }

    launchLevel(levelConfig) {
        this.scene.add('LevelScene', new Level(), true, levelConfig);
    }
}

export default MainScene;