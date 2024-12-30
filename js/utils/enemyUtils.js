import Enemy from '../classes/Enemy.js';

export function createEnemies(scene, wave, paths, enemiesConfig) {
    const enemies = scene.physics.add.group();
    console.log(enemiesConfig);
    wave.enemies.forEach(enemyConfig => {
        for (let i = 0; i < enemyConfig.count; i++) {
            console.log(enemyConfig);
            const path = paths[enemyConfig.pathIndex];
            const startPoint = path.getStartPoint();
            let enemy = new Enemy(scene, path, startPoint, enemyConfig, enemiesConfig[enemyConfig.type]);
            enemies.add(enemy);
        }
    });
    return enemies;
}