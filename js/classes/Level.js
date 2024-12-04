import Enemy from './Enemy/Enemy.js';
import SmallGoblin from './Enemy/SmallGoblin.js';

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

        // vagues d'ennemis
        this.currentWave = 0;
        this.startNextWave();
    }

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
                let enemy = null;
                switch(enemyConfig.type){
                    case 'smallGoblin' : enemy = new SmallGoblin(this, path, startPoint, enemyConfig);
                    break;
                    default: console.log("merde de default");
                    break
                }
                this.enemies.add(enemy);
            }
        });

        this.currentWave++;
    }

    endLevel(win) {
        this.finished = true;
        // stop les ennemis restants
        if(!win){
            this.enemies.getChildren().forEach(enemy => {
                enemy.stopFollow();
            });
        }

        // affiche le menu de fin
        if(win){
            const winText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'You Win', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
                    
            const nextLevelButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Next Level', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('TransitionScene', {MainScene: false, levelToLoad: this.config.nextLevel});
            });
        }else{
            const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        }
    
        const replayButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Rejouer', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('replay');
                this.scene.restart();
        });

        const menuButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Return to Menu', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('TransitionScene', {MainScene: true});
        });
    }

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
}