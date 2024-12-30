import saveManager from '../classes/SaveManager.js';

class SavesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SavesScene' });
        this.saveManager = saveManager;
    }

    preload() {
        // Load any assets if needed
    }

    create() {
        this.saves = this.saveManager.getSaveList();
        this.maxSaves = 3;

        this.createSaveButtons();
        this.createDeleteButtons();
        this.createNewSaveButton();
    }

    createSaveButtons() {
        for (let i = 0; i < this.maxSaves; i++) {
            let saveData = this.saves.saves[i] ? `Save ${i + 1}` : 'Empty Slot';
            this.add.text(100, 100 + i * 50, `${saveData}`, { fontSize: '16px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => this.selectSave(i));
        }
    }

    createDeleteButtons() {
        for (let i = 0; i < this.maxSaves; i++) {
            if (!this.saves.saves[i]) continue;
            this.add.text(300, 100 + i * 50, 'Delete', { fontSize: '16px', fill: '#ff0000' })
                .setInteractive()
                .on('pointerdown', () => this.deleteSave(i));
        }
    }

    createNewSaveButton() {
        this.add.text(100, 300, 'Create New Save', { fontSize: '16px', fill: '#00ff00' })
            .setInteractive()
            .on('pointerdown', () => this.createNewSave());
    }

    selectSave(index) {
        try {
            this.saveManager.selectSave(index);
            this.scene.start('MainScene');
        } catch (error) {
            console.log(error.message);
        }
    }

    deleteSave(index) {
        try {
            this.saveManager.deleteSave(index);
            console.log(`Deleted Save ${index + 1}`);
            this.scene.restart();
        } catch (error) {
            console.log(error.message);
        }
    }

    createNewSave() {
        try {
            this.saveManager.createNewSave();
            this.scene.restart();
        } catch (error) {
            console.log(error.message);
        }
    }
}

export default SavesScene;