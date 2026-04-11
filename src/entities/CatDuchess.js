import Cat from './Cat.js';

const BURST_MULTIPLIER = 2.5;

export default class CatDuchess extends Cat {
  constructor(scene, x, y) {
    super(scene, x, y, 'duchess');
  }

  useAbility() {
    if (this.abilityUsed || !this.launched) return;
    this.abilityUsed = true;

    const vx = this.sprite.body.velocity.x * BURST_MULTIPLIER;
    const vy = this.sprite.body.velocity.y * BURST_MULTIPLIER;
    this.scene.matter.body.setVelocity(this.sprite.body, { x: vx, y: vy });

    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(150, () => {
      if (this.sprite.active) this.sprite.clearTint();
    });
  }
}
