export default class Turret extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, radius, attack) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.radius = radius;
        this.attack = attack;

        // Add the turret to the scene
        this.scene.add.existing(this);

        // Create a graphics object for the radius
        this.radiusGraphics = this.scene.add.graphics();
        this.radiusGraphics.lineStyle(2, 0xff0000, 1);
        this.radiusGraphics.strokeCircle(this.x, this.y, this.radius);

        // Add a timer to check for enemies within the radius
        this.scene.time.addEvent({
            delay: 500, // Check every 500ms
            callback: this.checkForEnemies,
            callbackScope: this,
            loop: true
        });
    }

    checkForEnemies() {
        const enemies = this.scene.enemies.getChildren();
        for (let enemy of enemies) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance <= this.radius) {
                this.attackEnemy(enemy);
                break; // Attack only one enemy at a time
            }
        }
    }

    attackEnemy(enemy) {
        // Create a line from the turret to the enemy
        const line = this.scene.add.line(0, 0, this.x, this.y, enemy.x, enemy.y, 0xff0000).setOrigin(0, 0);
        this.scene.time.delayedCall(100, () => line.destroy()); // Destroy the line after 100ms

        // Call the enemy's takeDamage function
        enemy.takeDamage(this.attack);
    }
}