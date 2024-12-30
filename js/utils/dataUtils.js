// fonctions générales pour manipuler les données

export function createBS64String (data){
    return btoa(data);
}

export function decodeBS64String (data){
    return atob(data);
}

export function storeToLocalStorage (key, data){
    localStorage.setItem(key, data);
}

export function getFromLocalStorage (key){
    return localStorage.getItem(key);
}

export function removeFromLocalStorage (key){
    localStorage.removeItem(key);
}

// fonctions spécifiques à notre jeu

export function storeDataToSave (saveNumber, data){
    data = JSON.stringify(data);
    let saves = JSON.parse(localStorage.getItem('saves')) || { saves: [] };
    saves.saves[saveNumber] = createBS64String(data);
    localStorage.setItem('saves', JSON.stringify(saves));
}

export function getDataFromSave (saveNumber){
    let data = JSON.parse(localStorage.getItem('saves')) || { saves: [] };
    return JSON.parse(decodeBS64String(data.saves[saveNumber]));
}

export function deleteSave (saveNumber){
    let saves = JSON.parse(localStorage.getItem('saves')) || { saves: [] };
    saves.saves[saveNumber] = null;
    localStorage.setItem('saves', JSON.stringify(saves));
}

export function createSave(data){
    data = JSON.stringify(data);
    let saves = JSON.parse(localStorage.getItem('saves')) || { saves: [] };
    let nullIndex = saves.saves.indexOf(null);
    
    if (saves.saves.length >= 3 && nullIndex === -1){
        throw new Error('Maximum number of saves reached');
    }
    
    if (nullIndex !== -1) {
        saves.saves[nullIndex] = createBS64String(data);
    } else {
        saves.saves.push(createBS64String(data));
    }
    
    localStorage.setItem('saves', JSON.stringify(saves));
}

export function getSaveList (){
    if(localStorage.getItem('saves') === null){
        return initSaves();
    }
    return JSON.parse(localStorage.getItem('saves'));

}

export function initSaves (){
    localStorage.setItem('saves', JSON.stringify({ saves: [] }));
    return { saves: [] };
}