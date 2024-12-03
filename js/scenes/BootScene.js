class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load the configuration file
        this.load.json('loadConfig', '/config/game/load.config.json');
    }
    
    create() {
        // Retrieve the configuration data
        const loadConfig = this.cache.json.get('loadConfig');
    
        // Load images
        loadConfig.images.forEach(image => {
            const key = Object.keys(image)[0];
            const path = image[key];
            this.load.image(key, path);
        });
    
        // Load JSON files
        loadConfig.json.forEach(json => {
            const key = Object.keys(json)[0];
            const path = json[key];
            this.load.json(key, path);
        });
    
        // Start the next scene after loading all assets
        this.load.on('complete', () => {
            this.scene.start('MainScene'); // Replace 'NextScene' with your next scene key
        });
    
        // Start loading the assets
        this.load.start();
    }
}

export default BootScene;