import { calculateStars } from '../utils/Stars.js';
import { saveResult } from '../utils/Progress.js';
import { CAT_TYPES } from '../config/cats.js';

const UNLOCK_AFTER = { colonel: 2, duchess: 5 };

export default class LevelComplete extends Phaser.Scene {
  constructor() {
    super('LevelComplete');
  }

  init(data) {
    this.win = data.win;
    this.levelId = data.levelId;
    this.catsRemaining = data.catsRemaining || 0;
    this.starThresholds = data.starThresholds;
    this.stars = this.win ? calculateStars(this.catsRemaining, this.starThresholds) : 0;

    if (this.win) {
      saveResult(this.levelId, this.stars);
    }
  }

  create() {
    const cx = 480;
    this.add.rectangle(cx, 270, 960, 540, 0x000000, 0.55);

    if (!this.win) {
      this._buildLoseScreen();
    } else {
      this._buildWinScreen();
    }
  }

  _buildLoseScreen() {
    const cx = 480;
    this.add.text(cx, 180, 'Uh oh! The nap spot was reached!', {
      fontSize: '28px', color: '#ff4444',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this._addButton(cx, 320, 'Try Again', () => {
      this.scene.start('Game', { levelId: this.levelId });
    });

    this._addButton(cx, 390, 'Main Menu', () => {
      this.scene.start('MainMenu');
    });
  }

  _buildWinScreen() {
    const cx = 480;
    this.add.text(cx, 150, 'Nap spot protected!', {
      fontSize: '32px', color: '#ffdd44',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    const starText = '🐟'.repeat(this.stars) + '🦴'.repeat(3 - this.stars);
    this.add.text(cx, 220, starText, { fontSize: '40px' }).setOrigin(0.5);

    this.add.text(cx, 280, `Cats remaining: ${this.catsRemaining}`, {
      fontSize: '20px', color: '#ffffff',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    const unlock = this._checkUnlock();
    if (unlock) {
      this._addButton(cx, 350, `Meet ${CAT_TYPES[unlock].name}! →`, () => {
        this.scene.start('UnlockCelebration', { catTypeId: unlock, nextLevelId: this.levelId + 1 });
      });
    } else {
      const nextId = this.levelId + 1;
      if (nextId <= 7) {
        this._addButton(cx, 350, 'Next Level →', () => {
          this.scene.start('Game', { levelId: nextId });
        });
      }
      this._addButton(cx, 420, 'Main Menu', () => {
        this.scene.start('MainMenu');
      });
    }
  }

  _checkUnlock() {
    for (const [catId, afterLevel] of Object.entries(UNLOCK_AFTER)) {
      if (this.levelId === afterLevel) return catId;
    }
    return null;
  }

  _addButton(x, y, label, callback) {
    const btn = this.add.text(x, y, label, {
      fontSize: '26px', color: '#fff',
      backgroundColor: '#2255aa',
      padding: { x: 20, y: 10 },
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3377cc' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#2255aa' }));
    btn.on('pointerdown', callback);
  }
}
