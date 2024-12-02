// Enemy.js

class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, texture) {
        super(scene, path, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 100;
        this.setScale(0.5);
        this.speed = Math.random() * 2 + 1;


        this.startFollow({
            duration: 10000 / this.speed,
            positionOnPath: true
        });
    }
}

export default Enemy;