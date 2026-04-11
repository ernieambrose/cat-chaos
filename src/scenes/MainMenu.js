import { isLevelUnlocked, getBestStars } from '../utils/Progress.js';

const TOTAL_LEVELS = 6;
const BONUS_LEVEL_ID = 7;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const cx = 480;

    this.add.rectangle(cx, 270, 960, 540, 0x87ceeb);

    this.add.text(cx, 80, '🐱 CAT CHAOS 🐱', {
      fontSize: '56px', color: '#fff',
      stroke: '#334', strokeThickness: 6,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 145, 'Protect the nap spot!', {
      fontSize: '22px', color: '#ffffaa',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(cx, 200, 'Choose a level:', {
      fontSize: '20px', color: '#333'
    }).setOrigin(0.5);

    const levelIds = [...Array(TOTAL_LEVELS).keys()].map(i => i + 1);
    levelIds.forEach((id, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const bx = 330 + col * 110;
      const by = 250 + row * 90;
      this._addLevelButton(bx, by, id);
    });

    this._addLevelButton(cx, 430, BONUS_LEVEL_ID, true);
  }

  _addLevelButton(x, y, levelId, isBonus = false) {
    const unlocked = isLevelUnlocked(levelId);
    const stars = getBestStars(levelId);
    const label = isBonus ? '★ Bonus' : `${levelId}`;

    const btn = this.add.text(x, y, label, {
      fontSize: '24px',
      color: unlocked ? '#ffffff' : '#888888',
      backgroundColor: unlocked ? '#2255aa' : '#444444',
      padding: { x: 16, y: 10 },
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5);

    if (unlocked) {
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377cc' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2255aa' }));
      btn.on('pointerdown', () => {
        this.scene.start('Game', { levelId });
      });

      if (stars > 0) {
        this.add.text(x, y + 30, '🐟'.repeat(stars), {
          fontSize: '12px'
        }).setOrigin(0.5);
      }
    }
  }
}
