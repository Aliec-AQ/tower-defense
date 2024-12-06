import Enemy from './Enemy/Enemy.js';

export default class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelScene' });
    }

    init(){
        this.configFile = this.scene.settings.data;
    }

    preload() {
        // charge la configuration du niveau
        this.load.json('levelConfig', this.configFile);
    }

    create() {
        // récupère la configuration du niveau
        this.config = this.cache.json.get('levelConfig');
        this.enemiesConfig = this.cache.json.get('enemies');

        // initialisation des variables
        this.lives = this.config.lives;
        this.totalWaves = this.config.waves.length;
        this.money = this.config.money;
        this.finished = false;

        // image de fond
        this.background = this.add.image(0, 0, this.config.background).setOrigin(0, 0);

        // chemins des ennemis à suivre
        this.paths = this.config.paths.map(pathPoints => {
            const path = this.add.path(pathPoints[0].x, pathPoints[0].y);
            pathPoints.slice(1).forEach(point => {
                path.lineTo(point.x, point.y);
            });
            return path;
        });

        // affiche l'interface
        this.displayUI();

        // vagues d'ennemis
        this.currentWave = 0;
        this.startNextWave();
    }

    // démarre la vague suivante
    startNextWave() {
        // si on a fini toutes les vagues
        if (this.currentWave >= this.totalWaves) {
            this.endLevel(true);
            return;
        }

        // on récupère la vague actuelle
        const wave = this.config.waves[this.currentWave];
        this.enemies = this.physics.add.group();

        // on crée les ennemis de la vague
        wave.enemies.forEach(enemyConfig => {
            for (let i = 0; i < enemyConfig.count; i++) {
                const path = this.paths[enemyConfig.pathIndex];
                const startPoint = path.getStartPoint();
                let enemy = new Enemy(this, path, startPoint, enemyConfig, this.enemiesConfig[enemyConfig.type]);
                this.enemies.add(enemy);
            }
        });

        this.currentWave++;
    }

    // fin du niveau
    endLevel(win) {
        this.finished = true;
        // stop les ennemis restants
        if(!win){
            this.enemies.getChildren().forEach(enemy => {
                enemy.stopFollow();
            });
        }

        // pleins de pixel perfect configuration car sinon c'est la merde et c'est pas beau

        // affiche le menu de fin
        const panel = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'panelShell').setScale(1.5);
        const chains = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 159, 'chains').setScale(1.5);
        const chains2 = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 298, 'chains').setScale(1.5);
        const panel2 = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 230, 'panelShell').setScale(1.5);

        // bouton menu
        const menuButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 12, 'panelButton')
        .setScale(1.5)
        .setInteractive()
        .on('pointerover', () => menuButton.setTexture('panelButtonHover'))
        .on('pointerout', () => menuButton.setTexture('panelButton'))
        .on('pointerdown', () => {
            this.scene.start('TransitionScene', {MainScene: true});
        });
        // texte du bouton menu
        const menuText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 12, 'Menu', { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' }).setOrigin(0.5);

        // bouton replay
        const replayButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 51, 'panelButton')
        .setScale(1.5)
        .setInteractive()
        .on('pointerover', () => replayButton.setTexture('panelButtonHover'))
        .on('pointerout', () => replayButton.setTexture('panelButton'))
        .on('pointerdown', () => {
            this.scene.restart();
        });
        // texte du bouton replay
        const replayText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 51, 'Replay', { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' }).setOrigin(0.5);

        // si on a gagné on affiche un texte de victoire
        if(win){
            // texte de victoire
            const winText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 230, 'You Win', { fontSize: '64px', fill: '#fff', fontFamily: 'Jersey25', fontStyle: 'bold' }).setOrigin(0.5);

            // bouton niveau suivant
            const extendPanel = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 128, 'panelExtendShell').setScale(1.5);

            const nextLevelButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 160, 'panelButton')
            .setScale(1.5)
            .setInteractive()
            .on('pointerover', () => nextLevelButton.setTexture('panelButtonHover'))
            .on('pointerout', () => nextLevelButton.setTexture('panelButton'))
            .on('pointerdown', () => {
                this.scene.start('TransitionScene', {MainScene: false, levelToLoad: this.config.nextLevel});
            });
            // texte du bouton niveau suivant
            const nextLevelText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 160, 'Next Level', { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' }).setOrigin(0.5);
        }else{
            // texte de défaite
            const loseText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 230, 'You Lose', { fontSize: '64px', fill: '#fff', fontFamily: 'Jersey25', fontStyle: 'bold' }).setOrigin(0.5);
        }
    }

    // enlève des vies au joueur quand un ennemi atteint la fin du chemin
    removeLife(attack) {
        this.lives -= attack;
        if (this.lives <= 0) {
            this.endLevel(false);
        }
    }

    update(time, delta) {
        // si tous les ennemis de la vague ont été détruits on passe à la vague suivante
        if (!this.finished && this.enemies.countActive(true) === 0) {
            this.startNextWave();
        }
    }

    //display ui
    displayUI(){
        const extendedPannel = this.add.image(5, -60, 'panelExtendShell').setOrigin(0, 0).setScale(1.5);

        // affiche les vies
        this.livesText = this.add.text(20, 20, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' });
        // affiche l'argent
        this.moneyText = this.add.text(20, 60, `Money: ${this.money}`, { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' });
    }
}