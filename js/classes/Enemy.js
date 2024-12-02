export default class Enemy extends Phaser.GameObjects.PathFollower {
    hp;
    speed;
    attack;

    constructor(scene, path, x, y, texture, startAt = 0) {
        super(scene, path, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 100;
        this.attack = 10;

        this.setScale(0.5);
        this.speed = 1;

        this.startFollow({
            duration: 10000 / this.speed,
            positionOnPath: true,
            startAt: startAt
        });
    }

    takeDamage(attacker) {
        this.hp -= attacker.attack;
        if (this.hp <= 0) {
            this.destroy();
        }
    }
}