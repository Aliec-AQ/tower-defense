class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Charger le fichier de configuration
        this.load.json('loadConfig', '/config/game/load.config.json');
    
        // Charger l'image du spinner
        this.load.image('spinner', '/assets/ui/load.png');
    }
    
    create() {
        // Créer le spinner
        this.spinner = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 200, 'spinner');
        this.spinner.setOrigin(0.5, 0.5);
        this.spinner.setScale(0.25); // Définir la taille du spinner à 1/4
        this.tweens.add({
            targets: this.spinner,
            angle: 360,
            duration: 1000,
            repeat: -1
        });

        // Créer un objet texte pour afficher ce qui est en cours de chargement
        this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Chargement...', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Créer une barre de progression
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(this.cameras.main.centerX - 160, this.cameras.main.centerY + 30, 320, 50);

        // Récupérer les données de configuration
        const loadConfig = this.cache.json.get('loadConfig');
        const totalAssets = loadConfig.images.length + loadConfig.json.length;
        let loadedAssets = 0;

        const updateProgressBar = () => {
            loadedAssets++;
            const progress = loadedAssets / totalAssets;
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(this.cameras.main.centerX - 150, this.cameras.main.centerY + 40, 300 * progress, 30);
        };
        
        // Fonction pour charger les images avec un délai
        const loadImagesWithDelay = (images, index = 0) => {
            if (index < images.length) {
                const key = Object.keys(images[index])[0];
                const path = images[index][key];
                this.loadingText.setText(`Chargement de l'image : ${key}`);
                this.load.image(key, path);
                this.load.once('filecomplete-image-' + key, () => {
                    updateProgressBar();
                    setTimeout(() => loadImagesWithDelay(images, index + 1), 50); // Délai de 50ms
                });
                this.load.start();
            } else {
                loadJsonWithDelay(loadConfig.json); // Commencer à charger les fichiers JSON après les images
            }
        };
    
        // Fonction pour charger les fichiers JSON avec un délai
        const loadJsonWithDelay = (jsonFiles, index = 0) => {
            if (index < jsonFiles.length) {
                const key = Object.keys(jsonFiles[index])[0];
                const path = jsonFiles[index][key];
                this.loadingText.setText(`Chargement du JSON : ${key}`);
                this.load.json(key, path);
                this.load.once('filecomplete-json-' + key, () => {
                    updateProgressBar();
                    setTimeout(() => loadJsonWithDelay(jsonFiles, index + 1), 50); // Délai de 50ms
                });
                this.load.start();
            } else {
                this.load.once('complete', () => {
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('MainScene'); // Remplacer 'MainScene' par la clé de votre prochaine scène
                    });
                });
                this.load.start();
            }
        };

        // Commencer à charger les images avec un délai pour un effet DRAMATIQUE !!!!!!!!!!!!! :D, non en vrai c'est juste parce que c'est cool et j'avais envie de le faire
        loadImagesWithDelay(loadConfig.images);
    }
}

export default BootScene;