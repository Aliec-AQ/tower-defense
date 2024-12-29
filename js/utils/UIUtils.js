export function createButton(scene, x, y, texture, hoverTexture, callback) {
    const button = scene.add.image(x, y, texture)
        .setScale(1.5)
        .setInteractive()
        .on('pointerover', () => button.setTexture(hoverTexture))
        .on('pointerout', () => button.setTexture(texture))
        .on('pointerdown', callback);
    return button;
}

export function createText(scene, x, y, text, style) {
    return scene.add.text(x, y, text, style).setOrigin(0.5);
}

export function displayUI(scene, lives, money) {
    const extendedPanel = scene.add.image(5, -60, 'panelExtendShell').setOrigin(0, 0).setScale(1.5);
    extendedPanel.setDepth(5);

    scene.livesText = scene.add.text(20, 20, `Lives: ${lives}`, { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' });
    scene.livesText.setDepth(10);

    scene.moneyText = scene.add.text(20, 60, `Money: ${money}`, { fontSize: '32px', fill: '#fff', fontFamily: 'Jersey25' });
    scene.moneyText.setDepth(10);
}