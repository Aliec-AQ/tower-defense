import Level from '../classes/Level.js';

class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    init(){
        this.data = this.scene.settings.data;
    }

    create() {
        // on supprime la scène précédente et les données associées
        this.scene.remove('LevelScene');
        this.cache.json.remove('levelConfig');

        if(this.data.MainScene){
            this.scene.start('MainScene');
        }else{
            this.scene.add('LevelScene', new Level(), true, this.data.levelToLoad);
        }
    }
}

export default TransitionScene;