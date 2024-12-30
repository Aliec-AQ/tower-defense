export default class Turret extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, config, availableTurrets) {
        super(scene, x, y, 'emptyTurretSlot');
        this.scene = scene;
        this.config = config;
        this.availableTurrets = availableTurrets;
        this.currentLevel = 0;
        this.currentConfig = null;
        this.optionButtons = [];
        this.optionTexts = [];
        this.checkForEnemiesEvent = null;

        // Add the turret to the scene
        this.scene.add.existing(this);

        // Add hover and click events
        this.setInteractive();
        this.on('pointerover', this.onHover, this);
        this.on('pointerout', this.onOut, this);
        this.on('pointerdown', this.onClick, this);

        // Add a global input listener to remove option buttons when clicking elsewhere
        this.scene.input.on('pointerdown', this.onGlobalClick, this);
    }

    onHover() {
        if (this.currentLevel === 0) {
            this.setTexture('hoverTurretSlot');
        }
    }

    onOut() {
        if (this.currentLevel === 0) {
            this.setTexture('emptyTurretSlot');
        }
    }

    onClick(pointer, localX, localY, event) {
        event.stopPropagation(); // Prevent the global click handler from firing
        this.clearOptionButtons();
        if (this.currentLevel === 0) {
            this.showTurretOptions();
        } else {
            this.showUpgradeOptions();
        }
    }

    onGlobalClick(pointer) {
        this.clearOptionButtons();
    }

    showTurretOptions() {
        this.availableTurrets.forEach((turretKey, index) => {
            const turretConfig = this.scene.cache.json.get('turrets')[turretKey];
            const button = this.scene.add.image(this.x, this.y - (index + 1) * 50, turretConfig.image).setInteractive();
            const text = this.scene.add.text(this.x + 50, this.y - (index + 1) * 50, `$${turretConfig.cost}`, { fontSize: '16px', fill: '#fff' });
            button.on('pointerdown', () => {
                this.createTurret(turretConfig);
                this.clearOptionButtons();
            });
            this.optionButtons.push(button);
            this.optionTexts.push(text);
        });
    }

    showUpgradeOptions() {
        if (this.currentConfig && this.currentConfig.upgrades.length > 0) {
            this.currentConfig.upgrades.forEach((upgradeKey, index) => {
                const upgradeConfig = this.scene.cache.json.get('turrets')[upgradeKey];
                const button = this.scene.add.image(this.x, this.y - (index + 1) * 50, upgradeConfig.image).setInteractive();
                const text = this.scene.add.text(this.x + 50, this.y - (index + 1) * 50, `$${upgradeConfig.cost}`, { fontSize: '16px', fill: '#fff' });
                button.on('pointerdown', () => {
                    this.upgradeTurret(upgradeConfig);
                    this.clearOptionButtons();
                });
                this.optionButtons.push(button);
                this.optionTexts.push(text);
            });
        }
    }

    clearOptionButtons() {
        this.optionButtons.forEach(button => button.destroy());
        this.optionButtons = [];
        this.optionTexts.forEach(text => text.destroy());
        this.optionTexts = [];
    }

    createTurret(turretConfig) {
        if (this.scene.money >= turretConfig.cost) {
            this.scene.decreaseMoney(turretConfig.cost);
            this.setTexture(turretConfig.image);
            this.radius = turretConfig.range;
            this.attack = turretConfig.attack;
            this.firerate = turretConfig.firerate;
            this.currentConfig = turretConfig;
            this.currentLevel++;

            // Create a graphics object for the radius
            this.radiusGraphics = this.scene.add.graphics();
            this.radiusGraphics.lineStyle(2, 0xff0000, 1);
            this.radiusGraphics.strokeCircle(this.x, this.y, this.radius);

            // Add a timer to check for enemies within the radius
            this.checkForEnemiesEvent = this.scene.time.addEvent({
                delay: 1000 / this.firerate, // Check based on firerate
                callback: this.checkForEnemies,
                callbackScope: this,
                loop: true
            });
        }
    }

    upgradeTurret(upgradeConfig) {
        if (this.scene.money >= upgradeConfig.cost) {
            this.scene.decreaseMoney(upgradeConfig.cost);
            this.setTexture(upgradeConfig.image);
            this.radius = upgradeConfig.range;
            this.attack = upgradeConfig.attack;
            this.firerate = upgradeConfig.firerate;
            this.currentConfig = upgradeConfig;
            this.currentLevel++;

            // Update the radius graphics
            this.radiusGraphics.clear();
            this.radiusGraphics.lineStyle(2, 0xff0000, 1);
            this.radiusGraphics.strokeCircle(this.x, this.y, this.radius);
        }
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

    stopLogic() {
        if (this.checkForEnemiesEvent) {
            this.checkForEnemiesEvent.remove();
            this.checkForEnemiesEvent = null;
        }
    }
}