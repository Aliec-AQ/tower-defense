export default class Enemy extends Phaser.GameObjects.PathFollower {
    hp;
    speed;
    attack;
    pathOffset;

    constructor(scene, path, startPoint, enemyConfig) {
        super(scene, path, startPoint.x, startPoint.y, enemyConfig.type);

        // initialise des variables
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hp = 100;
        this.attack = 10;
        this.setScale(1.5);
        this.speed = 1;
        this.setVisible(false);

        // décalage de la position de départ
        let x = Math.round( Math.random() * 40 - 5);
        let y = Math.round(Math.random() * 40 - 5);
        this.pathOffset = new Phaser.Math.Vector2(x, y);

        // timer pour le délai de départ
        scene.time.delayedCall(enemyConfig.delay * 1000, () => {
            // rend l'ennemi visible
            this.setVisible(true);
            // stocke le décalage de position initial
            const initialPathOffset = this.pathOffset.clone();
            // démarre le suivi du chemin
            this.startFollow({
                duration: 10000 / this.speed,
                positionOnPath: true,
                onComplete: () => {
                    this.destroy();
                }
            });
            // on réinitialise le décalage de position car startFollow l'a modifié pour {x: 0, y: 0} NIQUE SA MERE PHASER AVEC SES METHODES DE MERDE ptn de out.copy de con
            this.pathOffset = initialPathOffset;
        });
    }

    // méthode pour infliger des dégâts à l'ennemi WIP
    takeDamage(attacker) {
        this.hp -= attacker.attack;
        if (this.hp <= 0) {
            this.destroy();
        }
    }
}