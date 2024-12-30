/**
 * Classe Enemy : représente un ennemi dans le jeu
 * 
 * Enemy hérite de Phaser.GameObjects.PathFollower
 * 
 * Cette classe prend en paramètres :
 * - une scene (Phaser.Scene)
 * 
 * - un chemin path à suivre (Phaser.Curves.Path)
 * 
 * - un point de départ startPoint (Phaser.Math.Vector2)
 * 
 * - un objet enemyConfig contenant les propriétés suivantes :
 *      - delay : délai avant le début de la vague
 *      - pathIndex : index du chemin à suivre
 *      - type : type d'ennemi
 *      - count : nombre d'ennemis (utilisé pour les vagues mais utilisé dans Level.js et non ici)
 * 
 * - un objet enemyStats contenant les propriétés suivantes :
 *      - hp : points de vie
 *      - speed : vitesse
 *      - damage : dégâts infligés
 *      - image : image de l'ennemi
 */
export default class Enemy extends Phaser.GameObjects.PathFollower {
    // propriétés
    hp;
    speed;
    damage;
    pathOffset;

    /**
     * Constructeur de la classe Enemy
     */
    constructor(scene, path, startPoint, enemyConfig, enemyStats ) {
        // appel du constructeur de la classe mère
        super(scene, path, startPoint.x, startPoint.y, enemyStats.image);

        // ajout de l'ennemi à la scène et au moteur physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // initialisation des propriétés
        this.hp = enemyStats.hp;
        this.damage = enemyStats.damage;
        this.speed = enemyStats.speed;

        // rend l'ennemi invisible
        this.setVisible(false);
        this.setDepth(1);

        // décalage de la position de départ
        let x = Math.round( Math.random() * 55 );
        let y = Math.round(Math.random() * 55 );
        this.pathOffset = new Phaser.Math.Vector2(x, y);

        let rnd = Math.random() * 1.5;

        // délai avant le début de la vague
        scene.time.delayedCall(rnd*1000, () => {
            // rend l'ennemi visible
            this.setVisible(true);
            this.scene.time.delayedCall(enemyConfig.delay * 1000, () => {

                this.setVisible(true); // rend l'ennemi visible

                const initialPathOffset = this.pathOffset.clone(); // stocke le décalage de position initial 
                const pathLength = this.path.getLength(); // stocke la longueur du chemin

                console.log("pathLength : " + pathLength);
                console.log("speed : " + this.speed);
                console.log("duration : " + pathLength * (100 / this.speed));

                // démarre le suivi du chemin
                this.startFollow({
                    duration: pathLength * (100 / this.speed), // durée du suivi en fonction de la longueur afin d'avoir une vitesse constante
                    positionOnPath: true,
                    onComplete: () => {
                        if(this.scene){
                            this.scene.removeLife(this.damage);
                        }
                        this.destroy();
                   }
                });
                // on réinitialise le décalage de position car startFollow l'a modifié pour {x: 0, y: 0} NIQUE SA MERE PHASER AVEC SES METHODES DE MERDE ptn de out.copy de con
                this.pathOffset = initialPathOffset;
            });
        });
    }

    // méthode pour infliger des dégâts à l'ennemi WIP
    takeDamage(damage) {
        console.log("takeDamage : " + damage);
        this.hp -= damage;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    
    startLife(){
        
    }
}