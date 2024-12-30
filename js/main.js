
import BootScene from './scenes/BootScene.js';
import MainScene from './scenes/MainScene.js';
import SavesScene from './scenes/SavesScene.js';
import TransitionScene from './scenes/TransitionScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1280, 
    height: 720, 
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [BootScene, SavesScene, MainScene, TransitionScene]
};

const game = new Phaser.Game(config);