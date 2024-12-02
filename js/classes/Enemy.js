export default class Enemy extends Phaser.GameObjects.PathFollower {
    hp;
    speed;
    attack;
    pathOffset;

    constructor(scene, path, startPoint, enemyConfig) {
        super(scene, path, startPoint.x, startPoint.y, enemyConfig.type);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hp = 100;
        this.attack = 10;
        this.setScale(0.5);
        this.speed = 1;

        scene.time.delayedCall(enemyConfig.delay*1000, () => {
            this.startFollow({
                duration: 10000 / this.speed,
                positionOnPath: true,
                onComplete: () => {
                    this.destroy();
                }
            });
        });

    }

    takeDamage(attacker) {
        this.hp -= attacker.attack;
        if (this.hp <= 0) {
            this.destroy();
        }
    }
}