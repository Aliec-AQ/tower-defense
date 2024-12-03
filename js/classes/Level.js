import Enemy from './Enemy/Enemy.js';
import SmallGoblin from './Enemy/SmallGoblin.js';

export default class Level extends Phaser.Scene {
    constructor(configFile) {
        super({ key: 'LevelScene' });
        this.configFile = configFile;
    }

    preload() {
        // charge la configuration du niveau
        this.load.json('levelConfig', this.configFile);
    }

    create() {
        // récupère la configuration du niveau
        this.config = this.cache.json.get('levelConfig');

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
        if (this.currentWave >= this.config.waves.length) {
            this.scene.stop('LevelScene');
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

    update(time, delta) {
        // si tous les ennemis de la vague ont été détruits on passe à la vague suivante
        if (this.enemies.countActive(true) === 0) {
            this.startNextWave();
        }
    }
}