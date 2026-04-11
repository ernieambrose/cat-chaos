export default class HUD extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  init(data) {
    this.levelId = data.levelId;
  }

  create() {
    this.add.text(16, 16, `Level ${this.levelId}`, {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.catLabel = this.add.text(16, 44, 'Cats: ...', {
      fontSize: '18px',
      color: '#ffdd44',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.events.on('catLaunched', ({ catsRemaining }) => {
      this.catLabel.setText(`Cats left: ${catsRemaining}`);
    });

    const restartBtn = this.add.text(16, 72, '↺ Restart', {
      fontSize: '18px',
      color: '#ff8844',
      stroke: '#000000',
      strokeThickness: 3
    }).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerover', () => restartBtn.setColor('#ffaa66'));
    restartBtn.on('pointerout', () => restartBtn.setColor('#ff8844'));
    restartBtn.on('pointerdown', () => {
      this.scene.stop('HUD');
      this.scene.start('Game', { levelId: this.levelId });
    });
  }
}
