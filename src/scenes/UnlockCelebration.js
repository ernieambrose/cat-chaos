import { CAT_TYPES } from '../config/cats.js';

export default class UnlockCelebration extends Phaser.Scene {
  constructor() {
    super('UnlockCelebration');
  }

  init(data) {
    this.catTypeId = data.catTypeId;
    this.nextLevelId = data.nextLevelId;
    this.catConfig = CAT_TYPES[this.catTypeId];
  }

  create() {
    const cx = 480;

    this.add.rectangle(cx, 270, 960, 540, 0x1a0a3c);

    for (let i = 0; i < 20; i++) {
      const star = this.add.text(
        Phaser.Math.Between(50, 910),
        Phaser.Math.Between(50, 490),
        '⭐', { fontSize: '20px' }
      );
      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: 1 },
        scale: { from: 0.5, to: 1.2 },
        duration: 600,
        delay: i * 80,
        yoyo: true,
        repeat: -1
      });
    }

    this.add.text(cx, 100, '✨ New Cat Unlocked! ✨', {
      fontSize: '36px', color: '#ffdd44',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    const catSprite = this.add.image(cx, 240, this.catConfig.textureKey)
      .setScale(4)
      .setAlpha(0);

    this.tweens.add({
      targets: catSprite,
      alpha: 1,
      scale: 4,
      duration: 500,
      ease: 'Back.out'
    });

    this.add.text(cx, 340, this.catConfig.name, {
      fontSize: '40px', color: '#ffffff',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    const abilityText = this.catConfig.ability === 'speedBurst'
      ? 'Tap mid-flight for a speed burst!'
      : 'Massive weight — crashes through anything!';

    this.add.text(cx, 390, abilityText, {
      fontSize: '22px', color: '#aaddff',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    const btn = this.add.text(cx, 460, "Let's go! →", {
      fontSize: '28px', color: '#fff',
      backgroundColor: '#2255aa',
      padding: { x: 24, y: 12 },
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377cc' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2255aa' }));
    btn.on('pointerdown', () => {
      this.scene.start('Game', { levelId: this.nextLevelId });
    });
  }
}
