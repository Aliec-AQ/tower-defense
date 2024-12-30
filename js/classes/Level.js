import { createButton, createText, displayUI } from '../utils/UIUtils.js';
import { createEnemies } from '../utils/enemyUtils.js';
import saveManager from './SaveManager.js';

export default class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelScene' });
    }

    init() {
        // Récupération du fichier de configuration du niveau
        this.configFile = this.scene.settings.data;
    }

    preload() {
        // Chargement du fichier de configuration du niveau
        this.load.json('levelConfig', this.configFile);
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        // Récupération des données du fichier de configuration
        this.config = this.cache.json.get('levelConfig');
        // Récupération des données des ennemis
        this.enemiesConfig = this.cache.json.get('enemies');

        // Initialisation des variables de jeu
        this.lives = this.config.lives;
        this.totalWaves = this.config.waves.length;
        this.money = this.config.money;
        this.finished = false;

        // Affichage des éléments du jeu
        this.background = this.add.image(0, 0, this.config.background).setOrigin(0, 0);

        // Création des chemins
        this.paths = this.config.paths.map(pathPoints => {
            const path = this.add.path(pathPoints[0].x, pathPoints[0].y);
            pathPoints.slice(1).forEach(point => {
                path.lineTo(point.x, point.y);
            });
            return path;
        });

        // Affichage de l'interface utilisateur
        displayUI(this, this.lives, this.money);

        // Initialisation des vagues
        this.currentWave = 0;
        this.startNextWave();
    }


    startNextWave() {
        // Vérification de la fin du niveau
        if (this.currentWave >= this.totalWaves) {
            this.endLevel(true);
            return;
        }

        // Création des ennemis de la vague
        const wave = this.config.waves[this.currentWave];
        this.enemies = createEnemies(this, wave, this.paths, this.enemiesConfig);

        // Passage à la vague suivante
        this.currentWave++;
    }

    endLevel(win) {
        // Fin du niveau 
        this.finished = true;

        saveManager.winLevel(this.config.levelIndex);

        // Suppression des ennemis restants
        if (!win) {
            this.enemies.destroy(true);
        }

        // Affichage du panneau de fin de niveau
        const panel = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'panelShell').setScale(1.5);
        const chains = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 159, 'chains').setScale(1.5);
        const chains2 = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 298, 'chains').setScale(1.5);
        const panel2 = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 230, 'panelShell').setScale(1.5);

        // Boutons de fin de niveau
        const menuButton = createButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 12, 'panelButton', 'panelButtonHover', () => {
            this.scene.start('TransitionScene', { MainScene: true });
        });
        createText(this, this.cameras.main.centerX, this.cameras.main.centerY + 12, 'Menu', { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' });

        const replayButton = createButton(this, this.cameras.main.centerX, this.cameras.main.centerY - 51, 'panelButton', 'panelButtonHover', () => {
            this.scene.restart();
        });
        createText(this, this.cameras.main.centerX, this.cameras.main.centerY - 51, 'Replay', { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' });

        // Affichage du message de fin de niveau
        if (win) {
            createText(this, this.cameras.main.centerX, this.cameras.main.centerY - 230, 'You Win', { fontSize: '64px', fill: '#fff', fontFamily: 'Jersey25', fontStyle: 'bold' });
        } else {
            createText(this, this.cameras.main.centerX, this.cameras.main.centerY - 230, 'You Lose', { fontSize: '64px', fill: '#fff', fontFamily: 'Jersey25', fontStyle: 'bold' });
        }
    }

    // Enlève une vie au joueur en fonction de l'attaque subie
    removeLife(attack) {
        this.lives -= attack;
        if (this.lives <= 0) {
            this.endLevel(false);
        }
    }

    // Mise à jour du niveau
    update(time, delta) {
        if (!this.finished && this.enemies.countActive(true) === 0) {
            this.startNextWave();
        }
    }
}