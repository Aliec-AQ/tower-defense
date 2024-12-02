import Enemy from './Enemy.js';

export default class Level extends Phaser.Scene {
    constructor(configFile) {
        super({ key: 'LevelScene' });
        this.configFile = configFile;
    }

    preload() {
        this.load.json('levelConfig', this.configFile);
    }

    create() {
        this.config = this.cache.json.get('levelConfig');

        // image de fond
        this.background = this.add.image(0, 0, this.config.background).setOrigin(0, 0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        // chemins
        this.paths = this.config.paths.map(pathPoints => {
            const path = this.add.path();
            pathPoints.forEach(point => {
                path.lineTo(point.x, point.y);
            });
            return path;
        });

        // vagues
        this.currentWave = 0;
        this.startNextWave();
    }

    startNextWave() {
        if (this.currentWave >= this.config.waves.length) {
            console.log('All waves completed');
            return;
        }

        const wave = this.config.waves[this.currentWave];
        this.enemies = this.physics.add.group();

        wave.enemies.forEach(enemyConfig => {
            for (let i = 0; i < enemyConfig.count; i++) {
                const path = this.paths[enemyConfig.pathIndex];
                const startPoint = path.getStartPoint();
                const enemy = new Enemy(this, path, startPoint, enemyConfig);
                this.enemies.add(enemy);
            }
        });

        this.currentWave++;
    }

    update(time, delta) {
        if (this.enemies.countActive(true) === 0) {
            this.startNextWave();
        }
    }
}