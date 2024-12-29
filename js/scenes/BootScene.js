class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load the configuration file
        this.load.json('loadConfig', '/config/game/load.config.json');
    
        // Load the spinner image
        this.load.image('spinner', '/assets/ui/load.png');
    }
    
    create() {
        // Create the spinner
        this.spinner = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY-200, 'spinner');
        this.spinner.setOrigin(0.5, 0.5);
        this.spinner.setScale(0.25); // Set the spinner to 1/4 the size
        this.tweens.add({
            targets: this.spinner,
            angle: 360,
            duration: 1000,
            repeat: -1
        });
    
        // Retrieve the configuration data
        const loadConfig = this.cache.json.get('loadConfig');
        
        // Function to load images with delay
        const loadImagesWithDelay = (images, index = 0) => {
            if (index < images.length) {
                const key = Object.keys(images[index])[0];
                const path = images[index][key];
                this.load.image(key, path);
                setTimeout(() => loadImagesWithDelay(images, index + 1), 500); // 500ms delay
            } else {
                loadJsonWithDelay(loadConfig.json); // Start loading JSON files after images
            }
        };
    
        // Function to load JSON files with delay
        const loadJsonWithDelay = (jsonFiles, index = 0) => {
            if (index < jsonFiles.length) {
                const key = Object.keys(jsonFiles[index])[0];
                const path = jsonFiles[index][key];
                this.load.json(key, path);
                setTimeout(() => loadJsonWithDelay(jsonFiles, index + 1), 500); // 500ms delay
            } else {
                // Start the next scene after loading all assets
                this.load.on('complete', () => {
                    this.scene.start('MainScene'); // Replace 'NextScene' with your next scene key
                });
                // Start loading the assets
                this.load.start();
            }
        };
    
        // Start loading images with delay
        loadImagesWithDelay(loadConfig.images);
    }
}

export default BootScene;