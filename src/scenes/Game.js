import { parseLevel } from '../utils/LevelLoader.js';
import Slingshot from '../entities/Slingshot.js';
import Dog from '../entities/Dog.js';
import Structure from '../entities/Structure.js';
import Table from '../entities/Table.js';
import NapSpot from '../entities/NapSpot.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

const LEVEL_MODULES = {
  1: () => import('../levels/level1.json'),
  2: () => import('../levels/level2.json'),
  3: () => import('../levels/level3.json'),
  4: () => import('../levels/level4.json'),
  5: () => import('../levels/level5.json'),
  6: () => import('../levels/level6.json'),
  7: () => import('../levels/levelBonus.json'),
  sandbox: () => import('../levels/levelSandbox.json')
};

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.levelId = data.levelId || 1;
    this.levelData = null;
    this.isSandbox = false;
    this.dogs = [];
    this.slingshot = null;
    this.napSpot = null;
    this.activeCat = null;
    this.gameOver = false;
    this.win = false;
  }

  async create() {
    const raw = await LEVEL_MODULES[this.levelId]();
    this.levelData = parseLevel(raw.default || raw);
    this.isSandbox = !!this.levelData.sandbox;

    this._buildGround();
    this._buildLevel();
    this._setupCollisions();
    this._setupAbilityInput();

    this.scene.launch('HUD', { levelId: this.levelId });
  }

  _buildGround() {
    this.matter.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 10, GAME_WIDTH, 20, {
      isStatic: true,
      label: 'ground',
      friction: 0.8
    });

    const g = this.add.graphics();
    g.fillStyle(0x7ec850);
    g.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
  }

  _buildLevel() {
    const { napSpot, slingshot, structures, dogs, tables, catQueue } = this.levelData;

    this.napSpot = new NapSpot(this, napSpot.x, napSpot.y);
    structures.forEach(cfg => new Structure(this, cfg));
    tables.forEach(cfg => new Table(this, cfg));
    this.dogs = dogs.map(cfg => new Dog(this, cfg.x, cfg.y));

    this.slingshot = new Slingshot(this, slingshot.x, slingshot.y, catQueue);
    this.slingshot.onCatLaunched = (cat) => {
      this.activeCat = cat;
      this.scene.get('HUD').events.emit('catLaunched', {
        catsRemaining: this.slingshot.catsRemaining
      });
    };

    this.time.delayedCall(100, () => {
      const hud = this.scene.get('HUD');
      if (hud) {
        hud.events.emit('catLaunched', {
          catsRemaining: this.slingshot.catsRemaining
        });
      }
    });
  }

  _setupCollisions() {
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(({ bodyA, bodyB }) => {
        this._handleCollision(bodyA, bodyB);
        this._handleCollision(bodyB, bodyA);
      });
    });
  }

  _handleCollision(bodyA, bodyB) {
    if (bodyA.label === 'cat' && bodyB.label === 'dog') {
      const dogEntity = bodyB.gameObject?.getData('entity');
      if (dogEntity && !dogEntity.defeated) {
        dogEntity.defeat();
        this._checkWin();
      }
    }

    if (bodyA.label === 'dog' && bodyB.label === 'napSpot') {
      if (!this.isSandbox) this._triggerLose();
    }
  }

  _setupAbilityInput() {
    this.input.on('pointerdown', () => {
      if (this.activeCat && this.activeCat.launched) {
        this.activeCat.useAbility();
      }
    });
  }

  _checkWin() {
    const allDefeated = this.dogs.every(d => d.defeated);
    if (allDefeated && !this.gameOver) {
      this.win = true;
      this.gameOver = true;
      this.time.delayedCall(800, () => this._endLevel());
    }
  }

  _triggerLose() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.time.delayedCall(600, () => {
      this.scene.stop('HUD');
      this.scene.start('LevelComplete', {
        levelId: this.levelId,
        win: false
      });
    });
  }

  _endLevel() {
    const catsRemaining = this.slingshot.catsRemaining;
    this.scene.stop('HUD');
    this.scene.start('LevelComplete', {
      catsRemaining,
      starThresholds: this.levelData.starThresholds,
      levelId: this.levelId,
      win: true
    });
  }

  update() {
    if (this.gameOver) return;
    this.dogs.forEach(dog => dog.update(this.napSpot.x));

    if (this.activeCat?.launched && this.activeCat.isOffScreen(GAME_WIDTH, GAME_HEIGHT)) {
      this.activeCat = null;
      if (this.slingshot.catsRemaining === 0 && !this.isSandbox) {
        this.time.delayedCall(2000, () => {
          if (!this.gameOver) this._triggerLose();
        });
      }
    }
  }
}
