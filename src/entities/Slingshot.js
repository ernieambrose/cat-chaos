import CatMittens from './CatMittens.js';
import CatColonel from './CatColonel.js';
import CatDuchess from './CatDuchess.js';

const CAT_CLASSES = {
  mittens: CatMittens,
  colonel: CatColonel,
  duchess: CatDuchess
};

const MAX_DRAG = 90;
const LAUNCH_POWER = 0.14;

export default class Slingshot {
  constructor(scene, x, y, catQueue) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.catQueue = [...catQueue];
    this.activeCat = null;
    this.isDragging = false;
    this.onCatLaunched = null;

    this.sprite = scene.add.image(x, y, 'slingshot').setDepth(1);

    this._spawnNextCat();
    this._setupInput();
  }

  _spawnNextCat() {
    if (this.catQueue.length === 0) {
      this.activeCat = null;
      return;
    }
    const typeId = this.catQueue.shift();
    const CatClass = CAT_CLASSES[typeId];
    this.activeCat = new CatClass(this.scene, this.x, this.y - 30);
  }

  _setupInput() {
    this.scene.input.on('pointerdown', this._onPointerDown, this);
    this.scene.input.on('pointermove', this._onPointerMove, this);
    this.scene.input.on('pointerup', this._onPointerUp, this);
  }

  _onPointerDown(pointer) {
    if (!this.activeCat || this.activeCat.launched) return;
    const dx = pointer.x - this.activeCat.sprite.x;
    const dy = pointer.y - this.activeCat.sprite.y;
    if (Math.sqrt(dx * dx + dy * dy) < 40) {
      this.isDragging = true;
    }
  }

  _onPointerMove(pointer) {
    if (!this.isDragging || !this.activeCat) return;
    const dx = pointer.x - this.x;
    const dy = pointer.y - (this.y - 30);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > MAX_DRAG) {
      const angle = Math.atan2(dy, dx);
      this.activeCat.sprite.x = this.x + Math.cos(angle) * MAX_DRAG;
      this.activeCat.sprite.y = (this.y - 30) + Math.sin(angle) * MAX_DRAG;
    } else {
      this.activeCat.sprite.x = pointer.x;
      this.activeCat.sprite.y = pointer.y;
    }
  }

  _onPointerUp() {
    if (!this.isDragging || !this.activeCat) return;
    this.isDragging = false;

    const vx = (this.x - this.activeCat.sprite.x) * LAUNCH_POWER;
    const vy = ((this.y - 30) - this.activeCat.sprite.y) * LAUNCH_POWER;

    if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return;

    const launched = this.activeCat;
    launched.launch(vx, vy);

    if (this.onCatLaunched) this.onCatLaunched(launched);

    this.scene.time.delayedCall(1500, () => {
      this._spawnNextCat();
    });
  }

  get catsRemaining() {
    return this.catQueue.length + (this.activeCat ? 1 : 0);
  }

  destroy() {
    this.scene.input.off('pointerdown', this._onPointerDown, this);
    this.scene.input.off('pointermove', this._onPointerMove, this);
    this.scene.input.off('pointerup', this._onPointerUp, this);
    this.sprite.destroy();
  }
}
