import * as Data from '../utils/dataUtils.js';

class SaveManager {
    constructor() {
        this.saves = Data.getSaveList();
        this.currentSave = null;
    }

    getSaveList() {
        return this.saves;
    }

    selectSave(index) {
        if (this.saves.saves[index]) {
            this.currentSave = Data.getDataFromSave(index);
            return this.currentSave;
        } else {
            throw new Error(`Save Slot ${index + 1} is empty.`);
        }
    }

    deleteSave(index) {
        if (this.saves.saves[index]) {
            Data.deleteSave(index);
            this.saves = Data.getSaveList();
        } else {
            throw new Error(`Save Slot ${index + 1} is already empty.`);
        }
    }

    createNewSave() {
        let data = {
            levelDone: [0,1,2],
        }
        Data.createSave(data);
        this.saves = Data.getSaveList();
    }

    storeCurrentSave(index, data) {
        Data.storeDataToSave(index, data);
        this.saves = Data.getSaveList();
    }

    isLevelDone(levelIndex) {
        return this.currentSave.levelDone.includes(levelIndex);
    }

    winLevel(levelIndex) {
        if (!this.isLevelDone(levelIndex)) {
            this.currentSave.levelDone.push(levelIndex);
            this.storeCurrentSave(this.currentSave.index, this.currentSave);
        }
    }
}

const saveManagerInstance = new SaveManager();
export default saveManagerInstance;