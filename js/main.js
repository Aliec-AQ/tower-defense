import BootScene from './scenes/BootScene.js';
import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [BootScene, MainScene]
};

const game = new Phaser.Game(config);